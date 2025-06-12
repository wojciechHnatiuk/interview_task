import GmailHomePage from '@pages/GmailHomePage'
import GoogleHomePage from '@pages/GoogleHomePage'
import ImagesHomePage from '@pages/ImagesHomePage'
import { VIEWPORTS } from 'cypress/support/requirements/requirementVars'
import { appTranslations } from 'translations/appTranslations'

const LANGUAGES_TO_TEST = Object.keys(appTranslations) as Array<
	keyof typeof appTranslations
>

describe('Google Home Page Tests', () => {
	beforeEach(() => {
		cy.googleHomeInterceptors()
		cy.clearCookies().clearLocalStorage().viewport(1920, 1080)
		GoogleHomePage.visit().acceptCookiesIfPresent()
		cy.wait('@loadFinishedRequest')
	})

	// Rather than creating separate tests for each viewport in each app section,
	// this example demonstrates how I would approach testing across multiple screen sizes—and
	// I would apply this approach in other sections as well.
	// Additionally added translation test layer because the language changes often cause issues on mobile viewports
	LANGUAGES_TO_TEST.forEach((language) => {
		VIEWPORTS.forEach(({ name, width, height }) => {
			it(`should check if all expected elements are visible after the initial load on ${name} viewport in ${language}`, () => {
				cy.viewport(width, height)
				GoogleHomePage.visit(language)
				cy.cleanStateReload()

				GoogleHomePage.assertCookieMondalContentsAreVisible(language)
				GoogleHomePage.acceptCookiesIfPresent(language)
				GoogleHomePage.assertCookieMondalContentsAreNotVisible(language)

				GoogleHomePage.assertInitialLoadExpectedElements(language)
			})
		})
	})

	it('should check images navigation link and assert elements visibility', () => {
		cy.googleImagesHomeInterceptors()

		GoogleHomePage.openImages()
		cy.wait('@loadFinishedRequest')
		ImagesHomePage.assertImagesNavigation()
	})

	it('should check gmail navigation link and assert elements visibility', () => {
		GoogleHomePage.openGmail()
		GmailHomePage.assertGmailNavigation()
	})

	it('should toggle the Google Apps menu and verify that it is displayed along with all of its elements, then toggle it off and confirm that it is no longer visible', () => {
		GoogleHomePage.openGoogleAppsMenu()
		GoogleHomePage.assertGoogleAppsMenuIsVisible()

		// close the menu by clicking outside of it
		cy.wait(200).get('body').click(50, 50)

		GoogleHomePage.getGoogleAppsToggle().should(
			'have.attr',
			'aria-expanded',
			'false'
		)
		GoogleHomePage.getGoogleAppsMenu().should('not.be.visible')
	})
})
