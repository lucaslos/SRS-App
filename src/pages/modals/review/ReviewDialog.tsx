import { Temporal } from '@js-temporal/polyfill'
import ButtonElement from '@src/components/ButtonElement'
import ModalContainer from '@src/components/ModalContainer'
import ReviewSession from '@src/pages/modals/review/ReviewSession'
import { closeReview, reviewStore, startReview } from '@src/stores/reviewStore'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { inline } from '@src/style/helpers/inline'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { gradients } from '@src/style/theme'
import { useAnimateMount } from '@src/utils/hooks/useAnimateMount'
import { cx } from '@utils/cx'
import { round } from '@utils/math'
import { pipe } from '@utils/pipe'
import { createMemo } from 'solid-js'
import { css } from 'solid-styled-components'

const cardStyle = css`
  ${responsiveWidth(400, 16)};
  background: ${gradients.primary};
  ${transition()};
  ${stack({ align: 'stretch' })};
  border-radius: 16px;
  height: 280px;
  overflow: hidden;
  align-self: center;
  justify-self: center;
  padding: 20px 24px;

  &.new {
    background: ${gradients.secondary};
  }

  h1 {
    font-size: 37px;
    letter-spacing: 0.01em;
    line-height: 1.2;
  }

  h2 {
    letter-spacing: 0.01em;
    margin-top: 6px;
    margin-left: 4px;
  }

  .buttons-container {
    margin-top: auto;
    padding: 2px;
    ${inline({ justify: 'spaceBetween' })}

    > button {
      letter-spacing: 0.01em;
      font-size: 24px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        inset: -10px;
      }
    }
  }

  .dialog-container.anim-exit & {
    opacity: 0;
    transform: scale(0.95);
  }

  .dialog-container.anim-appear &,
  .dialog-container.anim-from & {
    opacity: 1;

    > * {
      pointer-events: auto;
    }
  }
`

const ReviewDialog = () => {
  const estTime = () => {
    const estimatedSecondsPerCard = reviewStore.type === 'review' ? 20 : 30

    const duration = Temporal.Duration.from({
      seconds: estimatedSecondsPerCard * reviewStore.numOfCards,
    })

    return pipe(duration.total({ unit: 'minutes' }), (v) => round(v, 2))
  }

  const isNew = () => reviewStore.type === 'reviewNew'

  return (
    <div class={cx(cardStyle, { new: isNew })}>
      <h1>
        Review
        <br /> {reviewStore.numOfCards} {isNew() ? 'New' : ''} Cards
      </h1>
      <h2>Est. time {estTime()} min</h2>

      <div class="buttons-container">
        <ButtonElement onClick={() => closeReview()}>Cancel</ButtonElement>
        <ButtonElement
          class="error"
          onClick={() => {
            startReview()
          }}
        >
          Start
        </ButtonElement>
      </div>
    </div>
  )
}

export default ReviewDialog
