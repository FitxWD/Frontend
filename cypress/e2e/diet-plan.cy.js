/// <reference types="cypress" />

describe('Diet Plan Display Page', () => {

  // Before each test, we log in and set up a default intercept
  // for the initial plan that loads on the page.
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.login();

    // Intercept the default plan request and respond with our mock data
    cy.intercept(
      'GET',
      '**/api/v1/diet-plan/Balanced_1700',
      { fixture: 'diet_balanced_1700.json' }
    ).as('getBalancedPlan');

    cy.visit('http://localhost:3000/display-dietPlan');

    cy.wait('@getBalancedPlan');
  });

  context('Initial Page Load and Rendering', () => {
    it('should load the default diet plan ("Balanced 1700") correctly', () => {
      // Assert that the dropdown is set to the correct default value
      cy.get('select#plan-select').should('have.value', 'Balanced_1700');

      // Assert that the main heading reflects the loaded plan
      cy.get('h2').should('contain.text', 'Balanced 1700');

      // Assert that specific details from the fixture are rendered
      cy.contains('130g Protein').should('be.visible');
      cy.contains('A well-rounded plan').should('be.visible');

      // Assert that a specific meal from the plan is visible
      cy.get('h4').should('contain.text', 'Oatmeal with Berries');
    });

    it('should display the day tabs correctly', () => {
      cy.contains('button', 'Day 1').should('have.class', 'text-green-400');
      cy.contains('button', 'Day 2').should('not.have.class', 'text-green-400');
      cy.contains('button', 'Day 3').should('not.have.class', 'text-green-400');
    });
  });

  context('User Interactions and Dynamic Rendering', () => {
    it('should fetch and render a new diet plan when selected from the dropdown', () => {
      // Set up a NEW intercept for the plan we are about to select
      cy.intercept(
        'GET',
        '**/api/v1/diet-plan/Low_Carb_2100',
        { fixture: 'diet_low_carb_2100.json' }
      ).as('getLowCarbPlan');

      // --- USER ACTION ---
      // Select the "Low Carb - 2100 kcal" option from the dropdown
      cy.get('select#plan-select').select('Low_Carb_2100');

      // Wait for the new network request to complete
      cy.wait('@getLowCarbPlan');

      // --- ASSERTIONS FOR NEW PLAN ---
      // Assert the heading has changed
      cy.get('h2').should('contain.text', 'Low Carb 2100');

      // Assert that new details from the second fixture are rendered
      cy.contains('200g Protein').should('be.visible');
      cy.contains('Focuses on high protein').should('be.visible');

      // Assert a meal from the new plan is visible
      cy.get('h4').should('contain.text', 'Avocado Egg Bake');

      // Assert the old meal is GONE
      cy.get('h4').contains('Oatmeal with Berries').should('not.exist');
    });

    it('should show the loading skeleton while fetching a new plan', () => {
      // Intercept with a delay to make the loading state visible
      cy.intercept(
        'GET',
        '**/api/v1/diet-plan/Low_Carb_2100',
        { fixture: 'diet_low_carb_2100.json', delay: 500 }
      ).as('getSlowPlan');

      // Select the new plan
      cy.get('select#plan-select').select('Low_Carb_2100');

      // IMMEDIATELY check that the skeleton loader is visible
      cy.get('.animate-pulse').should('be.visible');

      // Wait for the request to finish
      cy.wait('@getSlowPlan');

      // Assert that the skeleton is now GONE
      cy.get('.animate-pulse').should('not.exist');
    });

    it('should show a friendly error message if the API fails to fetch a plan', () => {
      // Intercept the request and force a server error
      cy.intercept(
        'GET',
        '**/api/v1/diet-plan/Low_Sodium_1900',
        { statusCode: 500 }
      ).as('getErrorPlan');

      // Select a plan that will trigger the error
      cy.get('select#plan-select').select('Low_Sodium_1900');

      cy.wait('@getErrorPlan');

      // Assert the error message is now visible
      cy.contains('h3', 'Something went wrong').should('be.visible');
      cy.contains("Failed to fetch 'Low_Sodium_1900'").should('be.visible');
    });
  });
});