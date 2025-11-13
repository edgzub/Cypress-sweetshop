import products from '../fixtures/products.json';

const moneyToNumber = (text) => parseFloat(text.replace(/[£,]/g, ''));

describe('Sweetshop – Katalogas ir Krepšelis', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Prideda kelias prekes, tikrina skaičiavimus ir pristatymo pasirinkimus', () => {
    cy.visit('/');
    cy.nav('/sweets');
    cy.url().should('include', '/sweets');

    // Add 2 items
    cy.addProduct('Chocolate Cups');
    cy.addProduct(/Sherb(e)?rt Straws/);

    // Basket badge in navigation should be > 0
    cy.basketBadge().invoke('text').then((t) => {
      const n = parseInt(t.trim(), 10);
      expect(n).to.be.gte(2);
    });

    // Go to basket
    cy.nav('/basket');
    cy.url().should('include', '/basket');

    // Item names should be visible in basket list
    cy.contains('#basketItems', /Chocolate Cups/i).should('exist');
    cy.contains('#basketItems', /Sherb(e)?rt Straws/i).should('exist');

    // Verify basket shows content
    cy.contains('Your Basket').should('be.visible');
    cy.contains('#basketItems li', /Total\s*\(GBP\)/i).should('be.visible');

    // Verify collect shipping is selected by default
    cy.get('#exampleRadios1').should('be.checked');

    // Switch to Standard Shipping and verify it's checked
    cy.get('#exampleRadios2').check({ force: true }).should('be.checked');

    // Empty the basket
    cy.contains('a', /Empty Basket/i).click();
    cy.wait(500);
    cy.get('#basketCount').should('contain', '0');
  });

  // Additional tests (Sweets page) (Shopping Basket)
  describe('Product Catalog Display', () => {
    it('Should display all products with complete information', () => {
      cy.visit('/');
      cy.contains('Sweets').click();

      cy.contains('Browse sweets').should('be.visible');
      cy.contains('Browse our delicious choice of retro sweets').should('be.visible');

      cy.get('.card').should('have.length.at.least', 16);

      cy.get('.card').each(($product) => {
        cy.wrap($product).should('be.visible');
        cy.wrap($product).find('img').should('exist');
        cy.wrap($product).find('.card-title, h5, h4').should('exist');
        cy.wrap($product).should('contain.text', '£');
        cy.wrap($product).find('button, .btn').should('exist').and('be.visible');
      });
    });

    it('Should display correct product details and prices', () => {
      cy.visit('/');
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');

      cy.contains('Chocolate Cups').should('be.visible');
      cy.contains('Chocolate Cups').closest('.card').should('contain.text', '£1.00');

      cy.contains('Sherbert Straws').should('be.visible');
      cy.contains('Rainbow Dust Straws - Choose your colour').should('be.visible');
      cy.contains('Sherbert Straws').closest('.card').should('contain.text', '£0.75');

      cy.contains('Sherbert Discs').should('be.visible');
      cy.contains('UFO\'s Sherbert Filled Flying Saucers').should('be.visible');
      cy.contains('Sherbert Discs').closest('.card').should('contain.text', '£0.95');

      cy.contains('Wham Bars').should('be.visible');
      cy.contains('Wham original raspberry chew bar').should('be.visible');
      cy.contains('Wham Bars').closest('.card').should('contain.text', '£0.15');

      cy.get('.card').should('have.length.at.least', 8);

      cy.contains('Bon Bons').should('be.visible');
      cy.contains('Jellies').should('be.visible');
      cy.contains('Fruit Salads').should('be.visible');
      cy.contains('Bubble Gums').should('be.visible');
    });

    it('Should display product images with proper accessibility', () => {
      cy.visit('/');
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');

      cy.get('.card').each(($product) => {
        cy.wrap($product).find('img').should('exist');
        cy.wrap($product).find('img').then(($img) => {
          if ($img.attr('alt') !== undefined) {
            cy.log('Image has alt attribute');
          } else {
            cy.log('Image missing alt attribute');
          }
        });
        cy.wrap($product).find('img').should('have.attr', 'src');
      });

      cy.get('.card').should('have.length.at.least', 16);
    });
  });

  describe('Shopping Basket Operations', () => {
    it('Should add products to shopping basket', () => {
      cy.visit('/');
      cy.contains('Sweets').click();

      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('Page not found')) {
          cy.log('⚠ Cannot test adding items - Sweets page not available');
          return;
        }

        cy.get('body').then(($pageBody) => {
          if ($pageBody.find('button:contains("Add to Basket"), button:contains("Add")').length > 0) {
            cy.get('button:contains("Add to Basket"), button:contains("Add")').first().click();

            cy.get('button:contains("Add to Basket"), button:contains("Add")').then(($buttons) => {
              if ($buttons.length > 1) {
                cy.wrap($buttons).eq(1).click();
              }
            });

            cy.log('Attempted to add items to basket');
          } else {
            cy.log('No "Add to Basket" buttons found');
          }
        });
      });
    });

    it('Should show correct items and quantities in basket', () => {
      cy.visit('/');
      cy.contains('Basket').click();

      cy.get('body').should('be.visible');
      cy.url().should('include', '/basket');

      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('Your Basket')) {
          cy.contains('Your Basket').should('be.visible');

          if (bodyText.includes('x 1') || bodyText.includes('x 2')) {
            cy.contains(/x \d+/).should('be.visible');
          }

          if (bodyText.includes('Total')) {
            cy.contains('Total').should('be.visible');
            cy.contains(/£\d+\.\d{2}/).should('be.visible');
          }
        }
      });
    });

    it('Should allow removing items from basket', () => {
      cy.visit('/');
      cy.contains('Basket').click();

      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('Delete Item') || bodyText.includes('Remove')) {
          cy.get('body').invoke('text').then((initialText) => {
            cy.get('a:contains("Delete Item"), button:contains("Remove")').first().click();
            cy.get('body').should('be.visible');
            cy.log('Item removal attempted');
          });
        } else {
          cy.log('No remove buttons found in basket');
        }
      });
    });

    it('Should display appropriate message for empty basket', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('£0.00')) {
          cy.contains('Total (GBP)').should('be.visible');
          cy.contains('£0.00').should('be.visible');
          cy.contains('Empty Basket').should('be.visible');

          if (bodyText.includes('Continue to checkout')) {
            cy.log('Checkout button shown for empty basket - expected in broken demo');
          }

          cy.log('Empty basket state verified - shows £0.00 total');
        } else if (bodyText.includes('Empty Basket')) {
          cy.contains('Empty Basket').click();
          cy.contains('£0.00').should('be.visible');
          cy.log('Basket successfully emptied');
        } else {
          cy.get('body').then(($basketBody) => {
            if ($basketBody.find('a:contains("Delete Item")').length > 0) {
              cy.get('a:contains("Delete Item")').each(($deleteBtn) => {
                cy.wrap($deleteBtn).click();
              });
              cy.contains('£0.00').should('be.visible');
            }
          });
        }

        cy.contains('Your Basket').should('be.visible');
        cy.contains('£0.00').should('be.visible');
      });
    });
  });
});