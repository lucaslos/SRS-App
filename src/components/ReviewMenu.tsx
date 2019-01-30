import styled from '@emotion/styled';
import Icon from 'components/Icon';
import { rgba } from 'polished';
import React from 'react';
import cardsState from 'state/cards';
import {
  colorPrimary,
  colorRed,
  colorSecondary,
  colorSecondaryDarker,
  colorSecondaryLigher,
  fontSecondary,
} from 'style/theme';
import { showPopUp } from 'utils/review';

type Props = {
  show: boolean;
  card: Card;
  flipped: boolean;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  onClickEdit: genericFunction;
  onClickDelete: genericFunction;
};

const ItensWrapper = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
`;

const Item = styled.div`
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  border: 1px solid ${rgba(colorPrimary, 0.3)};
  border-radius: 4px;
  color: ${colorPrimary};
  cursor: pointer;
  transition: 240ms;

  &:hover {
    background: ${rgba(colorSecondary, 0.6)};
  }

  .icon {
    display: inline-block;
    vertical-align: middle;
    margin-top: -5px;
    margin-right: 6px;
  }
`;

const QuickAddTagsWrapper = styled.div`
  width: 100%;
  margin-top: 12px;
`;

const QuickAddTag = styled.div`
  float: left;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 14px;

  background: ${rgba(colorSecondaryDarker, 0.5)};
  font-family: ${fontSecondary};
  color: ${colorPrimary};
  font-weight: 300;
  letter-spacing: 0.5px;
  border-radius: 32px;
  margin-right: 8px;
  cursor: pointer;

  transition: 240ms;

  b {
    font-weight: 600;
  }

  &:hover {
    background: ${rgba(colorSecondaryDarker, 0.8)};
  }

  &.added {
    background: ${rgba(colorPrimary, 0.6)};
    color: ${colorSecondary};

    &:hover {
      background: ${rgba(colorPrimary, 0.8)};
    }
  }
`;

const Container = styled.div<Pick<Props, 'show'>>`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-shadow: 0 0 4px ${colorSecondaryDarker};
  transition: 160ms ease-out;
  background: ${colorSecondaryLigher};
  padding-left: 90px;
  padding-top: 24px;
  padding-bottom: 16px;
  padding-right: 16px;

  transform: ${props =>
    (props.show ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)')};
`;

const ReviewMenu = ({
  show,
  card,
  flipped,
  handleAddTag,
  handleRemoveTag,
  onClickEdit,
  onClickDelete,
}: Props) => {
  const [suggestedTags] = cardsState.useStore('mostUsedTags');

  function openPopUp(url: Parameters<typeof showPopUp>[0]) {
    showPopUp(url, card.front);
  }

  return (
    <Container show={show}>
      <ItensWrapper>
        {flipped && (
          <Item onClick={onClickEdit}>
            <Icon name="edit" size={20} />
            Edit card
          </Item>
        )}
        <Item
          onClick={onClickDelete}
          css={{ color: colorRed, borderColor: rgba(colorRed, 0.5) }}
        >
          <Icon name="delete" size={20} color={colorRed} />
          Delete card
        </Item>
        {flipped && (
          <>
            <Item onClick={() => openPopUp('searchImages')}>
              <Icon name="image-search" size={20} />
              Search images
            </Item>
            <Item onClick={() => openPopUp('oxford')}>
              <Icon name="link" size={20} />
              Oxford
            </Item>
            <Item onClick={() => openPopUp('googleTranslate')}>
              <Icon name="link" size={20} />
              Google Translate
            </Item>
            <Item onClick={() => openPopUp('merriamWebster')}>
              <Icon name="link" size={20} />
              Merriam Webster
            </Item>
            <Item onClick={() => openPopUp('contextReverso')}>
              <Icon name="link" size={20} />
              Context Reverso
            </Item>
            <Item onClick={() => openPopUp('cambridgeDefinition')}>
              <Icon name="link" size={20} />
              Cambridge Definition
            </Item>
            <Item onClick={() => openPopUp('cambridgeTranslation')}>
              <Icon name="link" size={20} />
              Cambridge Translation
            </Item>
          </>
        )}
      </ItensWrapper>
      <QuickAddTagsWrapper>
        {suggestedTags.slice(0, 10).map(tag => {
          const added = card.tags && card.tags.includes(tag);

          return (
            <QuickAddTag
              className={added ? 'added' : undefined}
              key={tag}
              onClick={() => (added ? handleRemoveTag(tag) : handleAddTag(tag))}
            >
              <b>{added ? '- ' : '+ '}</b>
              {tag}
            </QuickAddTag>
          );
        })}
      </QuickAddTagsWrapper>
    </Container>
  );
};

export default ReviewMenu;
