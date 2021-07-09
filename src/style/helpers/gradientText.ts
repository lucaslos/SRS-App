import { injectCSS } from '@utils/css';

export function gradientText(gradient: string) {
  return injectCSS`
    background: ${gradient};
    background-clip: text;
    -webkit-text-fill-color: transparent;
  `;
}
