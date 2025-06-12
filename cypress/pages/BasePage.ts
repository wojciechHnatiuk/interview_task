import { AppLanguage, languageCodeMap } from 'cypress/support/types'
import { DEFAULT_LANGUAGE } from 'cypress/support/requirements/requirementVars'

/**
 * @remarks
 * All extending pages must provide a URL template with `{langCode}`
 * e.g. 'https://example.com/intl/{langCode}/gmail/'
 */
export abstract class BasePage {
	protected abstract urlTemplate: string

	protected getBaseUrl(
		language?: AppLanguage,
		overrideLangCode?: string
	): string {
		const langCode =
			overrideLangCode ?? languageCodeMap[language ?? DEFAULT_LANGUAGE]
		return this.urlTemplate.replace('{langCode}', langCode)
	}
}
