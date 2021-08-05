import ButtonElement from '@src/components/ButtonElement'
import Icon from '@src/components/Icon'
import { cardBaseStyle } from '@src/pages/modals/review/cardStyles'
import { Card, cardsStore } from '@src/stores/cardsStore'
import { answerActiveCard, ReviewItem } from '@src/stores/reviewStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { inline } from '@src/style/helpers/inline'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { useSpring } from '@src/utils/hooks/useSpring'
import { cx } from '@utils/cx'
import { createMemo, createSignal } from 'solid-js'
import snarkdown from 'snarkdown'
import { css } from 'solid-styled-components'
import { gradientText } from '@src/style/helpers/gradientText'
import { interpolate } from '@utils/interpolate'
import { clamp } from '@utils/clamp'
import { getRankingStats } from '@src/utils/getRankingStats'
import { textToSpeech } from '@src/utils/textToSpeech'
import { getHighlightedText } from '@src/utils/getHighlightedText'

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
    overflow: hidden;

    &,
    * {
      backface-visibility: hidden;
    }
  }
`

const attentionRequiredTagStyle = css`
  ${inline({ gap: 8 })};
  letter-spacing: 0.02em;
  font-weight: 500;
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 40px;
  background: ${gradients.red};
  color: ${colors.bgPrimary.var};
  --icon-size: 18px;
`

const frontStyle = css`
  cursor: pointer;
  transform: translate3d(0, 0, var(--z-pos)) rotateX(var(--rotation));
  padding: 16px;
  ${stack()};

  .content {
    margin-block: auto;
    padding: 28px 36px;
    line-height: 1.5;
    letter-spacing: 0.01em;
    font-weight: 350;

    strong em {
      background: ${gradients.primary};
      padding: 1px 8px 2px;
      border-radius: 4px;
      font-weight: 450;
      white-space: break-spaces;
    }
  }

  .tags {
    ${inline({ justify: 'center' })};
    gap: 12px;
    width: 100%;
    flex-wrap: wrap;

    .tag {
      background: ${colors.primary.alpha(0.16)};
      color: ${colors.primary.var};
      height: 34px;
      ${centerContent};
      padding: 0 16px;
      border-radius: 34px;
      letter-spacing: 0.01em;

      &.stat {
        background: ${gradients.secondary};
        color: ${colors.bgPrimary.var};
        font-weight: 600;
      }
    }
  }
`

const backStyle = css`
  transform: translate3d(0, 0, var(--z-pos))
    rotateX(calc(var(--rotation) - 180deg));
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  padding: 0;

  .answer-1 {
    grid-row: 2;
    padding: 28px 36px;
    line-height: 1.5;
    letter-spacing: 0.01em;
    font-weight: 350;
    align-self: center;
    justify-self: center;
  }

  .show-answer-2,
  .answer-2 {
    grid-row: 3;
    background: ${colors.secondary.alpha(0.22)};
    padding: 12px 16px;
    margin: 0 20px;
    border-radius: 18px;
    letter-spacing: 0.01em;
    ${transition()};
    margin-bottom: 22px;
  }

  .show-answer-2 {
    font-size: 18px;
    color: ${colors.secondary.var};
    font-weight: 500;
    letter-spacing: 0.04em;
    &:hover {
      background: ${colors.secondary.alpha(0.32)};
    }
  }

  .answer-2 {
    line-height: 1.5;
    font-weight: 350;
  }

  .buttons {
    grid-row: 4;
    ${inline()};

    button {
      padding: 0 8px;
      height: 66px;
      width: 60px;
      flex-grow: 1;
      position: relative;
      ${inline()};
      padding: 0 32px;

      &:disabled {
        opacity: 0.4;
        pointer-events: none;
      }

      .icon {
        ${transition()};
      }

      &:hover .icon {
        transform: scale(1.1);
      }
    }

    .wrong {
      color: ${colors.secondary.var};
    }

    .hard {
      justify-content: center;
      color: ${colors.primary.var};
    }

    .success,
    .hard {
      --icon-size: 32px;
    }

    .success {
      --icon-size: 38px;
      justify-content: flex-end;
      color: ${colors.success.var};
    }
  }
