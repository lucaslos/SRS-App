import { searchQueryMatch } from '@utils/searchQueryMatch';
import { sortByPriority } from '@utils/simpleSort';

export function searchItems<T>({
  items,
  searchQuery,
  getStringToMatch,
}: {
  items: T[];
  getStringToMatch: (item: T) => string;
  searchQuery: string;
}) {
  const filteredItems = items.reduce((acc, item) => {
    const search = searchQueryMatch(searchQuery, getStringToMatch(item));

    if (!search.matched) return acc;

    return [
      ...acc,
      {
        item,
        search,
      },
    ];
  }, []);

  return sortByPriority(filteredItems, (field) => field.search.matchedIndex, {
    reverse: true,
  }).map(({ item }) => item);
}
