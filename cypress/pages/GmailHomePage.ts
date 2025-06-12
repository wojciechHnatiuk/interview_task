import { getTranslation } from 'cypress/support/functions/dataGetters'
import { AppLanguage, Language } from 'cypress/support/types'

import { BasePage } from './BasePage'

/**
 * Page Object representing Gmail home page
 */
class GmailHomePage extends BasePage {
  protected urlTemplate: string = 'https://workspace.google.com/intl/{langCode}/gmail/'

  protected getSelectors(language?: Language) {
    const t = getTranslation(language, t => t.gmailPage)
    return {
      gmailAccountCreateButton: `gws-dropdown-button:contains("${t.createAccount}")`,
      signInButton: `a:contains("${t.signIn}")`,
      headerCreateAccount: `[aria-label="${t.headerCreateAccount}"]`,
      cookieBar: '.glue-cookie-notification-bar',
      linkLabel: '.link__label',
      gmailImg: `img[alt="${t.logoAlt}"]`,
    }
  }

  /**
   * Visit the Gmail home page
   * @returns Returns the page object for chaining
   */
  visit(language?: AppLanguage): this {
    cy.visit(this.getBaseUrl(language))
    return this
  }

  assertGmailNavigation(language?: Language) {
    const gmailHomePageTranslations = getTranslation(language, t => t.gmailPage)
    cy.url().should(
      'include',
      this.getBaseUrl(
        language,
        language === 'english' || language === undefined ? 'en-US' : undefined
      )
    )

    cy.title().should('include', 'Gmail')
    const {
      logoAlt: _logoAlt,
      signIn: _signIn,
      createAccount: _createAccount,
      forWork: _forWork,
      headerCreateAccount: _headerCreateAccount,
      headerForWork: _headerForWork,
      ...restTranslations
    } = gmailHomePageTranslations
    cy.isVisibleContentMultiple(Object.values(restTranslations))
    cy.isVisibleElementMultiple(Object.values(this.getSelectors(language)))
    return this
  }
}

export default new GmailHomePage()
