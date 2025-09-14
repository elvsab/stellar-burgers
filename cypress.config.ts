import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents() {
      // implement node event listeners here if needed
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
});
