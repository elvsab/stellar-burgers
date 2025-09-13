/// <reference types="cypress" />

const API_URL =
  Cypress.env('BURGER_API_URL') || 'https://norma.nomoreparties.space/api';

describe('Burger app core flows', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', `${API_URL}/auth/user`, {
      statusCode: 401,
      body: { success: false, message: 'Unauthorized' }
    }).as('getUser');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('adds ingredient to constructor from list', () => {
    // Click first bun "Добавить"
    cy.contains(
      '[data-test="ingredient-card"]',
      'Краторная булка N-200i'
    ).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Top and bottom bun placeholders should be filled
    cy.contains('Выберите булки').should('not.exist');
  });

  it('opens ingredient modal and shows correct data, then closes', () => {
    // Open modal by clicking ingredient link
    cy.contains(
      '[data-test="ingredient-card"] a',
      'Краторная булка N-200i'
    ).click();

    cy.wait('@getIngredients');

    // Works whether opened as modal or full page
    cy.contains('h3', 'Краторная булка N-200i', { timeout: 10000 }).should(
      'exist'
    );
    // Try to close via close icon button if present, fallback to back
    cy.location('pathname').then((path) => {
      if (path.includes('/ingredients/')) {
        const hasClose = Cypress.$('[data-cy="close-modal"]').length > 0;
        if (hasClose) {
          cy.get('[data-cy="close-modal"]').click({ force: true });
          cy.location('pathname').should('eq', '/');
        } else {
          cy.go('back');
          cy.location('pathname').should('eq', '/');
        }
      }
    });
  });

  it('creates order and clears constructor', () => {
    // Prepare auth and intercepts then visit
    cy.setAuthTokens();
    cy.intercept('GET', `${API_URL}/auth/user`, {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'Tester', email: 'test@example.com' }
      }
    }).as('getUserAuthed');
    cy.intercept('POST', `${API_URL}/orders`, { fixture: 'order.json' }).as(
      'postOrder'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUserAuthed');

    // Add bun and main
    cy.contains(
      '[data-test="ingredient-card"]',
      'Краторная булка N-200i'
    ).within(() => {
      cy.contains('button', 'Добавить').click();
    });
    cy.contains(
      '[data-test="ingredient-card"]',
      'Мясо бессмертных моллюсков Protostomia'
    ).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Click checkout button
    cy.get('[data-testid="checkout-button"]').click();

    cy.wait('@postOrder');

    // Modal with order number
    cy.get('[data-cy="modal"]').within(() => {
      cy.get('h2')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.match(/\d{5}/);
        });
    });

    // Close order modal
    cy.get('[data-cy="close-modal"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');

    // Constructor is cleared
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains('Выберите булки', { timeout: 5000 }).should('exist');
      cy.contains('Выберите начинку', { timeout: 5000 }).should('exist');
    });

    // Clear tokens after test
    cy.clearAuthTokens();
  });
});
