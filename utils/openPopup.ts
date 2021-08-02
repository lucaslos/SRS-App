export function openPopup(url: string, title = 'Popup') {
  const w = 400
  const h = 600

  const dualScreenLeft = window.screenLeft
  const dualScreenTop = window.screenTop
  const height = document.documentElement.clientHeight

  const left = dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`,
  )

  // Puts focus on the newWindow
  if (newWindow) {
    newWindow.focus()
  }

  return newWindow
}
