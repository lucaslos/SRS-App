import { useRouter } from '@rturnq/solid-router'
import AddOrEditCard from '@src/components/AddOrEditCard'
import ModalContainer from '@src/components/ModalContainer'
import { navigate } from '@src/utils/navigate'

interface AddCardProps {
  show: boolean
}

const AddCard = (props: AddCardProps) => {
  function close() {
    navigate(null)
  }
  return (
    <ModalContainer show={props.show} onClose={close}>
      <AddOrEditCard onClose={close} />
    </ModalContainer>
  )
}

export default AddCard
