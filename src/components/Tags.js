import React from 'react';
import PropTypes from 'prop-types';
import ReactTags from 'components/ReactTagInput';

import Icon from 'components/Icon';
import css from '@emotion/css';
import { fontDecorative, colorPrimary, colorSecondary, colorSecondaryDarker, colorRed } from 'style/theme';
import { rgba } from 'polished';
import { circle } from 'style/mixins';
import { centerContent, centerContentCollum } from 'style/modifiers';

const style = css`
  ${centerContentCollum};
  width: 100%;
  padding: 0 16px;
  z-index: 1;
  min-height: 110px;

  header {
    position: relative;
    width: 100%;
    text-align: center;
    font-family: ${fontDecorative};
    color: ${colorPrimary};
    margin-bottom: 14px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 9px;
      width: 100%;
      height: 1px;

      background: ${rgba(colorPrimary, 0.2)}
    }
  }

  input, .ReactTags__tag {
    float: left;
    height: 32px;
    line-height: 31px;
    width: 124px;
    padding: 0 16px;
    font-size: 18px;
    font-family: 'Source Sans Pro';
    font-weight: 400;
    letter-spacing: 1px;
    vertical-align: middle;
    margin-right: 12px;
    border-radius: 32px;
    margin-bottom: 8px;
    outline: none;
    border: 0;
    background: ${rgba(colorPrimary, 0.5)};
  }

  input {
    border: 1.5px solid ${rgba(colorPrimary, 0.5)};

    &::placeholder {
      font-size: 16px;
      font-family: 'Source Sans Pro';
      color: ${colorSecondaryDarker};
    }
  }

  .ReactTags__tag {
    width: auto;
    padding-right: 32px;
    background: ${colorPrimary};
    color: ${colorSecondaryDarker};
  }

  .ReactTags__tags, .ReactTags__selected {
    /* overflow-y: auto; */

    height: 100%;
  }

  .delete-tag-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    ${circle(28)};
    ${centerContent};

    cursor: pointer;

    &:hover {
      svg {
        fill: ${colorRed};
      }
    }
  }

  .ReactTags__selected {
    > * {
      float: left;
    }
  }

  .ReactTags__suggestions {
    position: absolute;
    top: 100%;
    background: #fff;
    margin-top: -8px;
    border-radius: 4px;
    overflow: hidden;
    font-size: 14px;

    color: ${colorSecondaryDarker};

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      /* height: 24px; */
      padding: 6px 8px;
    }

    .ReactTags__activeSuggestion {
      background: #ddd;
    }

    mark {
      background: none;
      font-weight: 600;
    }
  }
`;

const RemoveComponent = ({ onClick, readOnly }) => ( // eslint-disable-line
  <div className="delete-tag-btn" onClick={onClick} readOnly={readOnly}>
    <Icon name="close" size={18} color={colorSecondary} />
  </div>
);

class TagsInput extends React.Component {
  componentWillMount() {
    this.setState({
      tags: this.props.tags || [],
      suggestions: this.props.tagsSuggestion || [],
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      suggestions: nextProps.tagsSuggestion,
      tags: nextProps.tags,
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
      <div css={style}>
        <header>TAGS</header>
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
      </div>
    );
  }
}

TagsInput.propTypes = {
  tagsSuggestion: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.object),
  handleChange: PropTypes.func,
};

export default TagsInput;
