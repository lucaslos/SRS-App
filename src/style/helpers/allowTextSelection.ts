import { injectCSS } from '@utils/css';

export const allowTextSelection = injectCSS`
  user-select: text;

  * {
    user-select: text;
  }
`;
