import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

const ItemTypes = { TAG: "tag" };

const tagSource = {
  beginDrag: props => {
    return { id: props.tag.id, index: props.index };
  },
  canDrag: props => props.moveTag && !props.readOnly,
};

const tagTarget = {
  hover: (props, monitor, component) => {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Only perform the move when the mouse has crossed half of the items width
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }


    monitor.getItem().index = hoverIndex;
  },
  canDrop: props => !props.readOnly,
};

function RemoveComponent(props) {
  if (props.readOnly) {
    return <span />;
  }

  if (props.removeComponent) {
    const Component = props.removeComponent;
    return <Component {...props} />;
  }

  return (
    <a onClick={props.onClick} className={props.className}>
      {String.fromCharCode(215)}
    </a>
  );
}

class Tag extends Component {
  render = () => {
    const { props } = this;
    const label = props.tag[props.labelField];
    const {
      connectDragSource,
      isDragging,
      connectDropTarget,
      readOnly,
      CustomRemoveComponent,
    } = props;

    const tagComponent = (
      <span
        style={{ opacity: isDragging ? 0 : 1 }}
        className={props.classNames.tag}>
        {label}
        <RemoveComponent
          className={props.classNames.remove}
          removeComponent={props.removeComponent}
          onClick={props.onDelete}
          readOnly={props.readOnly}
        />
      </span>
    );
    return tagComponent;
  };
}

Tag.PropTypes = {
  labelField: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  tag: PropTypes.object.isRequired,
  moveTag: PropTypes.func,
  removeComponent: PropTypes.func,
  classNames: PropTypes.object,
  readOnly: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
};

Tag.defaultProps = {
  labelField: "text",
  readOnly: false,
};

export default Tag;
