import { searchQueryMatch } from '@utils/searchQueryMatch'
import { sortByPriority } from '@utils/simpleSort'

export function searchItems<T>({
  items,
  searchQuery,
  getStringToMatch,
}: {
  items: T[]
  getStringToMatch: (item: T) => string
  searchQuery: string
}) {
  const searchedItems: { item: T; matchedIndex: number }[] = []

  items.forEach((item) => {
    const search = searchQueryMatch(searchQuery, getStringToMatch(item))

    if (search.matched) {
      searchedItems.push({ item, matchedIndex: search.matchedIndex })
    }
  })

  return sortByPriority(searchedItems, (item) => item.matchedIndex, {
    reverse: true,
  }).map(({ item }) => item)
}
