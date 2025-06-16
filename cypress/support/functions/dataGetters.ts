import { appTranslations } from 'translations/appTranslations'

import { Language, Translations } from '../types'

export function getTranslation(getter: (t: Translations) => string, language?: Language): string {
  const fallbackLang: Language = 'english'

  try {
    const langToUse = language && appTranslations[language] ? language : fallbackLang
    const value = getter(appTranslations[langToUse])
    if (value !== undefined) return value
  } catch {
    // continue to fallback
  }

  // fallback if undefined or error
  return getter(appTranslations[fallbackLang])
}
