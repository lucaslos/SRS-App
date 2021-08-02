const OFF = 0
const WARN = 1
const ERROR = 2

const noRestrictImportsDefault = {
  patterns: ['os', 'assert'],
  paths: [
    {
      name: 'linaria',
      importNames: ['cx'],
      message: 'Please use the custom implementation',
    },
  ],
}

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    createDefaultProgram: true,
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
    },
    useJSXTextNode: true,
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  plugins: ['@typescript-eslint'],
  globals: {
    firebase: true,
  },
  rules: {
    'no-plusplus': OFF,
    // 'implicit-arrow-linebreak': OFF,
    'no-bitwise': OFF,
    'no-param-reassign': OFF,
    // 'no-multi-assign': OFF,
    // 'no-use-before-define': [
    //   'error',
    //   {
    //     functions: false,
    //   },
    // ],
    // curly: ['error', 'multi-line'],
    'no-continue': OFF,
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: true,
      },
    ],
    'no-cond-assign': ['error', 'except-parens'],
    // 'max-len': OFF,
    // 'default-case': OFF,
    'no-underscore-dangle': OFF,
    // 'object-curly-newline': OFF,
    // 'comma-dangle': [
    //   'error',
    //   {
    //     arrays: 'always-multiline',
    //     objects: 'always-multiline',
    //     imports: 'always-multiline',
    //     exports: 'always-multiline',
    //     functions: 'ignore',
    //   },
    // ],
    // 'arrow-parens': OFF,
    // quotes: OFF,
    // 'function-paren-newline': OFF,
    // 'operator-linebreak': OFF,
    // 'no-trailing-spaces': OFF,
    // 'eol-last': OFF,
    // 'lines-between-class-members': OFF,
    // 'no-confusing-arrow': OFF,
    // 'nonblock-statement-body-position': OFF,
    // 'consistent-return': OFF,
    'arrow-body-style': OFF,
    'no-void': OFF,

    // 'jsx-a11y/label-has-associated-control': OFF,

    'import/no-extraneous-dependencies': OFF,
    // 'import/extensions': OFF,
    // 'import/export': OFF,
    'import/no-unresolved': OFF,
    // 'import/first': OFF,
    'import/prefer-default-export': OFF,
    // 'import/order': OFF,
    // 'import/no-cycle': OFF,
    // 'import/named': OFF,
    'import/no-dynamic-require': OFF,
    'no-restricted-imports': [
      'error',
      {
        patterns: [...noRestrictImportsDefault.patterns, '../*', './*'],
        paths: noRestrictImportsDefault.paths,
      },
    ],
    'no-undef': OFF,
    // 'valid-typeof': OFF,
    'no-console': [ERROR, { allow: ['info'] }],
    'global-require': OFF,

    'no-restricted-syntax': [
      ERROR,
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
      {
        selector: 'JSXAttribute > JSXIdentifier[name="className"]',
        message: 'no need to use className here',
      },
    ],

    'jsx-a11y/no-static-element-interactions': OFF,
    'jsx-a11y/label-has-for': OFF,
    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/anchor-has-content': OFF,
    'jsx-a11y/control-has-associated-label': OFF,
    'jsx-a11y/accessible-emoji': OFF,

    // '@typescript-eslint/indent': OFF,
    '@typescript-eslint/lines-between-class-members': [
      WARN,
      'aways',
      { exceptAfterSingleLine: true },
    ],

    '@typescript-eslint/no-floating-promises': ERROR,
    '@typescript-eslint/ban-types': OFF,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/prefer-interface': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-use-before-define': OFF,
    '@typescript-eslint/no-unused-vars': OFF,
    // '@typescript-eslint/semi': OFF,
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    // 'space-before-function-paren': OFF,
    // '@typescript-eslint/space-before-function-paren': [
    //   'error',
    //   {
    //     anonymous: 'always',
    //     named: 'never',
    //     asyncArrow: 'always',
    //   },
    // ],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-throw-literal': ERROR,

    /* jest */
    'jest/expect-expect': ERROR,
    'jest/no-deprecated-functions': OFF,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
}
