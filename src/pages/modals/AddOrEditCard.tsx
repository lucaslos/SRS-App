import { useRouter } from '@rturnq/solid-router'
import ButtonElement from '@src/components/ButtonElement'
import ModalContainer from '@src/components/ModalContainer'
import { Switcher } from '@src/components/Switcher'
import TextField from '@src/components/TextField'
import {
  Card,
  cardsStore,
  createCard,
  udpateCard,
} from '@src/stores/cardsStore'
import { reviewStore } from '@src/stores/reviewStore'
import { gradientBorder } from '@src/style/helpers/gradientBorder'
import { gradientText } from '@src/style/helpers/gradientText'
import { inline } from '@src/style/helpers/inline'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { getHighlightedText } from '@src/utils/getHighlightedText'
import { useNavigate } from '@src/utils/navigate'
import { openTranslationPopup, Translators } from '@src/utils/translators'
import { getRegexMatches } from '@utils/getRegexMatches'
import { iife } from '@utils/iife'
import { typedObjectEntries, typedObjectKeys } from '@utils/typed'
import { dequal } from 'dequal'
import { createMemo, createSignal } from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'
import { css } from 'solid-styled-components'

const cardStyle = css`
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

  footer {
    ${inline({ justify: 'spaceBetween' })};
    height: 70px;
    position: relative;
    margin-top: 8px;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      top: 0;
      background: ${gradients.primary};
    }

    button {
      font-size: 20px;
      letter-spacing: 0.02em;
      height: 100%;
      padding: 0 32px;
      ${transition()};

      &:disabled {
        opacity: 0.5;
      }
    }
  }
`

const contentStyle = css`
  padding: 22px;
  flex-shrink: 1;
  overflow-y: auto;

  header {
    ${inline()};
    padding-left: 2px;
    margin-bottom: 18px;

    h1 {
      flex: 1 1;
      font-size: 22px;
      letter-spacing: 0.08em;
      text-transform: uppercase;

      span {
        ${gradientText(gradients.primary)};
        font-weight: 500;
      }
    }
  }

  .fields-container {
    ${stack({ gap: 20 })};
  }

  .section {
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
    ${stack({ align: 'stretch' })};

    h1 {
      text-transform: uppercase;
      color: ${colors.primary.var};
      letter-spacing: 0.22em;
      margin-bottom: 16px;
      margin-left: 12px;

      &.secondary {
        color: ${colors.secondary.var};
        opacity: 0.8;
      }
    }
  }

  .translate-buttons {
    ${inline({ gap: 10 })};
    flex-wrap: wrap;
    row-gap: 10px;

    button {
      ${gradientBorder({
        gradient: gradients.primary,
        background: colors.bgSecondary.var,
        borderSize: 1,
      })};
      border-radius: 32px;
      height: 32px;
      font-size: 14px;
      padding: 0 16px;
      letter-spacing: 0.04em;

      &::before {
        ${transition()};
      }

      &:hover::before {
        opacity: 0.9;
      }
    }
  }

  .review-data-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    column-gap: 20px;
    row-gap: 12px;
  }
`

type FormData = {
  front: string | null
  answer: string | null
  answer2: string | null
  tags: string[] | null
  lastReview: string | null
  difficulty: number
  reviews: number
  wrongReviews: number
  draft: boolean
}

interface ModalContentProps {
  onClose: () => void
  editCard?: string
}