`

interface CardData extends Partial<Card> {
  tags: string[]
  frontFontSize: string
  answerFontSize: string
  wrongReviews: number
  difficulty: number
  frontHTML: string
  answerHTML: string
  answer2HTML: string
}

export interface ReviewCardProps {
  reviewItem: ReviewItem
  pos: number
  isFlipped: boolean
  flipCard: () => void
}

const ReviewCard = (props: ReviewCardProps) => {
  const [showAnswer2, setShowAnswer2] = createSignal(false)

  const card = createMemo(() => {
    let cardData: CardData = {
      tags: [],
      frontFontSize: getTextSize(null),
      answerFontSize: getTextSize(null),
      wrongReviews: 0,
      difficulty: 0,
      frontHTML: '',
      answerHTML: '',
      answer2HTML: '',
    }

    const itemCard = cardsStore.cards.byId[props.reviewItem.cardId] ?? null

    if (!itemCard) return cardData

    cardData = {
      ...cardData,
      ...itemCard,
      tags: itemCard.tags ? itemCard.tags : [],
    }

    cardData.frontFontSize = getTextSize(itemCard.front)
    cardData.frontHTML = snarkdown(itemCard.front)

    if (itemCard.answer) {
      cardData.answerFontSize = getTextSize(itemCard.answer)
      cardData.answerHTML = snarkdown(itemCard.answer)
    }

    if (itemCard.answer2) {
      cardData.answer2HTML = snarkdown(itemCard.answer2)
    }

    return cardData
  })

  const zPos = useSpring(() => props.pos * 502, {
    damping: 26,
    stiffness: 100,
  })

  const rotation = useSpring(() => (props.isFlipped ? 180 : 0), {
    damping: 26,
    stiffness: 130,
  })

  const attentionRequiredTag = (
    <Show when={card().wrongReviews > 4 || card().difficulty > 0.4}>
      <div class={attentionRequiredTagStyle}>
        <Icon name="warning" /> <span>Attention Required</span>
      </div>
    </Show>
  )

  const rankingStats = createMemo(() => {
    const { front } = card()

    return front ? getRankingStats(front) : null
  })

  const [blockInteraction, setBlockInteraction] = createSignal(false)

  function answerCard(answer: 'wrong' | 'hard' | 'success') {
    setBlockInteraction(true)

    void textToSpeech(getHighlightedText(card().front ?? '')).then(() => {
      answerActiveCard(answer)
      setBlockInteraction(false)
    })
  }

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
      <div
        class={cx('front', frontStyle, cardBaseStyle)}
        onClick={() => props.flipCard()}
      >
        {attentionRequiredTag}

        <div
          class="content"
          style={{ 'font-size': card().frontFontSize }}
          innerHTML={card().frontHTML}
        />

        <div class="tags">
          <For each={card().tags}>{(tag) => <div class="tag">{tag}</div>}</For>

          <Show when={rankingStats()?.ccae}>
            {({ position }) => <div class="tag stat">TOP {position}</div>}
          </Show>

          <Show when={rankingStats()?.oxford}>
            {(rankingItem) => (
              <div
                class="tag stat"
                title={`${rankingItem.type} | ${rankingItem.position} | ${rankingItem.cerfDescription}`}
              >
                {rankingItem.cerf}
              </div>
            )}
          </Show>
        </div>
      </div>

      <div
        class={cx('back', backStyle, cardBaseStyle)}
        style={{ 'pointer-events': blockInteraction() ? 'none' : undefined }}
      >
        {attentionRequiredTag}

        <div
          class="answer-1"
          style={{ 'font-size': card().answerFontSize }}
          innerHTML={card().answerHTML}
        />

        <Show when={card().answer2 && !showAnswer2()}>
          <ButtonElement
            class="show-answer-2"
            onClick={() => setShowAnswer2(true)}
          >
            Show 2nd Answer
          </ButtonElement>
        </Show>

        <Show when={showAnswer2()}>
          <div class="answer-2" innerHTML={card().answer2HTML!} />
        </Show>

        <div class="buttons">
          <ButtonElement class="wrong" onClick={() => answerCard('wrong')}>
            <Icon name="close" />
          </ButtonElement>

          <ButtonElement class="hard" onClick={() => answerCard('hard')}>
            <Icon name="check" />
          </ButtonElement>

          <ButtonElement
            class="success"
            disabled={showAnswer2()}
            onClick={() => answerCard('success')}
          >
            <Icon name="double-check" />
          </ButtonElement>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard

function getTextSize(text: string | null | undefined): string {
  if (!text) return '28px'

  const fontSize = interpolate(text.length, [150, 300], [28, 18])

  return `${fontSize}px`
}
