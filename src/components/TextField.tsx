import React, { useState, useRef, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import css from '@emotion/css';
import {
  colorSecondaryLigher,
  colorPrimary,
  fontDecorative,
  fontSecondary,
  colorRed,
} from 'style/theme';
import { useOnChange } from 'utils/customHooks';

export type HandleChange = (value: string | number, id?: string) => void;

type Props = {
  label: string;
  handleChange: HandleChange;
  handleIsValidChange: (isValid: boolean, id?: string) => void;
  value?: string | number;
  validations?: {
    regex: RegExp;
    showErrorIfMatch: boolean;
    errorMsg: string;
    validator: (value: string) => boolean;
  }[];
  id?: string;
  width?: string;
  multiLine?: boolean;
  required?: boolean;
  hideErrors?: boolean;
  placeholder?: boolean;
  maxlength?: number;
  className?: string;
  max?: number;
  lines?: number;
  step?: number;
  min?: number;
  type?: 'number' | 'text' | 'date';
  timeout?: number;
  requiredErrorMsg?: string;
  minErrorMsg?: string;
  maxErrorMsg?: string;
};

const Container = styled.div`
  width: 140px;
  flex-grow: 4;
  padding: 10px 0;

  * {
    transition: 240ms;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px 12px 12px;
    background-color: ${colorSecondaryLigher};
    border-radius: 4px;
    border: 1.5px solid ${colorPrimary};
    color: #fff;

    outline: none;
  }

  input {
    height: 44px;
  }

  .invalid {
    input,
    textarea {
      border-color: ${colorRed};
    }

    label {
      color: ${colorRed};
    }
  }

  textarea {
    min-height: 80px;
    max-height: 80px;
    max-width: 100%;
    min-width: 100%;
    font-family: 'Source Sans Pro';

    resize: none;
    font-size: 16px;
  }

  label {
    position: absolute;
    top: -7px;
    left: 9px;
    padding: 0 6px;
    height: 15px;

    font-size: 12px;
    font-family: ${fontDecorative};
    color: ${colorPrimary};
    background: ${colorSecondaryLigher};
  }

  .validation-error {
    font-size: 14px;
    padding-left: 8px;
    padding-top: 4px;

    font-family: ${fontSecondary};
    color: ${colorRed};
  }
`;

const TextField = ({
  label,
  max,
  id,
  min,
  step,
  value = '',
  required,
  validations,
  handleChange,
  handleIsValidChange,
  maxlength = 300,
  hideErrors,
  lines = 3,
  width = '140px',
  type = 'text',
  timeout = 50,
  placeholder = true,
  multiLine = false,
  requiredErrorMsg = "This field can't be blank",
  minErrorMsg = 'The value must be higher than',
  maxErrorMsg = 'The value must be less than',
}: Props) => {
  const [isValid, setIsValid] = useState(true);
  const [displayError, setDisplayError] = useState<string[]>([]);
  const inputId = useRef(`${Date.now() + Math.random()}`);

  function checkIfIsValid() {
    const inputLenght = `${value}`.trim().length;
    let fieldIsValid = true;
    let errorMsg: typeof displayError = [];

    if (required && inputLenght === 0) {
      fieldIsValid = false;
      errorMsg = [requiredErrorMsg];
    } else if (max && inputLenght > max) {
      fieldIsValid = false;
      errorMsg = [maxErrorMsg];
    } else if (min && inputLenght < min) {
      fieldIsValid = false;
      errorMsg = [minErrorMsg];
    } else if (validations) {
      errorMsg = validations
        .filter((item) => {
          const matched = item.regex
            ? item.regex.test(`${value}`)
            : item.validator(`${value}`);

          return item.showErrorIfMatch ? matched : !matched;
        })
        .map(elem => elem.errorMsg);

      fieldIsValid = errorMsg.length === 0;
    }

    setDisplayError(errorMsg);
    setIsValid(fieldIsValid);
    handleIsValidChange(fieldIsValid, id);
  }

  function updateValue(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { value: inputValue } = event.target;

    handleChange(type === 'number' ? parseFloat(inputValue) : inputValue, id);
  }

  useOnChange(value, () => {
    checkIfIsValid();
  });

  const inputProps = {
    id: inputId.current,
    value,
    onBlur: updateValue,
    onChange: updateValue,
    maxLength: maxlength,
  };

  return (
    <Container css={{ width }} className="text-field-container">
      <div className={`input-wrapper ${isValid || hideErrors ? '' : 'invalid'}`}>
        {multiLine ? (
          <textarea {...inputProps} />
        ) : (
          <input type={type} max={max} min={min} step={step} {...inputProps} />
        )}
        <label htmlFor={inputId.current}>{label}</label>
      </div>
      {!isValid && !hideErrors && (
        <div className="validation-error">
          {displayError
            ? displayError.map((error, i) => [
              <span key={i}>{error}</span>,
                i < displayError.length ? <br key={`${i}-br`} /> : undefined,
              ])
            : undefined}
        </div>
      )}
    </Container>
  );
};

export default TextField;
