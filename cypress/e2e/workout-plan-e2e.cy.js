/// <reference types="cypress" />

describe('Workout Plan Page (End-to-End)', () => {

  it('should load the default plan, then allow selecting and rendering a new plan with REAL data', () => {
    
    // --- SETUP: Log in and visit the page ---
    cy.visit('http://localhost:3000/');
    cy.login();
    cy.visit('http://localhost:3000/display-workout'); // Assuming this is the URL

    // --- STAGE 1: VERIFY THE DEFAULT PLAN LOADS CORRECTLY ---
    
    // Wait for the initial page to be stable by asserting the default plan's name appears.
    // The timeout gives the real API call plenty of time to complete.
    cy.get('h2', { timeout: 10000 }).should('contain.text', 'Gentle Start');

    // Perform other checks to confirm the default state using real data
    cy.contains('beginner').should('be.visible');
    cy.contains('Sun Salutation A').should('be.visible');
    cy.get('select#plan-select').should('have.value', 'gentle_start');


    // --- STAGE 2: INTERACT WITH THE PAGE AND VERIFY THE UPDATE ---

    // Now that the page is stable, we can safely select a new option.
    cy.get('select#plan-select').select('foundation_strength');

    // Assert that the page updates correctly after the new selection.
    // The timeout on this assertion acts as our wait for the second API call.
    cy.get('h2', { timeout: 10000 }).should('contain.text', 'Foundation Strength');

    // Verify the new content from your real database
    cy.contains('intermediate').should('be.visible');
    cy.contains('Goblet Squat (or Back Squat)').should('be.visible');

    // A crucial final check: ensure the old content is gone
    cy.get('h4').contains('Full Body Mobility').should('not.exist');
  });
});