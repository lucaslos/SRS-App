import { colors } from '@src/style/theme';

export const scrollBarStyle = `
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background-color: ${colors.bgSecondary.darker(1)};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    margin: 2px;
    background-color: ${colors.bgSecondary.alpha(0.24)};

    &:hover {
      background-color: ${colors.bgSecondary.alpha(0.3)};
    }

    &:active {
      background-color: ${colors.bgSecondary.alpha(0.35)};
    }
  }

`

