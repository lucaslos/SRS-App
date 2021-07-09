import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Store, { deepEqual } from 't-state';
import { useCreateStore } from 't-state/useCreateStore';
import { mergeObj } from '@utils/mergeObj';
import { mergeDraftObj, produceReducer } from '@utils/produceReducer';
import { original } from 'immer';
import { isNullish } from '@utils/isNullish';
import { anyObj } from '@utils/typings';

const defaultErrorMsgs = {
  required: 'Este campo é obrigatório!',
  min: 'O valor deve ser maior que ',
  max: 'O valor deve ser menor que ',
};

type Value = any;

export type FieldProps = {
  initialValue: Value;
  errors?: string[];
  isValid?: boolean;
  required?: boolean;
  normalizeValue?: (input: any, inputType: 'initial' | 'update') => Value;
  checkIfIsEmpty?: (input: Value) => boolean;
  requiredErrorMsg?: string;
  data?: anyObj;
  validations?: {
    validRegex?: RegExp;
    invalidRegex?: RegExp;
    errorMsg: string | ((value: Value) => string);
    isValid?: (value: Value) => boolean;
  }[];
};

export type FieldsConfig = {
  [k: string]: FieldProps;
};

export type ReturnFields<T extends FieldsConfig> = {
  [K in keyof T]: {
    id: string;
    errors: string[];
    isValid: boolean;
    initialValue: T[K]['initialValue'];
    required: boolean;
    rawValue: Value;
    isTouched: boolean;
    data: T[K]['data'];
    value: T[K]['initialValue'];
    isDiffFromInitial: boolean;
    isEmpty: boolean;
  };
};

function checkIfFieldIsEmpty(
  value: Value,
  checkIfIsEmptyFn?: FieldProps['checkIfIsEmpty'],
) {
  return checkIfIsEmptyFn
    ? checkIfIsEmptyFn?.(value)
    : Array.isArray(value)
    ? value.length === 0 || value.every((item) => isNullish(item))
    : value === undefined || value === null || `${value}`.trim().length === 0;
}

function getErrors(
  { validations, required, requiredErrorMsg, checkIfIsEmpty }: FieldProps,
  value: Value,
) {
  let errors: string[] = [];

  const isEmpty = checkIfFieldIsEmpty(value, checkIfIsEmpty);

  if (required) {
    if (isEmpty) {
      errors = [requiredErrorMsg ?? defaultErrorMsgs.required];
    }
  }

  if (errors.length === 0 && validations) {
    const validationErrors =
      !required && isEmpty
        ? []
        : validations
            .filter((item) => {
              if (item.validRegex) {
                return !item.validRegex.test(String(value).trim());
              }

              if (item.invalidRegex) {
                return item.invalidRegex.test(String(value).trim());
              }

              return !item.isValid?.(value);
            })
            .map((elem) =>
              typeof elem.errorMsg === 'string'
                ? elem.errorMsg
                : elem.errorMsg(value),
            );

    errors = [...errors, ...validationErrors];
  }

  return { errors, isValid: errors.length === 0, isEmpty };
}

type UseFormFields<T extends FieldsConfig> = {
  fieldsConfig: T;
  mustBeDiffFromInitial?: boolean;
  onAnyChange?: (
    currentFields: ReturnFields<T>,
    prevFields?: ReturnFields<T>,
  ) => any;
  debugId?: string;
  errorElementSelector?: string;
  formValidation?: (formProps: {
    prevFields?: ReturnFields<T>;
    fields: ReturnFields<T>;
    setFieldError: (fieldId: keyof T, error: string) => void;
    setFormError: (error: string) => void;
  }) => void;
};

export type FormStoreState<T extends FieldsConfig> = {
  fields: ReturnFields<T>;
  formError: false | string;
  hasError: boolean;
};

type FormStoreReducers<T extends FieldsConfig> = {
  handleChange: {
    id: keyof T;
    value: Value | ((currentValue: Value) => Value);
  };
  forceValidation: undefined;
  resetFields: {
    config: { [K in keyof T]?: Partial<FieldProps> };
  };
};

