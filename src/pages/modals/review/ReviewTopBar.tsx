import ButtonElement from '@src/components/ButtonElement'
import Icon from '@src/components/Icon'
import TopSheet from '@src/components/modals/TopSheet'
import { Card, cardsStore } from '@src/stores/cardsStore'
import { closeReview, ReviewItem, reviewStore } from '@src/stores/reviewStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { inline } from '@src/style/helpers/inline'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors } from '@src/style/theme'
import { getHighlightedText } from '@src/utils/getHighlightedText'
import { useNavigate } from '@src/utils/navigate'
import { openTranslationPopup, Translators } from '@src/utils/translators'
import { createDynamicCssColor } from '@utils/dynamicCssColor'
import { createSignal } from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  ${inline({ justify: 'spaceBetween' })};
  padding: 20px;
  ${transition()};

  &.hide {
    opacity: 0;
  }

  button {
    color: ${colors.primary.var};

    &.closeButton {
      color: ${colors.secondary.var};
    }
  }
`

const menuButtonColor = createDynamicCssColor()

const menuStyle = css`
  position: relative;
  display: grid;
  grid-template-columns: 50px minmax(200px, auto);

  .closeButton {
    justify-self: center;
    align-self: flex-start;
    padding-top: 18px;
    padding-left: 10px;
    opacity: 0.5;
    ${transition()};
    ${centerContent};

    &:hover {
      opacity: 1;
    }
  }

  .optionsContainer {
    padding: 10px;
    ${stack({ align: 'stretch', gap: 8 })};

    > button {
      ${menuButtonColor.set(colors.primary)};

      &.delete {
        ${menuButtonColor.set(colors.error)};
      }

      ${inline({ gap: 10 })};
      padding: 12px 12px;
      text-transform: uppercase;
      border-radius: 8px;
      background: ${menuButtonColor.alpha(0.1)};
      ${transition()};
      font-size: 16px;
      letter-spacing: 0.08em;

      .icon {
        color: ${menuButtonColor.var};
        --icon-size: 20px;
      }

      &:hover {
        background: ${menuButtonColor.alpha(0.3)};
      }
    }
  }
`

interface ReviewTopBarProps {
  activeItem: ReviewItem | undefined
  activeIsFlipped: boolean
}

const ReviewTopBar = (props: ReviewTopBarProps) => {
  const [menuIsOpen, setMenuIsOpen] = createSignal(false)

  const navigate = useNavigate()

  function getCard() {
    if (props.activeItem?.cardId) {
      return cardsStore.cards.byId[props.activeItem.cardId] ?? null
    }

    return null
  }

  function openTranslation(translator: Translators) {
    const text = getCard()?.front

    if (!text) return

    openTranslationPopup(translator, getHighlightedText(text))
  }

  return (
    <>
      <div
        class={containerStyle}
        classList={{
          hide: reviewStore.status === 'ended',
        }}
      >
        <ButtonElement onClick={() => setMenuIsOpen(true)}>
          <Icon name="more" />
        </ButtonElement>

        <ButtonElement class="closeButton" onClick={() => closeReview()}>
          <Icon name="close" />
        </ButtonElement>
      </div>

      <TopSheet
        align="left"
        show={menuIsOpen()}
        onClose={() => setMenuIsOpen(false)}
      >
        <div class={menuStyle} onClick={() => setMenuIsOpen(false)}>
          <ButtonElement
            class="closeButton"
            onClick={() => setMenuIsOpen(false)}
          >
            <Icon name="close" />
          </ButtonElement>

          <div class="optionsContainer">
            <Show when={props.activeIsFlipped}>
              <ButtonElement onClick={() => openTranslation('cambridge')}>
                <Icon name="external" />
                <span>Cambridge</span>
              </ButtonElement>

              <ButtonElement onClick={() => openTranslation('reversoContext')}>
                <Icon name="external" />
                <span>Reverso Context</span>
              </ButtonElement>

              <ButtonElement onClick={() => openTranslation('googleTranslate')}>
                <Icon name="external" />
                <span>Google Translate</span>
              </ButtonElement>

              <ButtonElement
                onClick={() => navigate(null, { edit: getCard()?.id ?? null })}
              >
                <Icon name="edit" />
                <span>Edit</span>
              </ButtonElement>
            </Show>

            <ButtonElement
              class="delete"
              onClick={() => navigate(null, { delete: getCard()?.id ?? null })}
            >
              <Icon name="trash" />
              <span>Delete</span>
            </ButtonElement>
          </div>
        </div>
      </TopSheet>
    </>
  )
}

export default ReviewTopBar
