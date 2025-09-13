/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// Fake auth helpers for tests that require logged-in state
Cypress.Commands.add('setAuthTokens', () => {
  window.localStorage.setItem('refreshToken', 'test-refresh-token');
  // Access token cookie is read by app via getCookie('accessToken')
  cy.setCookie('accessToken', 'Bearer test-access-token');
});

Cypress.Commands.add('clearAuthTokens', () => {
  window.localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});
