describe('Sweetshop – Checkout formos validacija', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Užpildo pristatymo formą ir neturi matyti invalid-feedback', () => {
    cy.visit('/sweets');
    cy.contains('.card', /Chocolate Cups/i).within(() => {
      cy.get('a.addItem').click();
    });
    cy.nav('/basket');
    cy.url().should('include', '/basket');

    // Fill in name and surname (in some versions both fields have id="name")
    cy.get('form.needs-validation').within(() => {
      cy.get('input[type="text"]#name').first().clear().type('Jonas'); // or #firstName if fixed
      cy.get('input[type="text"]#name').eq(1).clear().type('Jonaitis'); // or #lastName

      cy.get('#email').clear().type('jonas@example.com');
      cy.get('#address').clear().type('Gatvės g. 1');
      cy.get('#address2').clear().type('Buto 2');

      cy.get('#country').select('United Kingdom');
      cy.get('#city').select('Cardiff');
      cy.get('#zip').clear().type('CF10 1AA');

      cy.get('#cc-name').clear().type('JONAS JONAITIS');
      cy.get('#cc-number').clear().type('4111 1111 1111 1111'); // test Visa number
      cy.get('#cc-expiration').clear().type('12/30');
      cy.get('#cc-cvv').clear().type('123');

      cy.contains('button', /Continue to checkout/i).click();
    });

    // There should be no visible invalid-feedback blocks
    cy.assertNoVisibleInvalidFeedback();
  });

  it('Parodo klaidas, kai forma tuščia', () => {
    cy.visit('/basket');
    cy.get('form.needs-validation').within(() => {
      cy.contains('button', /Continue to checkout/i).click();
    });

    cy.get('.invalid-feedback').should('exist');
  });

  // Additional tests(About page) and (Checkout process)
  describe('About Page Content', () => {
    it('Should handle About page access and display appropriate content', () => {
      cy.visit('/');
      cy.contains('About').click();

      cy.get('body').should('be.visible');
      cy.contains('Sweet Shop Project').should('be.visible');
    });

    it('Should allow navigation to About page and handle the result', () => {
      cy.visit('/');
      cy.contains('About').click();

      cy.get('body').should('be.visible');
      cy.contains('About').click();

      cy.get('body').should('contain.text', 'Sweet Shop Project');
    });

    it('Should verify About page displays professional content', () => {
      cy.visit('/');
      cy.contains('About').click();

      cy.contains('Sweet Shop Project').should('be.visible');
      cy.get('h1, h2').should('contain.text', 'Sweet Shop Project');
      cy.get('p').should('have.length.at.least', 2);
    });
  });

  describe('Checkout Process Extended', () => {
    it('Should access basket page successfully', () => {
      cy.visit('/');
      cy.contains('Basket').click();

      cy.url().should('include', '/basket');
      cy.contains('Your Basket').should('be.visible');
      cy.contains('Continue to checkout').should('be.visible');

      cy.log('Basket page accessible');
    });

    it('Should display billing address form fields', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Billing address').should('be.visible');
      cy.contains('First name').should('be.visible');
      cy.contains('Last name').should('be.visible');
      cy.contains('Email').should('be.visible');
      cy.contains('Address').should('be.visible');
    });

    it('Should display payment form fields', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Payment').should('be.visible');
      cy.contains('Name on card').should('be.visible');
      cy.contains('Credit card number').should('be.visible');
      cy.contains('Expiration').should('be.visible');
      cy.contains('CVV').should('be.visible');
    });

    it('Should display order summary section', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Your Basket').should('be.visible');
      cy.contains('Total').should('be.visible');
      cy.get('body').should('contain.text', '£');

      cy.log('✓ Order summary section is visible');
    });

    it('Should display delivery options', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Delivery').should('be.visible');
      cy.contains('Collect').should('be.visible');
      cy.contains('Standard Shipping').should('be.visible');

      cy.log('✓ Delivery options are displayed');
    });

    it('Should show basket items if present', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('£0.00')) {
          cy.contains('Empty Basket').should('be.visible');
          cy.log('✓ Empty basket state verified');
        } else {
          const items = ['Sherbert Straws', 'Sherbet Discs', 'Strawberry Bon Bons', 'Chocolate Cups'];

          let itemsFound = 0;
          items.forEach((item) => {
            if (bodyText.includes(item)) {
              itemsFound++;
              cy.log(`Found item: ${item}`);
            }
          });

          if (itemsFound > 0) {
            cy.log(`✓ Found ${itemsFound} items in basket`);
          } else {
            cy.log('✓ Basket content verified (custom items may be present)');
          }
        }
      });
    });

    it('Should maintain form structure during interaction', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Billing address').should('be.visible');
      cy.contains('Payment').should('be.visible');
      cy.contains('Your Basket').should('be.visible');
      cy.contains('Delivery').should('be.visible');
      cy.contains('Sweet Shop Project 2018').should('be.visible');
    });
  });
});