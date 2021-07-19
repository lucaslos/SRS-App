import { Temporal } from '@js-temporal/polyfill'
import ButtonElement from '@src/components/ButtonElement'
import ModalContainer from '@src/components/ModalContainer'
import ReviewDialog from '@src/pages/modals/review/ReviewDialog'
import ReviewSession from '@src/pages/modals/review/ReviewSession'
import ReviewStats from '@src/pages/modals/review/ReviewStats'
import { closeReview, reviewStore, startReview } from '@src/stores/reviewStore'
import { centerContent } from '@src/style/helpers/centerContent'
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

const containerStyle = css`
  ${fillContainer};
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 80px 1fr 100px;
  pointer-events: none;
  ${transition()};

  .modal-container-from &,
  .modal-container-exit & {
    opacity: 0;
    transform: scale(0.95);
  }

  .modal-container-appear & {
    opacity: 1;

    > * {
      pointer-events: auto;
    }
  }

  .dialog-container {
    grid-row: 2;
    ${fillContainer};
    ${centerContent};
  }
`

const ModalContent = () => {
  const dialogCard = useAnimateMount(() => reviewStore.status === 'dialog')

  const statsCard = useAnimateMount(() => reviewStore.status === 'ended')

  return (
    <div class={containerStyle}>
      <Show when={dialogCard.mount()}>
        <div class={cx('dialog-container', dialogCard.className())}>
          <ReviewDialog />
        </div>
      </Show>

      <Show
        when={
          reviewStore.status === 'inProgress' || reviewStore.status === 'ended'
        }
      >
        <ReviewSession />
      </Show>

      <Show when={statsCard.mount()}>
        <div class={cx('dialog-container', statsCard.className())}>
          <ReviewStats />
        </div>
      </Show>
    </div>
  )
}

const Review = () => {
  return (
    <ModalContainer
      show={reviewStore.status !== 'closed'}
      onClose={() => {
        if (reviewStore.status !== 'inProgress') {
          closeReview()
        }
      }}
    >
      <ModalContent />
    </ModalContainer>
  )
}

export default Review
