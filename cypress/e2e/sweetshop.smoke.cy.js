describe('Sweetshop – Smoke testai', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Atidaro pradinį puslapį ir patikrina antraštę bei navigaciją', () => {
    cy.visit('/');
    cy.get('header h1.display-3')
      .should('be.visible')
      .invoke('text')
      .then((t) => {
        const txt = t.trim().toLowerCase();
        expect(txt).to.match(/welcome|browse sweets|sweet shop project/);
      });

    // Navigation links
    cy.get('a.nav-link[href="/sweets"]').should('be.visible').and('contain', 'Sweets');
    cy.get('a.nav-link[href="/about"]').should('be.visible').and('contain', 'About');
    cy.get('a.nav-link[href="/login"]').should('be.visible').and('contain', 'Login');
    cy.get('a.nav-link[href="/basket"]').should('be.visible').and('contain', 'Basket');

    // Navigate to About and back
    cy.nav('/about');
    cy.url().should('include', '/about');
    cy.contains(/Sweet Shop Project/i).should('be.visible');

    cy.nav('/sweets');
    cy.url().should('include', '/sweets');
  });

  it('Key images are loaded (naturalWidth > 0)', () => {
    cy.visit('/');
    cy.get('img').its('length').should('be.gte', 1);
    cy.get('img').each(($img) => {
      cy.wrap($img)
        .should('be.visible')
        .and(($el) => expect($el[0].naturalWidth).to.be.greaterThan(0));
    });
  });

  // Additional navigation tests
  describe('Extended Navigation Tests', () => {
    it('Should navigate between all pages in different combinations', () => {
      cy.visit('/');
      
      // From homepage to Sweets
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');
      
      // From Sweets to About
      cy.contains('About').click();
      cy.contains('Sweet Shop Project').should('be.visible');
      
      // From About to Login
      cy.contains('Login').click();
      cy.contains('Login').should('be.visible');
      cy.contains('Please enter your email address and password').should('be.visible');
      
      // From Login to Basket
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');
    });

    it('Should handle navigation from Basket to other pages', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      
      // Back to homepage
      cy.contains('Sweet Shop').click();
      cy.contains('Welcome to the sweet shop!').should('be.visible');
      
      // To Sweets
      cy.contains('Basket').click();
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');
    });
  });
});