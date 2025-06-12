import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here (place for cy tasks)
      // all native node code needs to go here to avoid circular dependency issues
      // https://docs.cypress.io/api/node-events/overview
    },
    baseUrl: 'https://www.google.com',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    chromeWebSecurity: false,
    defaultCommandTimeout: 2000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: true,
    video: true,
    videoCompression: 32,
    trashAssetsBeforeRuns: true,
    pageLoadTimeout: 5000,
    experimentalMemoryManagement: true,
  },
})
