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
})

export const gradients = {
  primary: `linear-gradient(90deg, #448cfd, #a746f5, #ec4899);`,
  secondary: `linear-gradient(90deg, #448cfd, #4ba8fa, #51c1f7, #57d8f4, #5debf0, #63edde, #69eac9, #6ee7b7)`,
}

export type ThemeColors = keyof typeof colors

export const fonts = {
  primary: 'Work Sans, sans-serif',
  decorative: '"Fira Code", monospaced',
}
