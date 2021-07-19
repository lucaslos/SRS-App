import ButtonElement from '@src/components/ButtonElement'
import Icon from '@src/components/Icon'
import ReviewCard from '@src/pages/modals/review/Card'
import { cardsStore } from '@src/stores/cardsStore'
import {
  closeReview,
  goToPreviousCard,
  ReviewItem,
  reviewStore,
} from '@src/stores/reviewStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { transition } from '@src/style/helpers/transition'
import { gradients } from '@src/style/theme'
import { createSet } from '@src/utils/hooks/createSet'
import { useAnimateMount } from '@src/utils/hooks/useAnimateMount'
import { clampMin } from '@utils/clamp'
import { cx } from '@utils/cx'
import { PartialRecord } from '@utils/typings'
import { createMemo, createSelector, createSignal } from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  display: grid;
  ${fillContainer};
  grid-template-columns: 100%;
  grid-template-rows: 50px 1fr 80px;

  .top-bar {
  }

  .cards-container {
    position: relative;
    overflow: hidden;
    ${centerContent};
  }

  .progress {
    position: relative;

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

  const flippedCards = createSet<ReviewItem>()

  function goBack() {
    const activeCardIsFlipped = flippedCards.has(visibleCards()[1])

    flippedCards.clear()

    if (!activeCardIsFlipped) {
      goToPreviousCard()
    }
  }

  return (
    <div class={cx(containerStyle, reviewIsInProgres.className())}>
      <div class="top-bar">
        <ButtonElement></ButtonElement>

        <ButtonElement onClick={() => closeReview()}>
          <Icon name="close" />
        </ButtonElement>
      </div>

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

      <div class="progress">
        <ButtonElement
          onClick={() => goBack()}
          classList={{ show: reviewStore.reviewIndex > 0 }}
        >
          Back
        </ButtonElement>

        <div
          className="progress-bar"
          style={{
            '--progress-percent': `${
              ((reviewStore.reviewIndex + 1) / filteredCards().length) * 100
            }%`,
          }}
        />

        <div className="positions">
          {clampMin(reviewStore.reviewIndex + 1, 1)} / {filteredCards().length}
        </div>
      </div>
    </div>
  )
}

export default ReviewSession
