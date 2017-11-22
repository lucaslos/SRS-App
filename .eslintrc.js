module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "jsx": true,
    },
    "sourceType": "module"
  },
  "env": {
    "browser": true,
  },
  "plugins": ["react"],
  "rules": {
    "import/no-extraneous-dependencies": 0,
    "arrow-body-style": ["error", "as-needed", { "requireReturnForObjectLiteral": false }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-bitwise": 0,
    "no-param-reassign": ["error", { "props": false }],
    "no-multi-assign": 0,
    "no-plusplus": 0,
    "curly": 0,
    "no-use-before-define": ["error", { "functions": false }],
    "no-mixed-operators": [
        "error",
        {
            "groups": [
                ["+", "-", "*", "/", "%", "**"],
                ["&", "|", "^", "~", "<<", ">>", ">>>"],
                ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                ["&&", "||"],
                ["in", "instanceof"]
            ],
            "allowSamePrecedence": true
        }
    ],

    "import/extensions": 0,
    "import/no-unresolved": 0,
    "import/first": 0,

    "max-len": 0,
    "no-underscore-dangle": 0,

    "comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "ignore",
    }],

    "react/sort-comp": ["error", {
      order: [
        "static-methods",
        "lifecycle",
        "/^on.+$/",
        "/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/",
        "everything-else",
        "/^render.+$/",
        "render"
      ],
    }],
    "react/require-default-props": 0,
    "react/no-unused-prop-types": 1,
    "react/no-array-index-key": 0, // disabled because no need for reorder the items

    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/label-has-for": 0,
  },
  "extends": ["airbnb"]
}
