const highlightToken = { start: '__*', end: '*__' }

export function getHighlightedText(text: string) {
  if (!text) return ''

  const start = text.indexOf(highlightToken.start)
  const end = text.indexOf(
    highlightToken.end,
    start + highlightToken.end.length,
  )

  return end === -1
    ? text
    : text.substring(start + highlightToken.start.length, end)
}
