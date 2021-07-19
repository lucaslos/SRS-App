import ButtonElement from '@src/components/ButtonElement'
import { cardBaseStyle } from '@src/pages/modals/review/cardStyles'
import { closeReview } from '@src/stores/reviewStore'

const ReviewStats = () => {
  return (
    <div class={cardBaseStyle}>
      <h1>Review ended</h1>
      <h2>Est. time ........ min</h2>

      <div className="buttons-container">
        <ButtonElement class="error" onClick={() => closeReview()}>
          All right
        </ButtonElement>
      </div>
    </div>
  )
}

export default ReviewStats
