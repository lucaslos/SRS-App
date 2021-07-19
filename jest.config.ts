/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  roots: ['<rootDir>/tests/'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^@src/(.*)': '<rootDir>/src/$1',
    '^@utils/(.*)': '<rootDir>/utils/$1',
  },
}

export default config
