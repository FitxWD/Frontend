/// <reference types="cypress" />

describe('Workout Plan Page - Mocked UI & Validation', () => {

  beforeEach(() => {
    // Use our session-based login for speed
    cy.visit('http://localhost:3000/');
    cy.login();

    // Intercept the default plan request and respond with our mock data
    cy.intercept(
      'GET',
      '**/api/v1/workout-plan/gentle_start',
      { fixture: 'workout_gentle_start.json' }
    ).as('getGentleStart');

    // Now visit the page
    cy.visit('http://localhost:3000/display-workout'); // Assuming this is the URL

    // Wait for the initial data to load before starting any tests
    cy.wait('@getGentleStart');
  });

  context('Initial Page Load and Rendering', () => {
    it('should render all sections of the default plan correctly', () => {
      // Check main header details
      cy.get('h2').should('contain.text', 'Gentle Start');
      cy.contains('Beginner').should('be.visible');
      cy.contains('Full Body Mobility').should('be.visible');

      // Check for the new sections
      cy.contains('h3', 'Quick Workouts').should('be.visible');
      cy.contains('5-Min Morning Stretch').should('be.visible');

      cy.contains('h3', '4-Week Progression Guide').should('be.visible');
      cy.contains('h3', 'Personalization Tips').should('be.visible');
    });
  });

  context('User Interactions', () => {
    it('should fetch and render a new workout plan when selected', () => {
      // Set up a NEW intercept for the plan we are about to select
      cy.intercept(
        'GET',
        '**/api/v1/workout-plan/foundation_strength',
        { fixture: 'workout_foundation_strength.json' }
      ).as('getFoundationStrength');

      // --- USER ACTION ---
      cy.get('select#plan-select').select('foundation_strength');

      // Wait for the new network request to complete
      cy.wait('@getFoundationStrength');

      // --- ASSERTIONS FOR NEW PLAN ---
      cy.get('h2').should('contain.text', 'Foundation Strength');
      cy.contains('Intermediate').should('be.visible');
      cy.contains('Barbell Squats').should('be.visible');
      cy.contains('10-Min Kettlebell Flow').should('be.visible');
    });

    it('should show the loading skeleton while fetching a new plan', () => {
      cy.intercept(
        'GET',
        '**/api/v1/workout-plan/foundation_strength',
        { fixture: 'workout_foundation_strength.json', delay: 500 }
      ).as('getSlowPlan');

      cy.get('select#plan-select').select('foundation_strength');
      cy.get('.animate-pulse').should('be.visible'); // Check for skeleton
      cy.wait('@getSlowPlan');
      cy.get('.animate-pulse').should('not.exist'); // Check it's gone
    });

    it('should show a friendly error message if the API fails', () => {
      cy.intercept(
        'GET',
        '**/api/v1/workout-plan/play_and_perform',
        { statusCode: 500 }
      ).as('getErrorPlan');

      cy.get('select#plan-select').select('play_and_perform');
      cy.wait('@getErrorPlan');
      cy.contains('h3', 'Something went wrong').should('be.visible');
    });
  });
});