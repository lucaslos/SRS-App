import { anyFunction } from '@utils/typings'
import { dequal } from 'dequal'

function isFunction(value: any): value is anyFunction {
  return typeof value === 'function'
}

type WhenCondition<I> = boolean | ((input: I) => any)
type PatternExpression<I, O> = ((input: I) => O) | O
type Pattern<I, O> = {
  expr: PatternExpression<I, O>
  type: 'exact' | 'partial' | 'when'
} & (
  | {
      value: I | WhenCondition<I>
      multiple: false
    }
  | {
      value: (I | WhenCondition<I>)[]
      multiple: true
    }
)

export const w = {
  any: {},
  string: {},
  number: {},
  boolean: {},
}

function matchPattern(
  type: 'exact' | 'partial' | 'when',
  value: any,
  pattern: any,
): boolean {
  if (type === 'when') {
    if (Array.isArray(pattern)) {
      return pattern.some((condition) => {
        if (isFunction(condition)) {
          return !!condition(value)
        }

        return !!condition
      })
    }

    if (isFunction(pattern)) {
      return !!pattern(value)
    }

    return !!pattern
  }

  if (type === 'exact') {
    return dequal(value, pattern)
  }

  if (pattern === w.any) return true
  if (pattern === w.string) return typeof value === 'string'
  if (pattern === w.boolean) return typeof value === 'boolean'
  if (pattern === w.number) {
    return typeof value === 'number' && Number.isNaN(value) === false
  }
  if (typeof value !== 'object') return dequal(value, pattern)

  if (Array.isArray(pattern)) {
    return pattern.every((tupleItem, i) =>
      tupleItem === undefined ? false : matchPattern(type, value[i], tupleItem),
    )
  }

  return Object.keys(pattern).every((k) =>
    pattern[k] === undefined ? false : matchPattern(type, value[k], pattern[k]),
  )
}

interface Builder<I, O> {
  with<P extends I>(pattern: P, expr: PatternExpression<P, O>): Builder<I, O>
  withOneOf<P extends I>(
    oneOf: P[],
    expr: PatternExpression<P, O>,
  ): Builder<I, O>
  when(
    condition: WhenCondition<I>,
    expr: PatternExpression<I, O>,
  ): Builder<I, O>
  whenOneOf(
    oneOf: WhenCondition<I>[],
    expr: PatternExpression<I, O>,
  ): Builder<I, O>
  partialWith<P extends I>(
    pattern: P,
    expr: PatternExpression<P, O>,
  ): Builder<I, O>
  partialWithOneOf<P extends I>(
    pattern: P[],
    expr: PatternExpression<P, O>,
  ): Builder<I, O>
  otherwise(defaultValue: O | (() => O)): O
}

const builder =
  <I, O>(value: I) =>
  (
    otherwise: (() => O) | O | undefined = undefined,
    patterns: Pattern<I, O>[] = [],
  ): Builder<I, O> => ({
    with(pattern, expr) {
      return builder<I, O>(value)(otherwise, [
        ...patterns,
        {
          value: pattern,
          expr,
          type: 'exact',
          multiple: false,
        },
      ])
    },
    withOneOf(oneOf, expr) {
      return builder<I, O>(value)(otherwise, [
        ...patterns,
        ...patterns,
        {
          value: oneOf,
          expr,
          type: 'exact',
          multiple: true,
        },
      ])
    },
    when(condition, expr) {
      return builder<I, O>(value)(otherwise, [
        ...patterns,
        {
          value: condition,
          expr,
          type: 'when',
          multiple: false,
        },
      ])
    },
    whenOneOf(oneOf, expr) {
      return builder<I, O>(value)(otherwise, [
        ...patterns,
        {
          value: oneOf,
          expr,
          type: 'when',
          multiple: true,
        },
      ])
    },
    partialWith(pattern, expr) {
      return builder<I, O>(value)(otherwise, [
        ...patterns,
        {
          value: pattern,
          expr,
          type: 'partial',
          multiple: false,
        },
      ])
    },
    partialWithOneOf(pattern, expr) {
      return builder<I, O>(value)(otherwise, [
        ...patterns,
        {
          value: pattern,
          expr,
          type: 'partial',
          multiple: true,
        },
      ])
    },
    otherwise(defaultValue) {
      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i]

        if (pattern.multiple) {
          for (let i2 = 0; i2 < pattern.value.length; i2++) {
            const patternValue = pattern.value[i2]

            const patternMatches = matchPattern(
              pattern.type,
              value,
              patternValue,
            )

            if (patternMatches) {
              if (isFunction(pattern.expr)) {
                return pattern.expr(
                  pattern.type === 'when' ? value : (patternValue as I),
                )
              }

              return pattern.expr
            }
          }
        } else {
          const patternMatches = matchPattern(
            pattern.type,
            value,
            pattern.value,
          )

          if (patternMatches) {
            if (isFunction(pattern.expr)) {
              return pattern.expr(
                pattern.type === 'when' ? value : (pattern.value as I),
              )
            }

            return pattern.expr
          }
        }
      }

      if (isFunction(defaultValue)) {
        return defaultValue()
      }

      return defaultValue
    },
  })

export const match = {
  value: <O, I = any>(value: I) => builder<I, O>(value)(undefined, []),
  inferedValue<I = any>(value: I): <O>() => Builder<I, O> {
    return () => builder<I, any>(value)(undefined, [])
  },
}
