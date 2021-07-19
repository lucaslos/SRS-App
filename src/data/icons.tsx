import add from '@src/assets/icons/add.svg?raw'
import check from '@src/assets/icons/check.svg?raw'
import list from '@src/assets/icons/list.svg?raw'
import trash from '@src/assets/icons/trash.svg?raw'
import close from '@src/assets/icons/close.svg?raw'

export type Icons = 'add' | 'check' | 'list' | 'trash' | 'close'

export const iconsSvg: Record<Icons, string> = {
  add,
  check,
  list,
  trash,
  close,
}
