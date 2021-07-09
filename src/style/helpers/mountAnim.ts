import { injectCSS } from '@utils/css';
import {
  TransitionDurations,
  TransitionEasings,
  transitionDurations,
  easings,
} from '@src/style/helpers/transition';

export const fadeIn = ({
  duration = 'medium',
  ease = 'linear',
}: {
  opacity?: number;
  duration?: TransitionDurations | number;
  ease?: TransitionEasings;
} = {}) => injectCSS`
  animation: ${
    typeof duration === 'number'
      ? duration
      : transitionDurations[duration || 'medium']
  }ms
    ${easings[ease]} fade;

  @keyframes fade {
    from {
      opacity: 0;
    }
  }
`;
