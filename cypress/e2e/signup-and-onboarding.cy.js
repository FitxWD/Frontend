/// <reference types="cypress" />

describe('User Signup and Onboarding Flow', () => {

  // We only have one big test in this file that covers the whole journey.
  it('should allow a user to sign up, enter health data, and be redirected to the dashboard', () => {
    // --- STEP 1: VISIT THE SIGNUP PAGE ---
    cy.visit('http://localhost:3000/signup');

    // --- STEP 2: CREATE AN USER ---
    // Fill out the signup form with our new user's details.
    cy.get('input#fullname').type('Real Test User');
    cy.get('input#email').type(`cypress.test@example.com`);
    cy.get('input#password').type('123456');
    
    // Submit the signup form.
    cy.get('button[type="submit"]').contains('Create My Free Account').click();

    // --- STEP 3: VERIFY REDIRECT TO HEALTH DATA PAGE ---
    // We increase the timeout because the signup process can be slow.
    cy.url({ timeout: 10000 }).should('include', '/health-data');
    cy.get('h1').should('contain.text', 'Tell Us About You'); // Confirm we are on the right page.

    // --- STEP 4: FILL OUT THE HEALTH DATA FORM ---
    // Now that we are on the health data page, we fill out the new form.
    cy.get('select#gender').select('Male'); // You can select by value ('male') or text ('Male')
    cy.get('input#age').type('30');
    cy.get('input#height').type('180');
    cy.get('input#weight').type('75');
    
    // We will let this request go to your REAL backend API (http://127.0.0.1:8000/...).
    // Make sure that backend server is running when you run this test.
    cy.get('button[type="submit"]').contains('Save & Continue').click();

    // --- STEP 5: VERIFY FINAL REDIRECT TO DASHBOARD ---
    // After submitting the health data, we expect to land on the dashboard.
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    
    // As a final check, you can look for an element that ONLY exists on the dashboard.
    // For example:
    // cy.get('h1').should('contain.text', 'Your Dashboard'); 
  });
});