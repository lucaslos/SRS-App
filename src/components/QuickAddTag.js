import React from 'react';
import { connect } from 'react-redux';

import * as cardsActions from 'actions/cardsActions';

const QuickAddTag = ({ addTag, tagsSuggestion, cardTags, cardId }) => {
  let tagsControl = 0;

  return (
    <div className="quick-add-tag">
      {tagsSuggestion.map((tag, i) => {
        if (!cardTags.includes(tag) && tagsControl < 7) {
          tagsControl++;

          return (
            <div
              className="add-tag button small raised rounded"
              key={i}
              onClick={() => { addTag(tag, cardId); }}
              title={tag}
            >{tag}</div>
          )
        }

        return null;
      })}
    </div>
  );
}

const mapStateToProps = state => ({
  tagsSuggestion: state.tagsSuggestion,
  cardTags: state.cards.items[state.revision.position].tags,
  cardId: state.cards.items[state.revision.position].id,
});

const mapDispatchToProps = dispatch => ({
  addTag: (tag, cardId) => dispatch(cardsActions.addTag(tag, cardId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickAddTag);
