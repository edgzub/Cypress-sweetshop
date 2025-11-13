// Extra commands for easier interactions

Cypress.Commands.add('nav', (href) => {
		// In some site versions there are duplicate links – click the first visible one
	cy.get(`a.nav-link[href="${href}"]`).first().should('be.visible').click();
});

Cypress.Commands.add('addProduct', (nameLike) => {
		// Find a product card by a name fragment (case-insensitive)
	cy.contains('.card', new RegExp(nameLike, 'i'))
		.should('be.visible')
		.within(() => {
			cy.get('a.addItem').should('be.visible').click();
		});
});

Cypress.Commands.add('basketBadge', () => {
	return cy.get('a.nav-link[href="/basket"]').find('.badge');
});

Cypress.Commands.add('assertNoVisibleInvalidFeedback', () => {
	cy.get('.invalid-feedback:visible').should('have.length', 0);
});