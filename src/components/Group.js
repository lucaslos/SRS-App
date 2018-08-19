import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'components/Icon';
import moment from 'moment';

import { setModalVisibility } from 'actions/modalsActions';
import { setActiveGroup } from 'actions/groupsActions';

class Group extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, setActiveGroupId, showRevisionModal, domain, numOfCards } = this.props;
    let domainClass;

    if (domain < 1) {
      domainClass = 'check';
    } else if (domain === 1) {
      domainClass = 'warning';
    } else if (domain > 1) {
      domainClass = 'error';
    } else {
      domainClass = 'new';
    }

    const localStorageItem = `averageCardReviewTime${parseInt(data.repetitions, 10) < 1 ? data.repetitions : ''}`;

    const etr = new Date(localStorage.getItem(localStorageItem) * numOfCards * 1000).toISOString().substr(14, 5);

    return (
      <div
        className="group"
        onClick={() => {
          setActiveGroupId(data.id);
          showRevisionModal();
        }}
        ref={(c) => { this.group = c; }}
        title={`Cards: ${numOfCards} ETR: ${etr} D: ${Math.round(domain * 100) / 100} R: ${data.repetitions}`}
        style={{ order: domain === 'new' ? -1000 : Math.floor(domain * -1000) }}
      >
        <p><span>{data.name}</span></p>
        <div className={`group-domain ${domainClass}`}>
          <Icon name={domainClass} />
        </div>
      </div>
    );
  }
}

Group.propTypes = {
  data: PropTypes.object,
  setActiveGroupId: PropTypes.any,
  showRevisionModal: PropTypes.any,
};

const mapDispatchToProps = dispatch => ({
  setActiveGroupId: groupId => dispatch(setActiveGroup(groupId)),
  showRevisionModal: () => dispatch(setModalVisibility('RevisionDialog', true)),
});

export default connect(null, mapDispatchToProps)(Group);
