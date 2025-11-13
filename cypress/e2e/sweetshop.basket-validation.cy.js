describe('Sweetshop – Basket form validation', () => {
  beforeEach(() => {
    cy.visit('/basket');
  });

  it('Incomplete form shows all error messages', () => {
    cy.contains('button', /Continue to checkout/i).click();
    const messages = [
      'Valid first name is required.',
      'Valid last name is required.',
      'Please enter a valid email address for shipping updates.',
      'Please enter your shipping address.',
      'Please select a valid country.',
      'Please provide a valid state.',
      'Zip code required.',
      'Name on card is required',
      'Credit card number is required',
      'Expiration date required',
      'Security code required',
    ];
    messages.forEach((m) => {
      cy.contains('.invalid-feedback', m).should('be.visible');
    });
  });

  // HTML5 email validation considers strings with '@' but no '.' as valid, so only missing '@' should error
  it('Invalid email variant: missing @ shows error', () => {
    cy.get('#email').clear().type('johnsmith');
    cy.contains('button', /Continue to checkout/i).click();
    cy.contains('.invalid-feedback', 'Please enter a valid email address for shipping updates.').should('be.visible');
  });

  it('Email without dot in domain is accepted (no error)', () => {
    cy.get('#email').clear().type('johnsmith@testcom');
    cy.contains('button', /Continue to checkout/i).click();
    cy.contains('.invalid-feedback', 'Please enter a valid email address for shipping updates.').should('not.be.visible');
  });

  it('Numeric characters in name fields are accepted (current implementation)', () => {
    cy.get('input#name').should('have.length.gte', 2);
    cy.get('input#name').eq(0).type('12345');
    cy.get('input#name').eq(1).type('67890');
    cy.get('#cc-name').type('12345 12345');
    cy.contains('button', /Continue to checkout/i).click();
    // Expect no first/last name error messages visible
    cy.contains('.invalid-feedback', 'Valid first name is required.').should('not.be.visible');
    cy.contains('.invalid-feedback', 'Valid last name is required.').should('not.be.visible');
  });

  const nonNumericSets = [
    { label: 'letters only', card: 'ABCDABCDABCDABCD', exp: 'ABCD' },
    { label: 'symbols only', card: '!@#$!@#$!@#$!@#$', exp: '!@#$' },
    { label: 'letters and symbols', card: 'AB!@AB!@AB!@AB!@', exp: 'AB!@' },
  ];

  nonNumericSets.forEach(({ label, card, exp }) => {
    it(`Non-numeric card fields (${label}) retain typed characters (no built-in pattern)`, () => {
      cy.get('#cc-number').type(card, { force: true });
      cy.get('#cc-number').invoke('val').should('eq', card);
      cy.get('#cc-expiration').type(exp, { force: true });
      cy.get('#cc-expiration').invoke('val').should('eq', exp);
    });
  });

  const cvvVariants = [ 'ABC', '*&(', 'A$C' ];
  cvvVariants.forEach((cvv) => {
    it(`CVV field should ignore invalid characters: ${cvv}`, () => {
      const field = cy.get('#cc-cvv');
      field.type(cvv, { force: true });
      // type=number will strip invalid chars; assert value either empty or only digits extracted
      field.invoke('val').then((val) => {
        expect(val).to.match(/^\d*$/);
        expect(val.length).to.be.lte(cvv.length); // Should not contain letters/symbols
      });
    });
  });

  it('Correct details submission shows no validation errors', () => {
    cy.get('input#name').should('have.length.gte', 2);
    cy.get('input#name').eq(0).type('John');
    cy.get('input#name').eq(1).type('Smith');
    cy.get('#email').type('john.smith@test.com');
    cy.get('#address').type('10-12 Fairfax St');
    cy.get('#country').select('United Kingdom');
    cy.get('#city').select('Bristol');
    cy.get('#zip').type('BS1 3DB');
    cy.get('#cc-name').type('John Smith');
    cy.get('#cc-number').type('4111 1111 1111 1111');
    cy.get('#cc-expiration').type('12/40');
    cy.get('#cc-cvv').type('123');
    cy.contains('button', /Continue to checkout/i).click();
    // Form should validate without showing visible error messages
    cy.get('.invalid-feedback:visible').should('have.length', 0);
  });
});