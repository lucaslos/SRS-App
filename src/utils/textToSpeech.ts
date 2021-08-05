import strip from 'remove-markdown'

export async function textToSpeech(text: string, lang = 'en-US') {
  const msg = new SpeechSynthesisUtterance()
  const voices = window.speechSynthesis.getVoices()
  msg.volume = 1 // 0 to 1
  msg.pitch = 1 // 0 to 2

  const googleVoice = voices.find(
    (voice) => voice.voiceURI.includes('Google') && voice.lang === lang,
  )

  if (googleVoice) msg.voice = googleVoice
  msg.text = strip(text)
  msg.lang = lang

  return new Promise<boolean>((resolve) => {
    window.speechSynthesis.speak(msg)

    msg.onend = () => resolve(true)
    msg.onerror = () => resolve(false)
  })
}
