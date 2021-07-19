import { useRouter } from '@rturnq/solid-router'
import ButtonElement from '@src/components/ButtonElement'
import ModalContainer from '@src/components/ModalContainer'
import { cardsStore, deleteCard } from '@src/stores/cardsStore'
import { gradientText } from '@src/style/helpers/gradientText'
import { inline } from '@src/style/helpers/inline'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { useNavigate } from '@src/utils/navigate'
import { injectCSS } from '@utils/css'
import { ellipsis } from 'polished'
import { createMemo, untrack } from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  ${responsiveWidth(600)};
  background: ${colors.bgSecondary.var};
  position: absolute;
  bottom: 0;
  max-height: calc(100% - 20px);
  ${transition()};
  ${stack({ align: 'stretch' })};
  border-radius: 22px 22px 0 0;
  overflow: hidden;

  .modal-container-from &,
  .modal-container-exit & {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }

  .modal-container-appear & {
    opacity: 1;
  }

  header {
    padding: 20px 8px;
    letter-spacing: 0.2em;
    text-align: center;
    ${stack()};

    h1 {
      font-weight: 500;
      text-transform: uppercase;
      ${gradientText(gradients.primary)};
      font-size: 24px;
    }

    h2 {
      opacity: 0.4;
      margin-top: 4px;
      ${injectCSS(ellipsis())}
    }
  }

  .buttons-container {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 8px;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      top: 0;
      background: ${gradients.primary};
    }

    > button {
      letter-spacing: 0.2em;
      font-size: 22px;
      height: 52px;

      &.error {
        color: ${colors.error.var};
        font-weight: 600;
      }
    }
  }
`

interface DialogProps {
  onClose: () => void
  id: string
}

const ModalContent = (props: DialogProps) => {
  const cardToDelete = untrack(() => {
    return cardsStore.cards.byId[props.id]
  })

  function onDelete() {
    if (cardToDelete?.id) {
      props.onClose()
      void deleteCard(cardToDelete.id)
    }
  }

  return (
    <div class={containerStyle}>
      <header>
        <h1>Delete card?</h1>
        <h2>Front: {cardToDelete?.front}</h2>
      </header>

      <div className="buttons-container">
        <ButtonElement onClick={() => props.onClose()}>Cancel</ButtonElement>
        <ButtonElement class="error" onClick={() => onDelete()}>
          Delete
        </ButtonElement>
      </div>
    </div>
  )
}

const DeleteCard = () => {
  const navigate = useNavigate()

  const router = useRouter()

  function close() {
    navigate(null)
  }

  return (
    <ModalContainer show={!!router.query.delete} onClose={close}>
      <ModalContent onClose={close} id={router.query.delete!} />
    </ModalContainer>
  )
}

export default DeleteCard
