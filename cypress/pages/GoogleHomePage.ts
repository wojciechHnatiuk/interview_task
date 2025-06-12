import { splitIntoParts } from 'cypress/support/functions/customArrayMethods'
import { getTranslation } from 'cypress/support/functions/dataGetters'
import { AppLanguage, Language } from 'cypress/support/types'
import { appTranslations } from 'translations/appTranslations'

import { BasePage } from './BasePage'

/**
 * Page Object representing Google's home page
 * Contains all selectors and methods related to Google homepage functionality
 */
class GoogleHomePage extends BasePage {
  protected urlTemplate: string = `/?hl={langCode}`

  protected getSelectors(language?: Language) {
    const t = getTranslation(language, t => t.homePage)

    return {
      searchInput: `textarea[aria-label="${t.searchInputLabel}"]`,
      searchButton: `[aria-label="${t.searchButtonAriaLabel}"]`,
      feelingLuckyButton: `[aria-label="${t.feelingLuckyButtonAriaLabel}"]`,
      googleAppsToggle: `[aria-label="${t.googleAppsToggleAriaLabel}"]`,
      googleAppsContainer: `iframe[name="app"]`,
    }
  }

  /**
   * Retrieves the search input element from the Google Home Page.
   *
   * @returns {Cypress.Chainable} A Cypress chainable object wrapping the search input element.
   */
  getSearchInput(language?: Language): Cypress.Chainable {
    return cy.get(this.getSelectors(language).searchInput)
  }
  /**
   * Returns a Cypress chainable object for the Google search button element.
   *
   * @returns {Cypress.Chainable} A chainable Cypress object representing the search button.
   */
  getSearchButton(language?: Language): Cypress.Chainable {
    return cy.get(this.getSelectors(language).searchButton)
  }
  /**
   * Returns a Cypress chainable for the "I'm Feeling Lucky" button on the Google home page.
   *
   * @returns {Cypress.Chainable} A Cypress chainable object for the "I'm Feeling Lucky" button.
   */
  getFeelingLuckyButton(language?: Language): Cypress.Chainable {
    return cy.get(this.getSelectors(language).feelingLuckyButton)
  }

  /**
   * Returns a Cypress chainable object for the Google Apps toggle element.
   *
   * @returns {Cypress.Chainable} The chainable object for the Google Apps toggle.
   */
  getGoogleAppsToggle(language?: Language): Cypress.Chainable {
    return cy.get(this.getSelectors(language).googleAppsToggle)
  }
  /**
   * Retrieves the Google Apps menu container element on the Google Home Page.
   *
   * @returns {Cypress.Chainable} A Cypress chainable object for the Google Apps menu container.
   */
  getGoogleAppsMenu(language?: Language): Cypress.Chainable {
    return cy.get(this.getSelectors(language).googleAppsContainer)
  }

