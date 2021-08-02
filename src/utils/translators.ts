import { openPopup } from '@utils/openPopup'

const translatorsUrl = {
  cambridge: (query: string) =>
    `http://dictionary-beta.cambridge.org/us/search/english-portuguese/direct/?q=${encodeURIComponent(
      query,
    )}`,
  reversoContext: (query: string) =>
    `http://context.reverso.net/traducao/ingles-portugues/${encodeURIComponent(
      query,
    )}`,
  googleTranslate: (query: string) =>
    `https://translate.google.com/?source=gtx_m#en/pt/${encodeURIComponent(
      query,
    )}`,
}

export type Translators = keyof typeof translatorsUrl

export function openTranslationPopup(translator: Translators, query: string) {
  openPopup(translatorsUrl[translator](query))
}
