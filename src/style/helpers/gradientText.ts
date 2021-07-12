import { injectCSS } from '@utils/css';

export function gradientText(gradient: string) {
  return injectCSS`
    background: ${gradient};
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
  `;
}