  /**
   * Retrieves the body of the Google Apps menu iframe as a Cypress chainable object.
   *
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} A Cypress chainable containing the body of the Google Apps menu iframe.
   */
  getGoogleAppsMenuBody(language?: Language): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getIframeBody(this.getSelectors(language).googleAppsContainer)
  }

  /**
   * Visit the Google home page
   * @returns Returns the page object for chaining
   */

  visit(language?: AppLanguage): this {
    cy.visit(this.getBaseUrl(language))

    return this
  }

  /**
   * Accept cookies if the dialog is present
   * @returns Returns the page object for chaining
   */
  acceptCookiesIfPresent(language?: Language): this {
    const cookieModalTranslations = getTranslation(language, t => t.cookiesModal)

    cy.get('body').then($body => {
      const acceptText = cookieModalTranslations.acceptAll

      const $buttons = $body.find('button')
      const $acceptBtn: JQuery<HTMLButtonElement> = $buttons.filter(
        (_: number, btn: HTMLButtonElement) => btn.textContent?.trim() === acceptText
      )

      if ($acceptBtn.length && $acceptBtn.is(':visible')) {
        cy.wrap($acceptBtn).click({ force: true })
      }
    })

    return this
  }

  /**
   * Assert that the contents of the cookies modal are visible
   * This is useful to ensure that the modal shows up when expected
   * @returns Returns the page object for chaining
   */
  assertCookieMondalContentsAreVisible(language?: Language): this {
    const cookiesModal = getTranslation(language, t => t.cookiesModal)
    const cookiesModalContents: string[] = Object.values(cookiesModal)

    const cookiesModalParts = splitIntoParts(cookiesModalContents, 3)
    cookiesModalParts.forEach(part => {
      cy.isVisibleContentMultiple(part)
      // this quirky action is needed to scroll the modal on mobile viewports and assert the visibility of entire modal contents
      cy.contains(cookiesModal.header)
        .findScrollableParent()
        .then(scrollableParent => {
          if (!scrollableParent) {
            return cy.log('No scrollable parent found for the cookies modal header, moving on')
          }
          cy.wrap(scrollableParent).scrollTo('bottom')
        })
    })

    return this
  }

  /**
   * Assert that the contents of the cookies modal are not visible
   * This is useful to ensure that the modal does not show up unexpectedly
   * @returns Returns the page object for chaining
   */
  assertCookieMondalContentsAreNotVisible(language?: Language) {
    const excludedKeys = ['privacy', 'terms']
    const cookiesModalTranslations = getTranslation(language, t => t.cookiesModal)
    const cookiesModalContents: string[] = Object.entries(cookiesModalTranslations)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([, value]) => value)

    cy.isNotVisibleContentMultiple(cookiesModalContents)
    return this
  }

  /**
   * Assert that specific SVG icons are visible on the page
   * Usually these are the Google logo and other icons that are actually visible (elements are asserted by index because of the lack of more reliable selectors)
   * @returns Returns the page object for chaining
   */
  assertSvgsAreVisible() {
    cy.get('svg').eq(0).should('be.visible')
    cy.get('svg').eq(1).should('be.visible')
    cy.get('svg').eq(3).should('be.visible')
    cy.get('svg').eq(5).should('be.visible')
    cy.get('svg').eq(6).should('be.visible')
    return this
  }

  /**
   * Asserts that the expected elements are visible on the initial load of the Google Home Page,
   * based on the user's country determined from their current IP address.
   *
   * This method:
   * - Maps the detected country to its corresponding language.
   * - Asserts the visibility of SVG elements on the page.
   * - Checks for the presence and visibility of key UI elements such as the search box,
   *   "Google Search" and "I'm Feeling Lucky" buttons.
   * - Verifies that specific content, including localized language options and country name,
   *   is visible on the page.
   *
   * @remarks
   * Extend the `countryToLanguageMap` as needed to support additional countries and languages.
   */
  assertInitialLoadExpectedElements(language?: Language) {
    cy.getCountryFromCurrentIp().then(ipCountryName => {
      const userLanguage = language ?? 'english'

      const countryNameTranslations: Record<string, Record<Language, string>> = {
        Poland: {
          english: 'Poland',
          polish: 'Polska',
        },
      }

      const languageLabelMap: Record<Language, string> = {
        english: 'polski',
        polish: 'English',
      }

      const ipCountryLocalized =
        countryNameTranslations[ipCountryName]?.[userLanguage] ?? ipCountryName

      const footerTranslations = getTranslation(userLanguage, t => t.footer)
      const homePageTranslations = getTranslation(userLanguage, t => t.homePage)

      cy.title().should('eq', 'Google')
      this.assertSvgsAreVisible()

      const visibleContents = [...Object.values(footerTranslations)]

      if (ipCountryName === 'Poland' && userLanguage === 'english') {
        visibleContents.push(`${homePageTranslations.googleOfferedIn} ${languageLabelMap.english}`)
      }

      visibleContents.push(ipCountryLocalized)

      cy.isVisibleElementMultiple([
        this.getSelectors(userLanguage).searchInput,
        this.getSelectors(userLanguage).searchButton,
        this.getSelectors(userLanguage).feelingLuckyButton,
      ]).isVisibleContentMultiple(visibleContents)
    })
  }

  /**
   * Opens the Google Apps menu by clicking the toggle button.
   * This method is used to interact with the Google Apps menu on the home page.
   *
   * @returns {this} The current instance for method chaining.
   */
  openGoogleAppsMenu(): this {
    this.getGoogleAppsToggle().click()
    return this
  }

  /**
   * Opens the Google Apps menu by clicking the toggle button.
   * After clicking, asserts that the toggle's 'aria-expanded' attribute is set to 'true',
   * indicating that the menu is expanded.
   *
   * @returns {this} The current instance for method chaining.
   */
  assertGoogleAppsMenuIsVisible(language?: Language): this {
    const googleAppsTranslations = getTranslation(language, t => t.googleApps)
    const appParts = splitIntoParts(Object.values(googleAppsTranslations), 3)
    appParts.forEach((part, index) => {
      cy.wait(200).then(() => {
        if (index > 0) {
          this.getGoogleAppsMenuBody().contains(part[0]).scrollIntoView()
        }
      })
      this.getGoogleAppsMenuBody().within(() => {
        cy.isVisibleContentMultiple(part)
      })
    })

    return this
  }

  /**
   *
   * @returns Returns the page object for chaining
   * Opens Gmail by clicking the Gmail link on the Google home page
   * @remarks
   * This method assumes that the Gmail link is present on the Google home page.
   */
  openGmail(): this {
    // in here using just plain english for gmail, because it is named conssistently through the languages
    cy.contains(appTranslations.english.homePage.gmail).click()
    return this
  }

  /**
   * Clicks on the "Images" link or button on the Google Home Page using the English translation,
   * and returns the current page object for method chaining.
   *
   * @returns {this} The current instance of the page object for chaining further actions.
   */
  openImages(language?: Language): this {
    const homePageTranslations = getTranslation(language, t => t.homePage)
    cy.contains(homePageTranslations.images).click()
    return this
  }
}

export default new GoogleHomePage()
