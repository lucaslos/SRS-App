import { Temporal } from '@js-temporal/polyfill'
import ButtonElement from '@src/components/ButtonElement'
import LoadingOverlay from '@src/components/LoadingOverlay'
import { cardsStore } from '@src/stores/cardsStore'
import { openReviewDialog, reviewStore } from '@src/stores/reviewStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { inline } from '@src/style/helpers/inline'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { useNavigate } from '@src/utils/navigate'
import { calcCOF, needsReview } from '@src/utils/srsAlgo'
import { createMemo } from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  width: 100%;
  flex: 1 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-content: flex-start;
  padding: 12px;

  .review-group {
    height: 96px;
    width: 360px;
    flex-shrink: 1;
    background: ${gradients.primary};
    border-radius: 16px;
    position: relative;
    ${transition()};

    &:hover {
      box-shadow: 0 0 12px ${colors.white.alpha(0.2)};
    }

    > div {
      letter-spacing: 0.02em;
      padding: 20px 24px;
      font-size: 24px;
      ${fillContainer};
      text-align: left;
    }

    &.new {
      background: ${gradients.secondary};
    }
  }

  .empty-state {
    background: ${gradients.secondary};
    padding: 8px 18px;
    font-size: 20px;
    border-radius: 100px;
    letter-spacing: 0.04em;
    font-weight: 500;
    ${inline({ gap: 5 })};
  }
`

const Home = () => {
  const now = Temporal.now.instant().epochMilliseconds

  type CardsToReview = {
    new: number
    review: number
  }

  const cardsToReview = createMemo<CardsToReview>((prev) => {
    const cards: CardsToReview = {
      new: 0,
      review: 0,
    }

    if (reviewStore.status !== 'closed') return prev || cards

    for (const cardId of cardsStore.cards.allIds) {
      const card = cardsStore.cards.byId[cardId]

      if (!card || card.draft) continue

      if (!card.lastReview) {
        cards.new++
        continue
      }

      if (needsReview(calcCOF(card, now))) {
        cards.review++
      }
    }

    return cards
  })

  return (
    <div class={containerStyle}>
      <Match when={cardsStore.status === 'loading'}>
        <LoadingOverlay />
      </Match>

      <Switch>
        <Match when={cardsToReview().review + cardsToReview().new === 0}>
          <div className="empty-state">
            <span>Nothing to review</span>
            <span>🌞</span>
          </div>
        </Match>

        <Match when>
          <Show when={cardsToReview().review > 10}>
            <ButtonElement
              className="review-group"
              onClick={() => openReviewDialog('review', 10)}
            >
              <div>Review 10</div>
            </ButtonElement>
          </Show>

          <Show when={cardsToReview().review > 20}>
            <ButtonElement
              className="review-group"
              onClick={() => openReviewDialog('review', 20)}
            >
              <div>Review 20</div>
            </ButtonElement>
          </Show>

          <Show when={cardsToReview().review > 0}>
            <ButtonElement
              className="review-group"
              onClick={() => openReviewDialog('review', cardsToReview().review)}
            >
              <div>Review All {cardsToReview().review}</div>
            </ButtonElement>
          </Show>

          <Show when={cardsToReview().new > 10}>
            <ButtonElement
              className="review-group new"
              onClick={() => openReviewDialog('reviewNew', 10)}
            >
              <div>Review 10 New</div>
            </ButtonElement>
          </Show>

          <Show when={cardsToReview().new > 20}>
            <ButtonElement
              className="review-group new"
              onClick={() => openReviewDialog('reviewNew', 20)}
            >
              <div>Review 20 New</div>
            </ButtonElement>
          </Show>

          <Show when={cardsToReview().new > 0}>
            <ButtonElement
              className="review-group new"
              onClick={() => openReviewDialog('reviewNew', cardsToReview().new)}
            >
              <div>Review All New {cardsToReview().new}</div>
            </ButtonElement>
          </Show>
        </Match>
      </Switch>
    </div>
  )
}

export default Home
