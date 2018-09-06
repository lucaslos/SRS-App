/* eslint global-require: 0, import/no-dynamic-require: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { version } from '../../package.json';

import initialState from 'store/initialState';
import * as sectionsActions from 'actions/sectionsActions';

import AnimateMount from 'components/AnimateMount';
import Header from 'containers/Header';
import Section from 'containers/Section';
import { showError } from '../actions/errorActions';

let firstRunNotConnected = true;
let firstRunConnected = true;

// load Modals dinamically from inital store
const ModalsComponents = Object.assign(
  ...Object.entries(initialState.modalsVisibility)
  .map(d => ({
    [d[0]]: require(`containers/${d[0]}`),
  }))
);

class App extends React.Component {
  state = {
    isConnected: false,
  };

  componentDidMount() {
    console.log(version);
    // populate store

    const initialize = () => {
      this.props.fetchSections().then(() => {
        if (this.props.match.path === '/') { // eslint-disable-line react/prop-types
          this.props.setActiveSection('57522bf113391');
        } else {
          const sectionId = this.props.match.params.section; // eslint-disable-line react/prop-types

          this.props.fetchSections().then(() => {
            this.props.setActiveSection(sectionId);
          });
        }
      });
    };

    const login = () => {
      if (!localStorage.password && localStorage.password === 'null') {
        localStorage.password = prompt('????');
      }

      firebase.auth().signInWithEmailAndPassword('lucas@sugestly.com', localStorage.password)
        .catch((err) => {
          if (err) {
            localStorage.password = null;

            login();
          }
        });
    };

    firebase.auth().onAuthStateChanged((user) => {
      window.user = user; // user is undefined if no user signed in

      if (user) {
        initialize();
      } else {
        login();
      }
    });

    const connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', (snap) => {
      if (!snap.val()) {
        this.changeConnectionState(false);
      } else {
        this.changeConnectionState(true);
      }
    });
  }

  changeConnectionState = (connected) => {
    this.setState({
      isConnected: connected,
    });
  }

  render() {
    const { modals } = this.props;
    const { isConnected } = this.state;

    const disableMainContainer = !Object.values(modals).every(elem => !elem);

    return (
      <div>
        <div className={`main-container ${disableMainContainer ? 'disable' : ''}`}>
          <Section />
          <Header />
        </div>
        <div
          className={`color-overlay ${disableMainContainer ? 'show' : ''}`}
          style={{ backgroundColor: modals.RevisionModal ? 'rgba(204, 204, 204, 0.6)' : '' }}
        />
        {React.createElement(ModalsComponents.Menu.default, { isActive: modals.Menu })}
        {Object.keys(modals).map((key) => {
          if (key !== 'Menu') {
            const Modal = ModalsComponents[key].default;

            return (
              <AnimateMount
                key={key}
                containerClass={`modals-container modal-${key}`}
                useClass
                mounted={modals[key]}
              >
                <Modal />
              </AnimateMount>
            );
          }

          return null;
        })}
        {!isConnected && <div className="connection-container"><div>Not Connected</div></div>}
      </div>
    );
  }
}

App.propTypes = {
  fetchSections: PropTypes.any,
  setActiveSection: PropTypes.any,
  modals: PropTypes.any,
};

const mapStateToProps = state => ({
  modals: state.modalsVisibility,
});

const mapDispatchToProps = dispatch => ({
  setActiveSection: sectionId => dispatch(sectionsActions.setActiveSection(sectionId)),
  fetchSections: () => dispatch(sectionsActions.fetchSections()),
  showError: error => dispatch(showError(error, true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
