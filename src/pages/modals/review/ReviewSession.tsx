import ButtonElement from '@src/components/ButtonElement'
import Icon from '@src/components/Icon'
import ReviewCard from '@src/pages/modals/review/Card'
import ReviewTopBar from '@src/pages/modals/review/ReviewTopBar'
import { cardsStore } from '@src/stores/cardsStore'
import {
  goToPreviousCard,
  ReviewItem,
  reviewStore,
} from '@src/stores/reviewStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { gradientText } from '@src/style/helpers/gradientText'
import { inline } from '@src/style/helpers/inline'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { getHighlightedText } from '@src/utils/getHighlightedText'
import { createSet } from '@src/utils/hooks/createSet'
import { useAnimateMount } from '@src/utils/hooks/useAnimateMount'
import { textToSpeech } from '@src/utils/textToSpeech'
import { clampMin } from '@utils/clamp'
import { cx } from '@utils/cx'
import { createMemo } from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  display: grid;
  ${fillContainer};
  grid-template-columns: 100%;
  grid-template-rows: auto 1fr 80px;

  .cards-container {
    position: relative;
    overflow: hidden;
    ${centerContent};
  }

  .progress {
    position: relative;
    ${transition()};

    &.hide {
      opacity: 0;
    }

    .content {
      ${inline({ justify: 'spaceBetween' })};
      ${fillContainer};

      .positions {
        font-size: 30px;
        ${gradientText(gradients.primary)};
      }

      button {
        ${centerContent};
        padding: 0 20px;

        &.sound {
          --icon-size: 30px;
          color: ${colors.secondary.var};
        }

        &.back {
          --icon-size: 30px;
          color: ${colors.primary.var};
        }

        &:disabled {
          opacity: 0.5;
        }
      }
    }

    .progress-bar {
      height: 2px;
      position: absolute;
      top: 0;
      width: 100%;
      background: ${gradients.primary};

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: #000;
        opacity: 0.5;
        ${transition()};
        translate: var(--progress-percent);
      }
    }
  }

  .modal-container-appear {
    &.anim-from,
    &.anim-exit {
      .top-bar {
        opacity: 0;
        transform: scale(0.95);
      }
    }

    &.anim-appear {
      .top-bar {
        opacity: 1;
      }
    }
  }
`

const ReviewSession = () => {
  const reviewIsInProgres = useAnimateMount(
    () => reviewStore.status === 'inProgress',
  )

  const filteredCards = createMemo(() => {
    const { reviewItems } = reviewStore

    return reviewItems.filter((item) => {
      const itemCard = cardsStore.cards.byId[item.cardId]

      if (!itemCard || itemCard.draft) return false

      return true
    })
  })

  type VisibleCards = [
    ReviewItem | undefined,
    ReviewItem | undefined,
    ReviewItem | undefined,
  ]

  const visibleCards = createMemo((): VisibleCards => {
    const { reviewIndex } = reviewStore

    return [
      filteredCards()[reviewIndex - 1],
      filteredCards()[reviewIndex],
      filteredCards()[reviewIndex + 1],
    ]
  })

  function getActiveItem() {
    return visibleCards()[1]
  }

  const flippedCards = createSet<ReviewItem>()

  function goBack() {
    const activeCardIsFlipped = flippedCards.has(getActiveItem())

    flippedCards.clear()

    if (!activeCardIsFlipped) {
      goToPreviousCard()
    }
  }

  function onClickTTS() {
    const cardId = getActiveItem()?.cardId

    if (!cardId) return

    const itemCard = cardsStore.cards.byId[cardId] ?? null

    if (!itemCard) return

    const isFlipped = flippedCards.has(getActiveItem())

    if (isFlipped) {
      void textToSpeech(itemCard.answer ?? '')
    } else {
      void textToSpeech(itemCard.front)
    }
  }

  return (
    <div class={cx(containerStyle, reviewIsInProgres.className())}>
      <ReviewTopBar
        activeItem={getActiveItem()}
        activeIsFlipped={flippedCards.has(getActiveItem())}
      />

      <div class="cards-container">
        <For each={visibleCards()}>
          {(reviewItem, index) =>
            reviewItem && (
              <ReviewCard
                reviewItem={reviewItem}
                pos={index() - 1}
                isFlipped={flippedCards.has(reviewItem)}
                flipCard={() => flippedCards.add(reviewItem)}
              />
            )
          }
        </For>
      </div>

      <div
        class="progress"
        classList={{
          hide: reviewStore.status === 'ended',
        }}
      >
        <div class="content">
          <ButtonElement onClick={() => goBack()} class="back">
            <Icon name="arrow-left" />
          </ButtonElement>

          <div class="positions">
            {clampMin(reviewStore.reviewIndex + 1, 1)} /{' '}
            {filteredCards().length}
          </div>

          <ButtonElement onClick={() => onClickTTS()} class="sound">
            <Icon name="sound" />
          </ButtonElement>
        </div>

        <div
          class="progress-bar"
          style={{
            '--progress-percent': `${
              ((reviewStore.reviewIndex + 1) / filteredCards().length) * 100
            }%`,
          }}
        />
      </div>
    </div>
  )
}

export default ReviewSession
