Cypress.Commands.add('getCountryFromCurrentIp', () => {
	cy.request('GET', 'https://ipwho.is/').then((response) => {
		expect(response.status).to.eq(200)
		return response.body.country
	})
})

Cypress.Commands.add(
	'findScrollableParent',
	{ prevSubject: true },
	(subject) => {
		let node: HTMLElement | null = subject[0]

		while (node && node !== document.body) {
			const style = getComputedStyle(node)
			if (
				(style.overflowY === 'auto' || style.overflowY === 'scroll') &&
				node.scrollHeight > node.clientHeight
			) {
				return cy.wrap(node)
			}
			node = node.parentElement
		}

		cy.log('No scrollable parent found')
	}
)

Cypress.Commands.add('cleanStateReload', () => {
	cy.clearCookies().clearLocalStorage().reload()
})

Cypress.Commands.add(
	'getIframeBody',
	(selector: string): Cypress.Chainable<JQuery<HTMLElement>> => {
		return cy
			.get(selector)
			.its('0.contentDocument.body')
			.should('not.be.empty')
			.then((body) => cy.wrap(body))
	}
)
