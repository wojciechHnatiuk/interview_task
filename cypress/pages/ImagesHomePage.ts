import { getTranslation } from 'cypress/support/functions/dataGetters'
import { AppLanguage, Language } from 'cypress/support/types'

import { BasePage } from './BasePage'

/**
 * Page Object representing Gmail home page
 */
class ImagesHomePage extends BasePage {
	protected urlTemplate: string = '/imghp?hl={langCode}'

	protected getSelectors(language?: Language) {
		const t = getTranslation(language, (t) => t.imagesPage)

		return {
			googleImagesLogo: `img[alt="${t.logoAlt}"]`,
			searchInput: `input[aria-label="${t.searchInputAriaLabel}"]`,
		}
	}
	/**
	 * Visit the Google home page
	 * @returns Returns the page object for chaining
	 */
	visit(language?: AppLanguage): this {
		cy.visit(this.getBaseUrl(language))
		return this
	}

	assertSvgsAreVisible() {
		cy.get('svg').eq(0).should('be.visible')
		cy.get('svg').eq(2).should('be.visible')
		cy.get('svg').eq(4).should('be.visible')
		cy.get('svg').eq(5).should('be.visible')
		return this
	}

	assertImagesNavigation(language?: Language) {
		const footerTranslations = getTranslation(language, (t) => t.footer)
		const imagesPageTranslations = getTranslation(language, (t) => t.imagesPage)

		cy.url()
			.should('include', this.getBaseUrl(language))
			.title()
			.should('include', 'Google Images')

		this.assertSvgsAreVisible()

		cy.isVisibleContentMultiple([...Object.values(footerTranslations)])

		cy.get(this.getSelectors(language).googleImagesLogo)
			.parent()
			.within(() => {
				cy.isVisibleContent(imagesPageTranslations.images)
			})
		cy.isVisibleElementMultiple(Object.values(this.getSelectors(language)))
		return this
	}
}

export default new ImagesHomePage()
