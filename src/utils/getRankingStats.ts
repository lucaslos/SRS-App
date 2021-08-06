import ccaeList from '@src/data/CCAE.json'
import oxford from '@src/data/oxford3000-5000.json'
import { getHighlightedText } from '@src/utils/getHighlightedText'
import { memoizer } from '@utils/memoize'
import { PartialRecord } from '@utils/typings'

const cerfLeves: PartialRecord<string, string> = {
  a1: 'Begginer',
  a2: 'Elementary',
  b1: 'Intermediate',
  b2: 'Upper Intermediate',
  c1: 'Advanced',
}

export function getRankingStats(text: string): {
  ccae: { position: number } | null
  oxford: {
    position: number
    cerf: string
    cerfDescription: string
    type: string
  } | null
} {
  const textToSearch = getHighlightedText(text).toLowerCase()

  const ccaeListIndex = ccaeList.indexOf(textToSearch)

  const oxfordListIndex = oxford.findIndex(({ w }) => w === textToSearch)

  const oxfordListItem =
    oxfordListIndex === -1 ? null : oxford[oxfordListIndex]!

  return {
    ccae: ccaeListIndex === -1 ? null : { position: ccaeListIndex + 1 },
    oxford: oxfordListItem && {
      position: oxfordListIndex + 1,
      cerf: oxfordListItem.c.toUpperCase(),
      cerfDescription: cerfLeves[oxfordListItem.c] ?? '?',
      type: oxfordListItem.p,
    },
  }
}
