import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true, // Display charts in the report
      reportPageTitle: 'Wellness App - UI Test Report', // The title of the HTML report
      embeddedScreenshots: true, // Embed screenshots directly in the report for failed tests
      inlineAssets: true, // All assets (CSS, JS) will be embedded in a single HTML file
      saveAllAttempts: false, // Do not save screenshots for successful test steps
    },
  },
});
