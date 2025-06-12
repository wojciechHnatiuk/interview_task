Cypress.Commands.add('isVisibleContent', (text: string) => {
	cy.contains(text).should('be.visible')
})

Cypress.Commands.add('isVisibleContentMultiple', (texts: string[]) => {
	texts.forEach((text) => {
		cy.isVisibleContent(text)
	})
})

Cypress.Commands.add('isVisibleElement', (selector: string) => {
	cy.get(selector).should('be.visible')
})

Cypress.Commands.add('isVisibleElementMultiple', (selectors: string[]) => {
	selectors.forEach((selector) => {
		cy.isVisibleElement(selector)
	})
})
Cypress.Commands.add('isNotVisibleContent', (text: string) => {
	cy.contains(text).should('not.be.visible')
})

Cypress.Commands.add('isNotVisibleContentMultiple', (texts: string[]) => {
	texts.forEach((text) => {
		cy.isNotVisibleContent(text)
	})
})

Cypress.Commands.add('isNotVisibleElement', (selector: string) => {
	cy.get(selector).should('not.be.visible')
})

Cypress.Commands.add('isNotVisibleElementMultiple', (selectors: string[]) => {
	selectors.forEach((selector) => {
		cy.isNotVisibleElement(selector)
	})
})
