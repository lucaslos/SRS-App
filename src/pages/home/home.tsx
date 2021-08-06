import { Temporal } from '@js-temporal/polyfill'
import ButtonElement from '@src/components/ButtonElement'
import LoadingOverlay from '@src/components/LoadingOverlay'
import { cardsStore } from '@src/stores/cardsStore'
import { openReviewDialog, reviewStore } from '@src/stores/reviewStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { inline } from '@src/style/helpers/inline'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { useNavigate } from '@src/utils/navigate'
import { calcCOF, needsReview } from '@src/utils/srsAlgo'
import { round } from '@utils/math'
import { createMemo } from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  width: 100%;
  flex: 1 1;
  ${stack()};

  .cards-container {
    gap: 12px;
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
  }

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

const reviewStatsStyle = css`
  ${inline({ justify: 'spaceEvenly' })};
  margin-bottom: 36px;
  background: ${colors.bgSecondary.var};
  border-radius: 100px;
  ${responsiveWidth(440, 12)};
  padding: 12px 8px;

  .item {
    ${stack()};
    width: 64px;

    .value {
      font-size: 24px;
      margin-bottom: 2px;
    }

    .label {
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.06em;
      color: ${colors.primary.var};
    }
  }
`

const days = ['?', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Home = () => {
  const now = Temporal.now.zonedDateTimeISO()
  const tomorrow = now.add({ days: 1 })
  const next2Days = now.add({ days: 2 })

  type CardsStats = {
    new: number
    review: number
    nonDraftTotal: number
    drafts: number
    addedPerWeek: number
    tomorrow: [day: string, value: number]
    next2Days: [day: string, value: number]
  }

  const cardsStats = createMemo<CardsStats>((prev) => {
    const stats: CardsStats = {
      new: 0,
      review: 0,
      addedPerWeek: 0,
      drafts: 0,
      next2Days: ['sun', 0],
      tomorrow: ['mon', 0],
      nonDraftTotal: 0,
    }

    if (reviewStore.status !== 'closed') return prev || stats

    const oneMonthAgoTimestamp = Temporal.now
      .zonedDateTimeISO()
      .subtract({
        months: 1,
      })
      .toInstant().epochMilliseconds

    let cardsAddedInLastMonth = 0

    for (const cardId of cardsStore.cards.allIds) {
      const card = cardsStore.cards.byId[cardId]

      if (!card) continue

      if (card.draft) {
        stats.drafts++
      } else {
        stats.nonDraftTotal++
      }

      if (card.createdAt > oneMonthAgoTimestamp) {
        cardsAddedInLastMonth++
      }

      // review tomorrow and next 2 days
      const cardCOF = calcCOF(card, now.epochMilliseconds)

      if (!needsReview(cardCOF)) {
        const cofTomorrow = calcCOF(card, tomorrow.epochMilliseconds)

        if (needsReview(cofTomorrow)) {
          stats.tomorrow[1]++
        } else {
          const cofNext2Days = calcCOF(card, next2Days.epochMilliseconds)

          if (needsReview(cofNext2Days)) {
            stats.next2Days[1]++
          }
        }
      }

      // new and review

      if (card.draft) continue

      if (!card.lastReview) {
        stats.new++
        continue
      }

      if (needsReview(cardCOF)) {
        stats.review++
      }
    }

    stats.addedPerWeek = cardsAddedInLastMonth / 4.34

    stats.tomorrow[0] = days[tomorrow.dayOfWeek]!
    stats.next2Days[0] = days[next2Days.dayOfWeek]!

    return stats
  })

  function getStatsItem(label: string, value: number, title?: string) {
    return (
      <div class="item" title={title}>
        <div class="value">{value}</div>
        <div class="label">{label}</div>
      </div>
    )
  }

  return (
    <div class={containerStyle}>
      <div class={reviewStatsStyle}>
        {getStatsItem('Drafts', cardsStats().drafts)}
        {getStatsItem('Total', cardsStats().nonDraftTotal)}
        {getStatsItem(
          'Add/week',
          round(cardsStats().addedPerWeek),
          String(round(cardsStats().addedPerWeek, 3)),
        )}
        {getStatsItem(...cardsStats().tomorrow)}
        {getStatsItem(...cardsStats().next2Days)}
      </div>

      <Switch>
        <Match when={cardsStore.status === 'loading'}>
          <LoadingOverlay />
        </Match>

        <Match when={cardsStats().review + cardsStats().new === 0}>
          <div class="empty-state">
            <span>Nothing to review</span>
            <span>🌞</span>
          </div>
        </Match>

        <Match when>
          <div class="cards-container">
            <Show when={cardsStats().review > 10}>
              <ButtonElement
                class="review-group"
                onClick={() => openReviewDialog('review', 10)}
              >
                <div>Review 10</div>
              </ButtonElement>
            </Show>
            <Show when={cardsStats().review > 20}>
              <ButtonElement
                class="review-group"
                onClick={() => openReviewDialog('review', 20)}
              >
                <div>Review 20</div>
              </ButtonElement>
            </Show>
            <Show when={cardsStats().review > 0}>
              <ButtonElement
                class="review-group"
                onClick={() => openReviewDialog('review', cardsStats().review)}
              >
                <div>Review All {cardsStats().review}</div>
              </ButtonElement>
            </Show>
            <Show when={cardsStats().new > 10}>
              <ButtonElement
                class="review-group new"
                onClick={() => openReviewDialog('reviewNew', 10)}
              >
                <div>Review 10 New</div>
              </ButtonElement>
            </Show>
            <Show when={cardsStats().new > 20}>
              <ButtonElement
                class="review-group new"
                onClick={() => openReviewDialog('reviewNew', 20)}
              >
                <div>Review 20 New</div>
              </ButtonElement>
            </Show>
            <Show when={cardsStats().new > 0}>
              <ButtonElement
                class="review-group new"
                onClick={() => openReviewDialog('reviewNew', cardsStats().new)}
              >
                <div>Review All New {cardsStats().new}</div>
              </ButtonElement>
            </Show>
          </div>
        </Match>
      </Switch>
    </div>
  )
}

export default Home
