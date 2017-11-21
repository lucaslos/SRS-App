import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'components/Icon';

import { setModalVisibility } from 'actions/modalsActions';
import { setActiveGroup } from 'actions/groupsActions';

const Group = ({ data, setActiveGroupId, showRevisionModal, domain }) => {
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

  return (
    <div
      className="group"
      onClick={() => {
        setActiveGroupId(data.id);
        showRevisionModal();
      }}
      style={{ order: domain === 'new' ? -1000 : Math.floor(domain * -1000) }}
    >
      <p><span>{data.name}</span></p>
      <div className={`group-domain ${domainClass}`}>
        <Icon name={domainClass} />
      </div>
    </div>
  );
};

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
