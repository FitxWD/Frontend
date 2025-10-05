/// <reference types="cypress" />

describe('Diet Plan Display Page (End-to-End)', () => {

  // We will now create a single, comprehensive test case for the user's journey.
  it('should load the default plan, then allow selecting and rendering a new plan', () => {
    
    // --- SETUP: Log in and visit the page ---
    cy.visit('http://localhost:3000/');
    cy.login();
    cy.visit('http://localhost:3000/display-dietPlan');

    
    // --- STAGE 1: VERIFY THE DEFAULT PLAN LOADS CORRECTLY ---
    
    // We will wait for the initial page to be stable by asserting its content.
    // The timeout gives the real API call plenty of time to complete.
    cy.get('h2', { timeout: 10000 }).should('contain.text', 'Balanced 1700');

    // Perform other checks to confirm the default state
    cy.contains('1 cup cooked oats').should('be.visible');
    cy.get('h4').should('contain.text', 'Breakfast');
    cy.get('select#plan-select').should('have.value', 'Balanced_1700');


    // --- STAGE 2: INTERACT WITH THE PAGE AND VERIFY THE UPDATE ---

    // Now that the page is stable, we can safely interact with it.
    // This command will now reliably find the <select> element.
    cy.get('select#plan-select').select('Low_Carb_2100');

    // Assert that the page updates correctly after the new selection.
    // The timeout on this assertion acts as our wait for the second API call.
    cy.get('h2', { timeout: 10000 }).should('contain.text', 'Low Carb 2100');

    // Verify the new content from your real database
    cy.contains('2.5 eggs').should('be.visible');
    cy.contains('1.2 cup bell peppers').should('be.visible');
    cy.get('h4').should('contain.text', 'Breakfast');
  });
});