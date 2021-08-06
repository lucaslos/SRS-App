import { useRouter } from '@rturnq/solid-router'
import ButtonElement from '@src/components/ButtonElement'
import ModalContainer from '@src/components/ModalContainer'
import TextField from '@src/components/TextField'
import {
  batchCreateCard,
  Card,
  cardsStore,
  deleteCard,
} from '@src/stores/cardsStore'
import { gradientText } from '@src/style/helpers/gradientText'
import { inline } from '@src/style/helpers/inline'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { useNavigate } from '@src/utils/navigate'
import { injectCSS } from '@utils/css'
import { safeJsonParse } from '@utils/safeJsonParse'
import { ellipsis } from 'polished'
import { createEffect, createMemo, createSignal, untrack } from 'solid-js'
import { css } from 'solid-styled-components'
import z, { Infer } from 'myzod'
import { getRegexMatches } from '@utils/getRegexMatches'
import VerEx from 'verbal-expressions'
import { typedObjectEntries } from '@utils/typed'
import { Temporal } from '@js-temporal/polyfill'

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
    ${inline()};
    padding: 22px;
    padding-bottom: 0;

    h1 {
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      ${gradientText(gradients.primary)};
      font-size: 22px;
    }
  }

  .buttons-container {
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

  .content {
    ${stack({ gap: 20 })};
    padding: 22px;

    .import-stats {
      color: ${colors.secondary.var};
      letter-spacing: 0.04em;
      font-size: 20px;
    }

    .error {
      color: ${colors.error.var};
    }
  }
`

const importRealtimeDBJsonSchema = z.object({
  cards: z.record(
    z.object({
      back: z.string(),
      diff: z.number(),
      repetitions: z.number(),
      wrongReviews: z.number(),
      lang: z.string(),
      createdAt: z.number(),
      front: z.string(),
      id: z.string(),
      lastReview: z.string().min(10).max(10),
      tags: z.array(z.string()).optional(),
      notes: z.array(z.string()).optional(),
    }),
  ),
})

const importFromPhrasebookSchema = z.array(
  z.object({
    back: z.string(),
    front: z.string(),
    id: z.number(),
    tags: z.array(z.string()).optional(),
    notes: z.array(z.string()).optional(),
    isArchieved: z.boolean(),
    isTopWord: z.boolean(),
  }),
)

const importSchemas = z.union([
  importFromPhrasebookSchema,
  importRealtimeDBJsonSchema,
])

interface DialogProps {
  onClose: () => void
}

const ModalContent = (props: DialogProps) => {
  const [importRawData, setImportRawData] = createSignal('')

  type ImportCards = Omit<Card, 'id'>[]

  const importData = createMemo<{
    data: ImportCards | null
    error?: string
  }>(() => {
    if (!importRawData()) return { data: null }

    let rawData = ''

    try {
      rawData = JSON.parse(importRawData())
    } catch (error) {
      return { data: null, error: error.message }
    }

    if (!rawData) return { data: null, error: 'Invalid JSON' }

    const parsedData = importSchemas.try(rawData)

    if (parsedData instanceof z.ValidationError) {
      return { data: null, error: parsedData.message }
    }

    const importCards: ImportCards = []

    const now = Temporal.now.instant().epochMilliseconds

    if (!Array.isArray(parsedData)) {
      for (const [_, card] of typedObjectEntries(parsedData.cards)) {
        importCards.push({
          front: card.front,
          answer: card.back || null,
          createdAt: Date.now(),
          answer2: null,
          difficulty: card.diff,
          draft: !card.back,
          lastReview: card.lastReview,
          reviews: card.repetitions,
          tags: card.tags || null,
          wrongReviews: card.wrongReviews,
        })
      }
    } else {
      for (const card of parsedData) {
        importCards.push({
          front: card.front,
          answer: card.back || null,
          createdAt: now,
          answer2: null,
          difficulty: 0,
          draft: !card.back,
          lastReview: null,
          reviews: 0,
          tags: card.tags || null,
          wrongReviews: 0,
        })
      }
    }

    return { data: importCards }
  })

  const importStats = createMemo<{
    total: number
    draft: number
    cards: number
  }>(() => {
    const { data } = importData()

    const stats = {
      total: data ? data.length : 0,
      draft: 0,
      cards: 0,
    }

    if (data) {
      for (const card of data) {
        if (card.draft) {
          stats.draft++
        } else {
          stats.cards++
        }
      }
    }

    return stats
  })

  function focusError() {
    const { error } = importData()

    if (error) {
      const { groups } = getRegexMatches(
        error,
        VerEx()
          .then('position ')
          .beginCapture()
          .digit()
          .oneOrMore()
          .endCapture(),
      )

      const position = groups[0] && Number(groups[0])

      if (position) {
        const textarea = document.querySelector<HTMLTextAreaElement>(
          `.${containerStyle} textarea`,
        )

        if (textarea) {
          textarea.selectionStart = position
          textarea.blur()
          textarea.focus()
        }
      }
    }
  }

  function onClickImport() {
    const { data } = importData()

    if (data) {
      void batchCreateCard(data)
      props.onClose()
    }
  }

  return (
    <div class={containerStyle}>
      <header>
        <h1>Import data</h1>
      </header>

      <div class="content">
        <TextField
          multiline
          onChange={(value) => {
            setImportRawData(value)
          }}
          rows={10}
          label="Paste the JSON here"
        />

        <div class="import-stats">
          Total: {importStats().total} · Cards: {importStats().cards} · Drafts:{' '}
          {importStats().draft}
        </div>

        <Show when={importData().error}>
          {(error) => (
            <div class="error" onClick={() => focusError()}>
              {error}
            </div>
          )}
        </Show>
      </div>

      <div class="buttons-container">
        <ButtonElement onClick={() => props.onClose()}>Cancel</ButtonElement>
        <ButtonElement
          onClick={() => onClickImport()}
          disabled={!importData().data}
        >
          Import
        </ButtonElement>
      </div>
    </div>
  )
}

const Import = () => {
  const navigate = useNavigate()

  const router = useRouter()

  function close() {
    navigate(null)
  }

  return (
    <ModalContainer show={!!router.query.import} onClose={close}>
      <ModalContent onClose={close} />
    </ModalContainer>
  )
}

export default Import
