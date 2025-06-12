import { getTranslation } from 'cypress/support/functions/dataGetters'
import { Language } from 'cypress/support/types'

class RecaptchaPage {
  protected readonly recaptchaFrame = 'iframe[title="reCAPTCHA"]'
  protected readonly anchorLabel = '#recaptcha-anchor-label'
  protected readonly checkboxBorder = '.recaptcha-checkbox-border'

  assertRecaptchaIsVisible(language?: Language) {
    const recaptchaTranslations = getTranslation(language, t => t.recaptcha)
    cy.getIframeBody(this.recaptchaFrame).within(() => {
      cy.isVisibleElementMultiple([this.anchorLabel, this.checkboxBorder])
    })

    const { notARobot: _notARobot, ...translationsOutsideIframe } = recaptchaTranslations
    cy.isVisibleContentMultiple(Object.values(translationsOutsideIframe))
  }
}

export default new RecaptchaPage()
