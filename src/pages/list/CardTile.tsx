import ButtonElement from '@src/components/ButtonElement'
import Icon from '@src/components/Icon'
import { Card } from '@src/stores/cardsStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { useNavigate } from '@src/utils/navigate'
import { injectCSS } from '@utils/css'
import { ellipsis } from 'polished'
import { css } from 'solid-styled-components'

const containerStyle = css`
  background: ${gradients.primary};
  height: 60px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr 40px;

  &.draft {
    background: linear-gradient(
      90deg,
      ${colors.secondary.alpha(0.3)},
      ${colors.primary.alpha(0.25)},
      ${colors.bgSecondary.var}
    );
  }

  .content {
    font-weight: 500;
    ${stack({ justify: 'center', align: 'stretch' })};
    letter-spacing: 0.04em;
    text-align: center;
    padding: 0 8px;

    > div {
      ${injectCSS(ellipsis())};
    }

    .answer {
      padding-top: 4px;
      position: relative;
      ${centerContent};

      &::before {
        content: '';
        position: absolute;
        top: 2px;
        height: 1px;
        width: 50px;
        opacity: 0.4;
        background: #fff;
      }
    }
  }

  .delete-button {
    opacity: 0.5;
    ${transition()};

    &:hover {
      opacity: 1;
    }
  }
`

interface CardProps {
  card: Card
  showAnswer: boolean
}

const CardTile = (props: CardProps) => {
  const navigate = useNavigate()

  return (
    <div class={containerStyle} classList={{ draft: props.card.draft }}>
      <ButtonElement
        class="content"
        onClick={() => navigate(null, { edit: props.card.id })}
      >
        <div class="front">{props.card.front}</div>

        <Show when={props.card.answer && props.showAnswer}>
          <div class="answer">{props.card.answer}</div>
        </Show>
      </ButtonElement>

      <ButtonElement
        class="delete-button"
        onClick={() => navigate(null, { delete: props.card.id })}
      >
        <Icon name="trash" />
      </ButtonElement>
    </div>
  )
}

export default CardTile
