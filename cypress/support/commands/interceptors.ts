// api routes like to change, i decided to to keep interceptors in a separate file for better maintainability

Cypress.Commands.add('googleHomeInterceptors', () => {
	cy.intercept('POST', '**?format=json*').as('loadFinishedRequest')
})

Cypress.Commands.add('gmailHomeInterceptors', () => {
	cy.intercept('POST', '**/trigger/trigger_anonymous?*').as(
		'loadFinishedRequest'
	)
})

Cypress.Commands.add('googleImagesHomeInterceptors', () => {
	cy.intercept('POST', '**/log?format=json&hasfast=true*').as(
		'loadFinishedRequest'
	)
})
