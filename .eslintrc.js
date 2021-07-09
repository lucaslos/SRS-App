const OFF = 0;
const WARN = 1;
const ERROR = 2;

const noRestrictImportsDefault = {
  patterns: ['os', 'assert'],
  paths: [
    {
      name: 'linaria',
      importNames: ['cx'],
      message: 'Please use the custom implementation',
    },
    {
      name: 'react-router-dom',
      importNames: ['Link'],
      message: 'Please use the custom link implementation.',
    },
  ],
};

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './app/tsconfig.json'],
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
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  globals: {
    firebase: true,
    __DEV__: true,
    import.meta.env.PROD: true,
    __VERSION__: true,
  },
  rules: {
    'no-plusplus': OFF,
    // 'implicit-arrow-linebreak': OFF,
    // 'react/jsx-filename-extension': OFF,
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
    'no-nested-ternary': OFF,
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
    'import/no-default-export': ERROR,
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

    'react/react-in-jsx-scope': OFF,
    'react/require-default-props': OFF,
    'react/no-unused-prop-types': OFF,
    'react/prop-types': OFF,
    'react/no-array-index-key': OFF,
    // 'react/jsx-one-expression-per-line': OFF,
    // 'react/jsx-indent': OFF,
    // 'react/destructuring-assignment': OFF,
    // 'react/jsx-closing-tag-location': OFF,
    'react/jsx-props-no-spreading': OFF,
    // 'react/jsx-curly-newline': OFF,
    // 'react/no-children-prop': OFF,
    // 'react/jsx-wrap-multilines': OFF,
    'react/jsx-no-undef': OFF,
    'react/jsx-key': [2, { checkFragmentShorthand: true }],
    'react/jsx-no-useless-fragment': WARN,
    'react/forbid-elements': [
      WARN,
      {
        forbid: [{ element: 'button', message: 'Use o componente ButtonElem' }],
      },
    ],

    'jsx-a11y/no-static-element-interactions': OFF,
    'jsx-a11y/label-has-for': OFF,
    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/anchor-has-content': OFF,
    'jsx-a11y/control-has-associated-label': OFF,
    'jsx-a11y/accessible-emoji': OFF,

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

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
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
};
