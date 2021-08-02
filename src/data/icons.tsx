import add from '@src/assets/icons/add.svg?raw'
import check from '@src/assets/icons/check.svg?raw'
import list from '@src/assets/icons/list.svg?raw'
import trash from '@src/assets/icons/trash.svg?raw'
import close from '@src/assets/icons/close.svg?raw'
import more from '@src/assets/icons/more.svg?raw'
import edit from '@src/assets/icons/edit.svg?raw'
import external from '@src/assets/icons/external.svg?raw'
import warning from '@src/assets/icons/warning.svg?raw'

export type Icons =
  | 'add'
  | 'external'
  | 'check'
  | 'list'
  | 'trash'
  | 'warning'
  | 'close'
  | 'more'
  | 'edit'

export const iconsSvg: Record<Icons, string> = {
  add,
  check,
  list,
  trash,
  close,
  external,
  warning,
  edit,
  more,
}