const ModalContent = (props: ModalContentProps) => {
  const [keepOpenAfterSave, setKeepOpenAfterSave] = createSignal(false)
  const router = useRouter()

  const editCard = iife(() => {
    if (!props.editCard) return false

    const cardToEdit = cardsStore.cards.byId[props.editCard]

    return cardToEdit || false
  })

  const initialValues: FormData = editCard
    ? {
        front: editCard.front,
        answer: editCard.answer,
        answer2: editCard.answer2,
        tags: editCard.tags,
        draft: editCard.draft,
        lastReview: editCard.lastReview,
        difficulty: editCard.difficulty || 0,
        reviews: editCard.reviews || 0,
        wrongReviews: editCard.wrongReviews || 0,
      }
    : {
        front: null,
        answer: null,
        answer2: null,
        tags: null,
        draft: false,
        lastReview: null,
        difficulty: 0,
        reviews: 0,
        wrongReviews: 0,
      }

  const [formData, setFormData] = createStore<FormData>({ ...initialValues })

  function setField<T extends keyof FormData>(field: T, value: FormData[T]) {
    setFormData(field, normalizeValue(value) as any)
  }

  const isDraft = createMemo((): boolean => {
    if (formData.answer === null) return true

    return formData.draft
  })

  const saveIsDisabled = createMemo((): boolean => {
    if (formData.front === null) return true

    if (formData.answer2 && !formData.answer) return true

    if (isDraft() && !formData.answer) return true

    if (editCard) {
      return dequal(initialValues, formData)
    }

    return false
  })

  function onClickSave() {
    if (saveIsDisabled()) return

    if (editCard) {
      const changedValues: Partial<Card> = {}

      const normalizedValues: Omit<Card, 'id' | 'createdAt'> = {
        ...formData,
        front: formData.front || '',
        difficulty: formData.difficulty || 0,
        wrongReviews: formData.wrongReviews || 0,
        reviews: formData.reviews || 0,
        lastReview: formData.lastReview || null,
      }

      for (const [key, value] of typedObjectEntries(normalizedValues)) {
        if (!dequal(initialValues[key], value)) {
          changedValues[key] = value as any
        }
      }

      void udpateCard(editCard.id, changedValues)

      props.onClose()

      return
    }

    void createCard({
      ...formData,
      front: formData.front || '',
      lastReview: null,
      draft: isDraft(),
      difficulty: 0,
      wrongReviews: 0,
      createdAt: Date.now(),
      reviews: 0,
    })

    if (keepOpenAfterSave()) {
      props.onClose()
      setTimeout(() => {
        router.push('?add')
      }, 400)
    } else {
      props.onClose()
    }
  }

  function getTextFieldProps<T extends keyof FormData>(field: T) {
    const isNumber = typeof initialValues[field] === 'number'

    return {
      defaultValue: initialValues[field] as string,
      onChange: (value: string) => {
        setField(field, (isNumber ? Number(value) || 0 : value) as any)
      },
    }
  }

  function openTranslation(translator: Translators) {
    const text = formData.front

    if (!text) return

    openTranslationPopup(translator, getHighlightedText(text))
  }

  return (
    <div class={cardStyle}>
      <div class={contentStyle}>
        <header>
          <h1>
            <span>{editCard ? `Edit card` : 'Add card'}</span>
          </h1>

          <Switcher
            label="Draft"
            checked={isDraft()}
            onChange={(checked) => setField('draft', checked)}
          />
        </header>

        <div class="fields-container">
          <TextField
            multiline
            highlightText
            defaultValue={initialValues.front}
            onChange={(value) => {
              setField('front', value)
            }}
            label="Front"
          />

          {/* TODO: translation buttons */}

          <div class="section">
            <h1>Open translations</h1>

            <div class="translate-buttons">
              <ButtonElement onClick={() => openTranslation('cambridge')}>
                Cambridge
              </ButtonElement>
              <ButtonElement onClick={() => openTranslation('reversoContext')}>
                Reverso Context
              </ButtonElement>
              <ButtonElement onClick={() => openTranslation('googleTranslate')}>
                Google Translate
              </ButtonElement>
            </div>
          </div>

          <TextField
            multiline
            defaultValue={initialValues.answer}
            onChange={(value) => {
              setField('answer', value)
            }}
            label="Answer 1"
          />
          <TextField
            multiline
            defaultValue={initialValues.answer2}
            onChange={(value) => {
              setField('answer2', value)
            }}
            label="Answer 2"
          />

          <TextField
            defaultValue={initialValues.tags?.join(', ')}
            onChange={(value) => {
              setField(
                'tags',
                value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter((tag) => !!tag),
              )
            }}
            label="Tags"
            placeholder="Separeted by ,"
          />

          <Show when={editCard}>
            <div class="section">
              <h1 class="secondary">Review data</h1>

              <Show when={reviewStore.status === 'closed'}>
                <div class="review-data-fields">
                  <TextField
                    {...getTextFieldProps('wrongReviews')}
                    label="Wrong views"
                    type="number"
                    step={1}
                    min={0}
                  />
                  <TextField
                    {...getTextFieldProps('reviews')}
                    label="Reviews"
                    type="number"
                    step={1}
                    min={0}
                  />
                  <TextField
                    {...getTextFieldProps('difficulty')}
                    label="Difficulty"
                    type="number"
                    step={0.1}
                    min={0}
                  />
                  <TextField
                    {...getTextFieldProps('lastReview')}
                    label="Last Review"
                    type="date"
                  />
                </div>
              </Show>
              {/* TODO: stats */}
            </div>
          </Show>

          <Switcher
            class={css`
              margin-top: 40px;
            `}
            label="Keep open after save"
            checked={keepOpenAfterSave()}
            onChange={(checked) => setKeepOpenAfterSave(checked)}
          />
        </div>
      </div>

      <footer>
        <ButtonElement onClick={() => props.onClose()}>Cancel</ButtonElement>
        <ButtonElement
          disabled={saveIsDisabled()}
          onClick={() => onClickSave()}
        >
          {editCard ? 'Save' : `Add ${isDraft() ? 'draft' : 'card'}`}
        </ButtonElement>
      </footer>
    </div>
  )
}

const AddOrEditCard = () => {
  const navigate = useNavigate()

  const router = useRouter()

  const showAddModal = createMemo(
    () => !!router.query.add || !!router.query.edit,
  )

  function close() {
    navigate(null)
  }

  return (
    <ModalContainer show={showAddModal()} onClose={close}>
      <ModalContent onClose={close} editCard={router.query.edit} />
    </ModalContainer>
  )
}

export default AddOrEditCard

function normalizeValue<T>(value: T) {
  if (value === undefined) return null

  if (typeof value === 'string' && value.trim() === '') return null

  if (Array.isArray(value) && value.length === 0) return null

  return value
}
