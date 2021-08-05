export function formatDuration(millisecond: number): string {
  const seconds = Math.floor(millisecond / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  const duration = []

  if (years > 0) {
    duration.push(`${years} years`)
  }

  if (months > 0) {
    duration.push(`${months} months`)
  }

  if (days > 0) {
    duration.push(`${days} days`)
  }

  if (hours > 0) {
    duration.push(`${hours} hours`)
  }

  if (minutes > 0) {
    duration.push(`${minutes} min.`)
  }

  if (seconds > 0) {
    duration.push(`${seconds} sec.`)
  }

  return duration.join(' ')
}
