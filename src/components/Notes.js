import React from 'react';
import PropTypes from 'prop-types';
import { WithOutContext as ReactTags } from 'react-tag-input';

import Icon from 'components/Icon';


const RemoveComponent = ({ onClick, readOnly }) => ( // eslint-disable-line
  <div className="delete-tag-btn" onClick={onClick} readOnly={readOnly}>
    <Icon name="close" />
  </div>
);

class TagsInput extends React.Component {
  componentWillMount() {
    this.setState({
      tags: this.props.notes || [],
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.notes || [],
    });
  }

  getNotes = () => (this.state.tags);

  handleDelete = (i) => {
    const tags = this.state.tags.filter((tag, index) => index !== i);
    this.setState({ tags }, this.handleChange);
  }

  handleAddition = (tag) => {
    const tags = [...this.state.tags, {
      id: this.state.tags.length + 1,
      text: tag,
    }];
    this.setState({ tags }, this.handleChange);
  }

  handleChange = () => {
    this.props.handleChange('notes', this.state.tags);
  }

  render() {
    const { tags } = this.state;

    return (
      <ReactTags
        tags={tags}
        removeComponent={RemoveComponent}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        placeholder="Add new note"
        minQueryLength={1}
        allowDeleteFromEmptyInput={false}
        autofocus={false}
      />
    );
  }
}

TagsInput.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object),
};

export default TagsInput;
