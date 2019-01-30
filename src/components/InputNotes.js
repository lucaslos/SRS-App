import Icon from 'components/Icon';
import ReactTags from 'components/ReactTagInput';
import { rgba } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';
import { circle } from 'style/mixins';
import { centerContent, centerContentCollum } from 'style/modifiers';
import { colorPrimary, colorRed, colorSecondaryDarker, fontDecorative, colorSecondary } from 'style/theme';
import css from '@emotion/css';
import { mqMobile } from 'style/mediaQueries';

const style = css`
  ${centerContentCollum};
  margin-top: 12px;
  width: 100%;
  padding: 0 16px;
  min-height: 0;

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

      background: ${rgba(colorPrimary, 0.2)};
    }
  }

  input,
  .ReactTags__tag {
    float: left;
    width: 100%;
    text-align: center;
    margin-bottom: 6px;
    border-radius: 50px;
    padding: 8px;
    border: 0;
    font-family: 'Source Sans Pro';
    font-style: italic;
    font-size: 14px;
    color: ${colorPrimary};
    background-color: ${rgba(colorSecondary, 0.8)};

    ${mqMobile} {
      /* padding: 4px; */
      font-size: 12px;
    }
  }

  input {
    background: ${rgba(colorSecondary, 0.5)};
    color: ${colorPrimary};
    outline: none;
    font-weight: 600;
    font-style: normal;
    border: 1px solid ${rgba(colorPrimary, 0.3)};

    &::placeholder {
      font-size: 16px;
      font-family: 'Source Sans Pro';
      color: ${colorPrimary};
    }
  }

  .ReactTags__tags, .ReactTags__selected {
    overflow-y: auto;
    height: 100%;
    width: 100%;
  }

  .ReactTags__tagInput {
    width: 100%;
  }

  .ReactTags__tag {
    padding-right: 32px;
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
`;

const RemoveComponent = (
  { onClick, readOnly } // eslint-disable-line
) => (
  <div className="delete-tag-btn" onClick={onClick} readOnly={readOnly}>
    <Icon name="close" size={18} />
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

  getNotes = () => this.state.tags;

  handleDelete = (i) => {
    const tags = this.state.tags.filter((tag, index) => index !== i);
    this.setState({ tags }, this.handleChange);
  };

  handleAddition = (tag) => {
    const tags = [
      ...this.state.tags,
      {
        id: this.state.tags.length + 1,
        text: tag,
      },
    ];
    this.setState({ tags }, this.handleChange);
  };

  handleChange = () => {
    this.props.handleChange('notes', this.state.tags);
  };

  render() {
    const { tags } = this.state;

    return (
      <div css={style}>
        <header>NOTES</header>
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
      </div>
    );
  }
}

export default TagsInput;
