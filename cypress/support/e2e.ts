import './commands';

// Global beforeEach to clear cookies/localStorage between tests to avoid leakage
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