export type FormStore<T extends FieldsConfig> = Store<
  FormStoreState<T>,
  FormStoreReducers<T>
>;

function trimValueIfString<T>(value: T): T {
  return typeof value === 'string' ? ((value.trim() as unknown) as T) : value;
}

export function useForm<T extends FieldsConfig>({
  fieldsConfig: initialConfig,
  onAnyChange: onAnyFieldChange,
  debugId,
  errorElementSelector = 'showErrors',
  formValidation,
}: UseFormFields<T>) {
  const fieldsConfig = useRef(initialConfig);

  type FieldsToUpdate = { [K in keyof T]?: Partial<FieldProps> };

  type State = FormStoreState<T>;
  type Reducers = FormStoreReducers<T>;

  const initialState = useMemo<State>(() => {
    let formHasError = false;

    const initialFields: ReturnFields<T> = {} as any;

    Object.keys(initialConfig).forEach((fieldId: keyof T) => {
      const props = initialConfig[fieldId];

      const value =
        props.normalizeValue?.(props.initialValue, 'initial') ??
        props.initialValue;

      const { isEmpty, isValid } = getErrors(props, value);

      if (!formHasError && props.errors) {
        formHasError = props.errors.length > 0;
      }

      initialFields[fieldId] = {
        id: fieldId,
        errors: props.errors || [],
        isValid,
        initialValue: value,
        isDiffFromInitial: false,
        required: !!props.required,
        isTouched: false,
        rawValue: props.initialValue,
        data: props.data,
        value,
        isEmpty,
      };
    });

    return {
      fields: initialFields,
      hasError: formHasError,
      formError: false,
    };
  }, []);

  function validateFormState(stateDraft: FormStoreState<T>) {
    function setFieldError(fieldId: string, error: string) {
      const selectedField = stateDraft.fields[fieldId];

      if (selectedField) {
        selectedField.errors.push(error);
        selectedField.isValid = false;
      }
    }

    stateDraft.formError = false;

    function setFormError(error: string) {
      stateDraft.formError = error;
    }

    if (formValidation) {
      formValidation({
        prevFields: original(stateDraft.fields),
        fields: stateDraft.fields,
        setFieldError,
        setFormError,
      });
    }
  }

  const formStore = useCreateStore<State, Reducers>({
    name: debugId,
    state: initialState,
    reducers: {
      handleChange: produceReducer((state, { id, value: _value }) => {
        const field = state.fields[id];
        const fieldConfig = fieldsConfig.current[id];

        if (!field || !fieldConfig) {
          if (import.meta.env.DEV) {
            throw new Error(`Invalid id of ${id}`);
          }

          return;
        }

        const value =
          typeof _value === 'function' ? _value(field.value) : _value;

        const normalizedValue =
          fieldConfig.normalizeValue?.(value, 'update') ?? value;

        const errors = getErrors(fieldConfig, normalizedValue);

        field.isTouched = true;

        if (
          normalizedValue === field.value &&
          deepEqual(errors, {
            errors: field.errors,
            isValid: field.isValid,
          })
        ) {
          return;
        }

        mergeDraftObj(field, {
          rawValue: value,
          value: normalizedValue,
          isDiffFromInitial: !deepEqual(
            trimValueIfString(field.initialValue),
            trimValueIfString(normalizedValue),
          ),
          ...errors,
        });

        validateFormState(state);

        if (!state.hasError) {
          state.hasError = errors.errors.length > 0 || !!state.formError;
        }
      }),
      forceValidation: produceReducer((state) => {
        Object.keys(state.fields).forEach((fieldId) => {
          const field = state.fields[fieldId];

          const errors = getErrors(fieldsConfig.current[fieldId], field.value);

          mergeDraftObj(field, errors);

          field.isTouched = true;

          validateFormState(state);

          if (!state.hasError) {
            state.hasError = errors.errors.length > 0 || !!state.formError;
          }
        });
      }),
      resetFields: produceReducer((state, { config }) => {
        Object.keys(config).forEach((fieldId: keyof T) => {
          const newConfig = fieldsConfig.current[fieldId];

          const normalizedValue =
            newConfig.normalizeValue?.(newConfig.initialValue, 'initial') ??
            newConfig.initialValue;

          const { isEmpty, isValid } = getErrors(newConfig, normalizedValue);

          const errors = newConfig.errors || [];

          const newField: ReturnFields<T>[keyof T] = {
            id: fieldId,
            errors,
            isValid,
            initialValue: normalizedValue,
            isDiffFromInitial: false,
            isTouched: false,
            required: !!newConfig.required,
            rawValue: newConfig.initialValue,
            data: newConfig.data,
            value: normalizedValue,
            isEmpty,
          };

          state.fields[fieldId] = newField;

          state.formError = false;

          if (!state.hasError) {
            state.hasError = errors.length > 0 || !!state.formError;
          }
        });
      }),
    },
  });

  const handleChange = useCallback(
    <K extends keyof T>(
      id: K,
      value:
        | T[K]['initialValue']
        | ((currentValue: T[K]['initialValue']) => T[K]['initialValue']),
    ) => {
      formStore.dispatch('handleChange', { id, value });
    },
    [formStore],
  );

  const touchField = useCallback(
    <K extends keyof T>(id: K) => {
      const field = formStore.getState().fields[id];

      if (!field.isTouched) {
        formStore.dispatch('handleChange', {
          id,
          value: field.value,
        });
      }
    },
    [formStore],
  );

  const forceFormValidation = useCallback(() => {
    formStore.dispatch('forceValidation');
  }, [formStore]);

  const useFormState = useCallback(
    () =>
      formStore.useSelector(
        (state) => {
          const fieldsId: (keyof T)[] = Object.keys(state.fields);
          let allFieldsAreValid = !state.formError;
          let isDiffFromInitial = false;

          fieldsId.some((fieldId) => {
            const value = state.fields[fieldId];

            if (allFieldsAreValid) {
              allFieldsAreValid = value.isValid !== false;
            }

            if (!isDiffFromInitial) {
              isDiffFromInitial = value.isDiffFromInitial;
            }

            return !allFieldsAreValid && isDiffFromInitial;
          });

          return {
            fields: state.fields,
            fieldsId,
            allFieldsAreValid,
            isDiffFromInitial,
            formError: state.formError,
          };
        },
        { equalityFn: deepEqual },
      ),
    [formStore],
  );

  function updateConfig(fieldsToUpdate: FieldsToUpdate) {
    fieldsConfig.current = mergeObj(
      fieldsConfig.current,
      fieldsToUpdate as any,
    ) as T;

    formStore.dispatch('resetFields', {
      config: fieldsToUpdate,
    });
  }

  useEffect(() => {
    const unSubscribe = formStore.subscribe((prevState, currentState) => {
      if (
        prevState.hasError !== currentState.hasError &&
        currentState.hasError
      ) {
        document
          .querySelector(`.${errorElementSelector}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      onAnyFieldChange?.(currentState.fields, prevState.fields);
    });

    return unSubscribe;
  }, [errorElementSelector, formStore, onAnyFieldChange]);

  return {
    useFormState,
    formStore,
    handleChange,
    forceFormValidation,
    updateConfig,
    touchField,
    onAnyFieldChange,
  };
}

export function arrayToFields<T extends anyObj, R extends FieldProps>(
  array: T[],
  idKey: keyof T,
  itemFilter: (item: T) => R | undefined,
) {
  return array.reduce<{
    [k: string]: R;
  }>((acc, curr) => {
    const field = itemFilter(curr);

    return field
      ? {
          ...acc,
          [curr[idKey]]: itemFilter(curr),
        }
      : acc;
  }, {});
}
