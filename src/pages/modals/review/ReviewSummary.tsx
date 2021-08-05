import { Temporal } from '@js-temporal/polyfill'
import ButtonElement from '@src/components/ButtonElement'
import Icon from '@src/components/Icon'
import { cardBaseStyle } from '@src/pages/modals/review/cardStyles'
import { closeReview, reviewStore } from '@src/stores/reviewStore'
import { inline } from '@src/style/helpers/inline'
import { stack } from '@src/style/helpers/stack'
import { colors } from '@src/style/theme'
import { formatDuration } from '@src/utils/formatDuration'
import { cx } from '@utils/cx'
import { css } from 'solid-styled-components'

const containerStyle = css`
  ${stack()};
  padding: 0;

  h1 {
    text-transform: uppercase;
    font-size: 22px;
    letter-spacing: 0.04em;
    margin-top: 33px;
    margin-bottom: 20px;
  }

  .time {
    font-size: 18px;
    color: ${colors.primary.var};
    margin-bottom: 8px;
  }

  .answer-count {
    ${inline({ justify: 'spaceEvenly' })};
    width: 100%;
    margin-top: 20px;

    > div {
      ${inline({ gap: 8 })};
      font-size: 32px;
      --icon-size: 32px;

      &.success {
        color: ${colors.success.var};
      }

      &.hard {
        color: ${colors.primary.var};
      }

      &.wrong {
        color: ${colors.secondary.var};
      }
    }
  }

  .stats-bar {
    width: 100%;
    height: 4px;
    margin-top: 8px;
    ${inline()};

    > div {
      height: 100%;

      &.success {
        background: ${colors.success.var};
      }

      &.hard {
        background: ${colors.primary.var};
      }

      &.wrong {
        background: ${colors.secondary.var};
      }
    }
  }

  button {
    margin-top: auto;
    align-self: flex-end;
    font-size: 24px;
    letter-spacing: 0.01em;
    padding: 24px 26px;
  }
`

const ReviewSummary = () => {
  const { endStats } = reviewStore

  if (!endStats) return null

  const time = endStats.endTime - reviewStore.startTime
  const uniqueCardsTotal = endStats.success + endStats.hard + endStats.wrong

  return (
    <div class={cx(cardBaseStyle, containerStyle)}>
      <h1>Review done!</h1>

      <div class="time">Time: {formatDuration(time)}</div>
      <div class="time">
        Time per card: {formatDuration(time / endStats.cards)}
      </div>

      <div class="answer-count">
        {endStats.success && (
          <div class="success">
            <Icon name="double-check" />
            {endStats.success}
          </div>
        )}

        {endStats.hard && (
          <div class="hard">
            <Icon name="check" />
            {endStats.hard}
          </div>
        )}

        {endStats.wrong && (
          <div class="wrong">
            <Icon name="close" size={26} />
            {endStats.wrong}
          </div>
        )}
      </div>

      <div class="stats-bar">
        <div
          class="success"
          style={{
            width: `${(endStats.success / uniqueCardsTotal) * 100}%`,
          }}
        />
        <div
          class="hard"
          style={{
            width: `${(endStats.hard / uniqueCardsTotal) * 100}%`,
          }}
        />
        <div
          class="wrong"
          style={{
            width: `${(endStats.wrong / uniqueCardsTotal) * 100}%`,
          }}
        />
      </div>

      <ButtonElement class="error" onClick={() => closeReview()}>
        Close
      </ButtonElement>
    </div>
  )
}

export default ReviewSummary
