import { useRouter } from '@rturnq/solid-router'
import { typedObjectEntries } from '@utils/typed'

function getSearchURL(query: Record<string, string | null>) {
  const normalizedQuery: Record<string, string> = {}

  for (const [key, value] of typedObjectEntries(query)) {
    if (value) {
      normalizedQuery[key] = value
    }
  }

  return new URLSearchParams(normalizedQuery).toString()
}

export function getQueryLink(query: Record<string, string | null>): string {
  const router = useRouter()

  return `${router.location.path}?${getSearchURL(query)}`
}

export function navigate(
  path: string | null,
  query?: Record<string, string | null>,
) {
  const router = useRouter()

  if (path) {
    router.push(path)
  } else {
    router.push(`${router.location.path}?${query ? getSearchURL(query) : ''}`)
  }
}
