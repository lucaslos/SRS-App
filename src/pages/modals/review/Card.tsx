import ButtonElement from '@src/components/ButtonElement'
import { cardBaseStyle } from '@src/pages/modals/review/cardStyles'
import { answerActiveCard, ReviewItem } from '@src/stores/reviewStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { transition } from '@src/style/helpers/transition'
import { useSpring } from '@src/utils/hooks/useSpring'
import { cx } from '@utils/cx'
import { css } from 'solid-styled-components'

const containerStyle = css`
  position: absolute;
  ${transition({ properties: ['opacity'] })}
  ${centerContent};
  width: 100%;
  height: 100%;
  perspective: 500px;
  transform-style: preserve-3d;

  &:not(.active) {
    opacity: 0;
    pointer-events: none;
  }

  .front,
  .back {
    will-change: transform;

    &,
    * {
      backface-visibility: hidden;
    }
  }

  .front {
    transform: translate3d(0, 0, var(--z-pos)) rotateX(var(--rotation));
  }

  .back {
    transform: translate3d(0, 0, var(--z-pos))
      rotateX(calc(var(--rotation) - 180deg));
  }
`

export interface ReviewCardProps {
  reviewItem: ReviewItem
  pos: number
  isFlipped: boolean
  flipCard: () => void
}

const ReviewCard = (props: ReviewCardProps) => {
  const zPos = useSpring(() => props.pos * 502, {
    damping: 26,
    stiffness: 100,
  })

  const rotation = useSpring(() => (props.isFlipped ? 180 : 0), {
    damping: 26,
    stiffness: 130,
  })

  return (
    <div
      class={containerStyle}
      style={{
        '--z-pos': `${zPos()}px`,
        '--rotation': `${rotation()}deg`,
      }}
      classList={{
        active: props.pos === 0,
        flipped: props.isFlipped,
      }}
    >
      <div class={cx('front', cardBaseStyle)} onClick={() => props.flipCard()}>
        {props.reviewItem.cardId}
      </div>

      <div class={cx('back', cardBaseStyle)}>
        {props.reviewItem.cof}

        <br />

        <ButtonElement onClick={() => answerActiveCard('wrong')}>NO</ButtonElement>
        <br />

        <ButtonElement onClick={() => answerActiveCard('hard')}>SO SO</ButtonElement>

        <br />
        <ButtonElement onClick={() => answerActiveCard('success')}>OK</ButtonElement>
      </div>
    </div>
  )
}

export default ReviewCard
