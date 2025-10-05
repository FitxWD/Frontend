/// <reference types="cypress" />

describe('Signup Page - Validation & UI', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signup');
  });

  context('Validation and Error Handling (Mocked)', () => {
    it('should show an error message for an invalid email', () => {
      // Intercept the API call and return a fake "invalid email" error
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signUp**', {
        statusCode: 400,
        body: { error: { message: 'INVALID_EMAIL' } },
      }).as('invalidEmail');

      cy.get('input#fullname').type('Test User');
      cy.get('input#email').type('invalid-email');
      cy.get('input#password').type('password123');
      cy.get('form').submit(); // Use .submit() to bypass browser validation

      cy.wait('@invalidEmail');
      cy.get('p.text-red-400').should('be.visible').and('contain.text', 'Invalid email address.');
    });

    it('should show an error message for a weak password', () => {
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signUp**', {
        statusCode: 400,
        body: { error: { message: 'WEAK_PASSWORD' } },
      }).as('weakPassword');

      cy.get('input#fullname').type('Test User');
      cy.get('input#email').type('testuser@example.com');
      cy.get('input#password').type('123');
      cy.get('form').submit();

      cy.wait('@weakPassword');
      cy.get('p.text-red-400').should('be.visible').and('contain.text', 'Password is too weak (min 6 chars).');
    });
    
    it('should show an error message if the email is already in use', () => {
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signUp**', {
        statusCode: 400,
        body: { error: { message: 'EMAIL_EXISTS' } },
      }).as('emailExists');

      cy.get('input#fullname').type('Existing User');
      cy.get('input#email').type('existing@example.com');
      cy.get('input#password').type('password123');
      cy.get('form').submit();

      cy.wait('@emailExists');
      cy.get('p.text-red-400').should('be.visible').and('contain.text', 'Email already in use.');
    });

    it('should prevent submission if required fields are empty', () => {
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/signup'); // Should not navigate away
      cy.get('input#fullname:invalid').should('have.length', 1); // Check browser validation
    });
  });

  context('UI and Navigation', () => {
    it('should display the main heading and page elements', () => {
      cy.get('h1').should('contain.text', 'Start Your Journey');
      cy.get('img[alt="Healthy meal preparation"]').should('be.visible');
    });

    it('should navigate to the login page when the "Sign In" link is clicked', () => {
      cy.contains('Sign In').click();
      cy.url().should('include', '/login');
    });
  });
});