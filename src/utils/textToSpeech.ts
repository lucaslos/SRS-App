import removeMd from 'remove-markdown';

export default function textToSpeech(text: string, lang = 'en-US', onEnd?: () => any) {
  const msg = new SpeechSynthesisUtterance();

  const voices = window.speechSynthesis.getVoices();
  const googleVoice = voices.find(
    voice => voice.voiceURI.includes('Google') && voice.lang === lang
  );

  if (googleVoice) msg.voice = googleVoice;
  msg.volume = 1; // 0 to 1
  msg.pitch = 1; // 0 to 2
  msg.text = removeMd(text);
  msg.lang = lang;

  speechSynthesis.speak(msg);

  if (onEnd) {
    msg.onend = onEnd;
  }
}
