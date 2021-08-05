import ButtonElement from '@src/components/ButtonElement'
import { gradientText } from '@src/style/helpers/gradientText'
import { stack } from '@src/style/helpers/stack'
import { colors, gradients } from '@src/style/theme'
import { autoIncrementId } from '@utils/autoIncrementId'
import { cx } from '@utils/cx'
import { JSX } from 'solid-js/jsx-runtime'
import { css } from 'solid-styled-components'

const containerStyle = css`
  ${stack({ align: 'left' })};
  width: 100%;
  position: relative;

  label {
    text-transform: uppercase;
    color: ${colors.primary.var};
    z-index: 1;
    letter-spacing: 0.22em;
    margin-left: 12px;
  }

  .inputContainer {
    background: ${colors.bgPrimary.var};
    border-radius: 14px;
    margin-top: -8px;
    position: relative;
    width: 100%;
    overflow: hidden;
    ${stack({ align: 'left' })};
  }

  input,
  textarea {
    min-height: 46px;
    min-width: 100%;
    max-width: 100%;
    border: 0;
    padding-left: 18px;
    background: transparent;
    color: ${colors.textPrimary.var};
    letter-spacing: 0.04em;

    &:focus {
      outline: 0;
    }

    &::placeholder {
      opacity: 0.3;
      color: ${colors.primary.var};
    }
  }

  input {
    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      margin-right: 10px;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
    padding: 18px;

    &::-webkit-resizer {
      display: none;
    }
  }

  .label-background {
    position: absolute;
    left: 0;
    right: 8px;
    height: 17px;
    background: ${colors.bgPrimary.var};
  }

  .highlight-button {
    align-self: flex-end;
    height: 32px;
    font-size: 14px;
    padding: 0 14px;
    letter-spacing: 0.06em;
    background: ${gradients.primary};
    border-top-left-radius: 16px;
  }
`

interface TexFieldProps {
  class?: string
  multiline?: boolean
  defaultValue?: string | number | null
  onChange: (value: string) => any
  label?: string
  highlightText?: boolean
  placeholder?: string
  type?: 'number' | 'date' | 'text'
  step?: number
  min?: number
  rows?: number
  max?: number
}

const TextField = (props: TexFieldProps) => {
  const inputId = `input${autoIncrementId()}`

  const { defaultValue } = props

  function getInputProps() {
    return {
      id: inputId,
      type: props.type ?? 'text',
      value: defaultValue ?? '',
      step: props.step,
      min: props.min,
      max: props.max,
      placeholder: props.placeholder,
      onInput: (e: any) => {
        props.onChange(e.currentTarget.value)
      },
    }
  }

  function highlightText() {
    const input = document.getElementById(inputId) as HTMLInputElement

    if (!input) return

    const { value, selectionStart, selectionEnd } = input

    if (selectionStart === null || selectionEnd === null) return

    const selectedText = value.substring(selectionStart, selectionEnd).trimEnd()

    const newValue = `${value.substring(
      0,
      selectionStart,
    )}__*${selectedText}*__${value.substring(
      selectionStart + selectedText.length,
    )}`

    input.value = newValue
    props.onChange(newValue)
  }

  return (
    <div class={cx(containerStyle, props.class)}>
      <Show when={props.label}>
        <label for={inputId}>{props.label}</label>
      </Show>

      <div class="inputContainer">
        {props.multiline ? (
          <>
            <textarea {...getInputProps()} rows={props.rows} />
            <div class="label-background" />
          </>
        ) : (
          <input {...getInputProps()} />
        )}

        {props.highlightText && (
          <ButtonElement
            class="highlight-button"
            onClick={() => highlightText()}
          >
            Highlight Text
          </ButtonElement>
        )}
      </div>
    </div>
  )
}

export default TextField
