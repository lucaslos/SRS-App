export function handleError(error: { message: string }) {
  // eslint-disable-next-line no-console
  console.error(error)
  // eslint-disable-next-line no-alert
  alert(error.message)
}
