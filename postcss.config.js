// TODO: add plugins for reduce css size
// TODO: remove unneeded autoprefix
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: false,
      features: {
        'any-link-pseudo-class': true,
        'not-pseudo-class': true,
        'logical-properties-and-values': true,
        'matches-pseudo-class': true,
      },
    }),
  ],
};
