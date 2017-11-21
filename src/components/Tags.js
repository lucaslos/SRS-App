import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { WithContext as ReactTags } from 'react-tag-input';

import Icon from 'components/Icon';


const RemoveComponent = ({ onClick, readOnly }) => ( // eslint-disable-line
  <div className="delete-tag-btn" onClick={onClick} readOnly={readOnly}>
    <Icon name="close" />
  </div>
);

class TagsInput extends React.Component {
  componentWillMount() {
    this.setState({
      tags: this.props.tags || [],
      suggestions: this.props.tagsSuggestion || [],
    });
  }

  getTags = () => (this.state.tags);

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
    this.props.handleChange('tags', this.state.tags);
  }

  render() {
    const { tags, suggestions } = this.state;

    return (
      <ReactTags
        tags={tags}
        removeComponent={RemoveComponent}
        suggestions={suggestions}
        placeholder="ADD TAG"
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        minQueryLength={1}
        allowDeleteFromEmptyInput={false}
        autofocus={false}
      />
    );
  }
}

TagsInput.propTypes = {
  tagsSuggestion: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.object),
  handleChange: PropTypes.func,
};

const mapStateToProps = state => ({
  tagsSuggestion: state.tagsSuggestion,
});

export default connect(mapStateToProps)(TagsInput);
