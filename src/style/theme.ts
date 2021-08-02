import { createThemeColors } from '@utils/createThemev2'

export const colors = createThemeColors({
  primary: '#448CFD',
  secondary: '#EC4899',
  textPrimary: '#fff',
  textSecondary: '#94A3B8',
  bgPrimary: '#111827',
  bgSecondary: '#172136',
  warning: '#FDE047',
  error: '#E53558',
  success: '#6EE7B7',
  white: '#fff',
  black: '#000',
})

export const gradients = {
  primary: `linear-gradient(90deg, #448cfd, #a746f5, #ec4899);`,
  secondary: `linear-gradient(90deg, #448cfd , #6ee7b7);`,
  red: `linear-gradient(90deg, #E53558 , #E75590);`,
}

export type ThemeColors = keyof typeof colors

export const fonts = {
  primary: 'Work Sans, sans-serif',
  decorative: '"Fira Code", monospaced',
}
