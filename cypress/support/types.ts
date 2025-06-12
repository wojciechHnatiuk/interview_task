import { appTranslations } from 'translations/appTranslations'


export type Language = keyof typeof appTranslations
export type Translations = typeof appTranslations.english

export const languageCodeMap = {
	english: 'en',
	britishEnglish: 'en',
	polish: 'pl-PL',
	french: 'fr-FR',
	german: 'de-DE',
	spanish: 'es-ES',
	mexicanSpanish: 'es-MX',
	portuguese: 'pt-PT',
	brazilianPortuguese: 'pt-BR',
	italian: 'it-IT',
	dutch: 'nl-NL',
	swedish: 'sv-SE',
	danish: 'da-DK',
	norwegian: 'nb-NO',
	finnish: 'fi-FI',
	russian: 'ru-RU',
	turkish: 'tr-TR',
	arabic: 'ar-SA',
	hebrew: 'he-IL',
	japanese: 'ja-JP',
	korean: 'ko-KR',
	chineseSimplified: 'zh-CN',
	chineseTraditional: 'zh-TW',
	hindi: 'hi-IN',
	indonesian: 'id-ID',
	thai: 'th-TH',
	vietnamese: 'vi-VN',
	ukrainian: 'uk-UA',
	czech: 'cs-CZ',
	slovak: 'sk-SK',
	greek: 'el-GR',
	hungarian: 'hu-HU',
	romanian: 'ro-RO',
	bulgarian: 'bg-BG',
	croatian: 'hr-HR',
	serbian: 'sr-RS',
	estonian: 'et-EE',
	latvian: 'lv-LV',
	lithuanian: 'lt-LT',
	slovenian: 'sl-SI',
	malay: 'ms-MY',
	filipino: 'fil-PH',
	bengali: 'bn-BD',
	tamil: 'ta-IN',
	telugu: 'te-IN',
	urdu: 'ur-PK',
	persian: 'fa-IR',
	icelandic: 'is-IS',
} as const

export type AppLanguage = keyof typeof languageCodeMap
export type LanguageCode = (typeof languageCodeMap)[AppLanguage]
