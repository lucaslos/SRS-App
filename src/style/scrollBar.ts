import { mq } from '@src/style/mediaQueries'
import { colors } from '@src/style/theme'

export const scrollBarStyle = `
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;

  }

  ${mq.mobile} {
    *::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background-color: ${colors.bgSecondary.var};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    margin: 2px;
    background-color: ${colors.bgSecondary.lighter(6)};

    &:hover {
      background-color: ${colors.bgSecondary.lighter(12)};
    }

    &:active {
      background-color: ${colors.bgSecondary.lighter(17)};
    }
  }

`
