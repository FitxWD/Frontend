/// <reference types="cypress" />

describe('Login Page', () => {
  // Before each test, we visit the login page to ensure a clean state.
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  // Test suite for the main success path.
  context('Successful Login (End-to-End)', () => {
    it('should allow a real user to log in and be redirected to the dashboard', () => {
      // Retrieve the credentials from cypress.env.json
      const email = 'cypress.test@gmail.com';
      const password = '123456';

      // A safety check to make sure the credentials are set
      if (!email || !password) {
        throw new Error('Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in cypress.env.json');
      }
      
      // We are NOT using cy.intercept() here.

      cy.get('input#email').type(email);
      cy.get('input#password').type(password);
      cy.get('button[type="submit"]').click();

      // Assert that the redirect happens. We give it a longer timeout
      // because real network requests can be slower than mocks.
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });
  });

  // Test suite for validation and error scenarios.
  context('Validation and Error Handling', () => {
    it('should show an error message for invalid credentials', () => {
      // Intercept the request and simulate an "invalid credential" error from Firebase.
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword**', {
        statusCode: 400,
        body: {
          error: {
            code: 400,
            message: 'INVALID_LOGIN_CREDENTIALS', // A common Firebase error message for this case
          },
        },
      }).as('invalidLogin');

      cy.get('input#email').type('user@example.com');
      cy.get('input#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      // Assert that the correct error message is displayed on the page.
      cy.get('p.text-red-400').should('be.visible').and('contain.text', 'Invalid email or password.');
      
      // Also assert that we did NOT get redirected.
      cy.url().should('not.include', '/dashboard');
    });

    it('should not submit the form if required fields are empty', () => {
      // The inputs have the `required` attribute, so the browser will block submission.
      cy.get('button[type="submit"]').click();

      // Assert that we are still on the login page.
      cy.url().should('include', '/login');

      // We can also check that the browser's native validation has marked the field as invalid.
      cy.get('input#email:invalid').should('have.length', 1);
    });
  });

  // Test suite for other UI elements and navigation links.
  context('UI and Navigation', () => {
    it('should display the main heading and other page elements', () => {
      cy.get('h1').should('contain.text', 'Welcome Back');
      cy.get('img[alt="AI-generated fitness image"]').should('be.visible');
    });

    it('should navigate to the signup page when the "Sign Up" link is clicked', () => {
      cy.contains('Sign Up').click();
      cy.url().should('include', '/signup');
    });

    it('should navigate to the reset password page when the "Forgot password?" link is clicked', () => {
      cy.contains('Forgot password?').click();
      cy.url().should('include', '/reset-password');
    });
  });
});