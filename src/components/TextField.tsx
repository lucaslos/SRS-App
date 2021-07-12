import { gradientText } from '@src/style/helpers/gradientText'
import { stack } from '@src/style/helpers/stack'
import { colors } from '@src/style/theme'
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
    border-radius: 12px;
    margin-top: -8px;
    width: 100%;
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
  }

  textarea {
    resize: vertical;
    min-height: 100px;
    padding: 18px;
  }
`

interface TexFieldProps {
  class?: string
  multiline?: boolean
  defaultValue?: string | null
  onChange: (value: string) => any
  label?: string
  placeholder?: string
}

const TextField = (props: TexFieldProps) => {
  const inputId = `input${autoIncrementId()}`

  const { defaultValue } = props

  function getInputProps() {
    return {
      id: inputId,
      value: defaultValue ?? '',
      onInput: (e: any) => {
        props.onChange(e.currentTarget.value)
      },
    }
  }

  return (
    <div class={cx(containerStyle, props.class)}>
      <Show when={props.label}>
        <label for={inputId}>{props.label}</label>
      </Show>

      <div className="inputContainer">
        {props.multiline ? (
          <textarea {...getInputProps()} />
        ) : (
          <input type="text" {...getInputProps()} />
        )}
      </div>
    </div>
  )
}

export default TextField
