/// <reference types="cypress" />

describe('Health Data Page - UI and Validation', () => {

  // Before each test in this file, we visit the health data page.
  // NOTE: This assumes your app allows visiting this page directly.
  // In a real-world scenario with strict auth, you might need a custom
  // command like `cy.login()` here to set a session before visiting.
  // We now run our custom login command before each test in this file.
  beforeEach(() => {

    cy.visit('http://localhost:3000/');
    // 1. Programmatically log in the user.
    cy.login();

    // 2. NOW visit the page. Because we are logged in, the redirect won't happen.
    cy.visit('http://localhost:3000/health-data');
  });

  // --- Test Suite 1: UI and Initial State ---
  context('UI and Initial State', () => {
    it('should display all form elements correctly on page load', () => {
      // Check for the main heading
      cy.get('h1').should('contain.text', 'Tell Us About You');

      // Check that all input fields are visible
      cy.get('select#gender').should('be.visible');
      cy.get('input#age').should('be.visible');
      cy.get('input#height').should('be.visible');
      cy.get('input#weight').should('be.visible');

      // Check that the submit button is visible and has the correct text
      cy.get('button[type="submit"]').should('contain.text', 'Save & Continue');
    });

    it('should have empty fields and a default dropdown value initially', () => {
      // The gender dropdown should have its placeholder selected (which has a value of "")
      cy.get('select#gender').should('have.value', null);

      // All other inputs should be empty
      cy.get('input#age').should('have.value', '');
      cy.get('input#height').should('have.value', '');
      cy.get('input#weight').should('have.value', '');
    });
  });


  // --- Test Suite 2: Form Validation and Error Handling ---
  context('Form Validation and Error Handling', () => {
    it('should prevent form submission if a required field is empty', () => {
      // Fill out all fields EXCEPT for the gender dropdown
      cy.get('input#age').type('30');
      cy.get('input#height').type('180');
      cy.get('input#weight').type('75');

      // Click the submit button
      cy.get('button[type="submit"]').click();

      // Assert that we have NOT been redirected (the URL is unchanged)
      cy.url().should('include', '/health-data');

      // Assert that the browser's native validation has marked the gender select as invalid
      cy.get('select#gender:invalid').should('have.length', 1);
    });

    it('should display a specific error message from the server on a 400 Bad Request', () => {
      // Intercept the API call and return a custom 400 error.
      // This simulates your backend rejecting the data for a specific reason.
      cy.intercept('POST', '**/api/v1/profile-health-update', {
        statusCode: 400,
        body: { message: 'Validation Error: Age cannot be less than 18.' }
      }).as('badRequest');

      // Fill out the form with data that would trigger this backend validation
      cy.get('select#gender').select('Female');
      cy.get('input#age').type('15'); // This age is too low
      cy.get('input#height').type('165');
      cy.get('input#weight').type('55');

      cy.get('button[type="submit"]').click();
      cy.wait('@badRequest');

      // Assert that the specific error message from the API is shown to the user
      cy.get('p.text-red-400')
        .should('be.visible')
        .and('contain.text', 'Validation Error: Age cannot be less than 18.');
    });

    it('should display a generic error message if the server crashes (500 error)', () => {
      // Intercept the API call and return a 500 Internal Server Error.
      cy.intercept('POST', '**/api/v1/profile-health-update', {
        statusCode: 500
      }).as('serverError');

      // Fill out the form with valid data
      cy.get('select#gender').select('Other');
      cy.get('input#age').type('40');
      cy.get('input#height').type('175');
      cy.get('input#weight').type('85');

      cy.get('button[type="submit"]').click();
      cy.wait('@serverError');

      // From your component's code, we know the generic error message to look for.
      cy.get('p.text-red-400')
        .should('be.visible')
        .and('contain.text', 'Failed to execute \'json\' on \'Response\': Unexpected end of JSON input');
    });

    it('should disable the button and show loading text during submission', () => {
      // Intercept the API call and add a delay to simulate a slow network
      cy.intercept('POST', '**/api/v1/profile-health-update', {
        delay: 500, // wait 0.5 seconds before responding
        statusCode: 200,
        body: {}
      }).as('slowRequest');

      // Fill out the form
      cy.get('select#gender').select('Male');
      cy.get('input#age').type('28');
      cy.get('input#height').type('190');
      cy.get('input#weight').type('90');

      // Click the submit button
      cy.get('button[type="submit"]').click();

      // IMMEDIATELY assert that the button is in its loading state
      cy.get('button[type="submit"]')
        .should('be.disabled')
        .and('contain.text', 'Saving Profile...');

      // Wait for the slow request to complete, then assert the redirect
      cy.wait('@slowRequest');
      cy.url().should('include', '/dashboard');
    });
  });
});