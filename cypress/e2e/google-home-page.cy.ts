import GmailHomePage from '@pages/GmailHomePage'
import GoogleHomePage from '@pages/GoogleHomePage'
import ImagesHomePage from '@pages/ImagesHomePage'
import RecaptchaPage from '@pages/RecaptchaPage'
import { VIEWPORTS } from 'cypress/support/requirements/requirementVars'
import { appTranslations } from 'translations/appTranslations'

const LANGUAGES_TO_TEST = Object.keys(appTranslations) as Array<keyof typeof appTranslations>

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
  LANGUAGES_TO_TEST.forEach(language => {
    VIEWPORTS.forEach(({ name, width, height }) => {
      it(`should check if all expected elements are visible after the initial load on ${name} viewport in ${language}`, () => {
        cy.viewport(width, height)
        GoogleHomePage.visit(language)
        cy.cleanStateReload()

        GoogleHomePage.assertCookieMondalContentsAreVisible(language)
          .acceptCookiesIfPresent(language)
          .assertCookieMondalContentsAreNotVisible(language)
          .assertInitialLoadExpectedElements(language)
      })
    })

    it(`should test if the suggestions are displayed when the user types in the search input (${language})`, () => {
      GoogleHomePage.visit(language)
      GoogleHomePage.getSearchInput(language).type('test search')
      GoogleHomePage.assertAutoCompleteSuggestionsAreVisible(
        ['test search', 'test search 2'],
        language
      )
    })
    if (Cypress.browser.name !== 'firefox') {
      //TODO added retries because google bot prevention sometimes doesn't work, mainly on firefox (potential bug report should be created)
      it(`should try to search and assert that ${language} recaptcha bot prevention is triggered when the user is suspected of being a bot`, () => {
        GoogleHomePage.visit(language)
        GoogleHomePage.getSearchInput(language).type('test search{enter}')
        RecaptchaPage.assertRecaptchaIsVisible(language)
      })
    }
  })

  // Skip this test for Firefox due to cross origin issues with the Gmail link
  if (Cypress.browser.name !== 'firefox') {
    it('should check gmail navigation link and assert elements visibility', () => {
      GoogleHomePage.openGmail()
      GmailHomePage.assertGmailNavigation()
    })

    it('should toggle the Google Apps menu and verify that it is displayed along with all of its elements, then toggle it off and confirm that it is no longer visible', () => {
      GoogleHomePage.openGoogleAppsMenu().assertGoogleAppsMenuIsVisible()

      // close the menu by clicking outside of it
      cy.wait(200).get('body').click(50, 50)

      GoogleHomePage.getGoogleAppsToggle().should('have.attr', 'aria-expanded', 'false')
      GoogleHomePage.getGoogleAppsMenu().should('not.be.visible')
    })
    //TODO added retries because google bot prevention sometimes doesn't work, mainly on firefox (potential bug report should be created)
    it('should trigger recaptcha on direct search results navigation', () => {
      cy.visit('https://www.google.com/search?q=test+search')
      RecaptchaPage.assertRecaptchaIsVisible()
    })
    it('should assert that the im feeling lucky button redirects to gogogle doodles when the search input is empty', () => {
      GoogleHomePage.getSearchInput().should('have.value', '')
      GoogleHomePage.getFeelingLuckyButton().eq(1).click()
      cy.url().should('eq', 'https://doodles.google/')
    })
  }

  it('should check images navigation link and assert elements visibility', () => {
    cy.googleImagesHomeInterceptors()

    GoogleHomePage.openImages()
    cy.wait('@loadFinishedRequest')
    ImagesHomePage.assertImagesNavigation()
  })

  it('search submit should not redirect when search input is empty', () => {
    cy.url().then(url => {
      GoogleHomePage.getSearchInput().should('have.value', '')
      GoogleHomePage.getSearchButton().eq(1).click()
      cy.url().should('eq', url)
    })
  })
})
