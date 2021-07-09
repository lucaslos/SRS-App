import add from '@src/assets/icons/add.svg?raw'
import check from '@src/assets/icons/check.svg?raw'
import list from '@src/assets/icons/list.svg?raw'

export type Icons = 'add' | 'check' | 'list'

export const iconsSvg: Record<Icons, string> = {
  add,
  check,
  list,
}
