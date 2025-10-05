/// <reference types="cypress" />
declare global {
  namespace Cypress {
    // This interface adds the new 'login' command to the `cy` object.
    interface Chainable {
      /**
       * Custom command to programmatically log in a user.
       * @example cy.login()
       */
      login(): Chainable<void>;
    }
  }

  // This interface tells TypeScript about the new function we're adding to the window object.
  interface Window {
    cypressLogin: (email: string, password: string) => Promise<any>; // You can replace 'any' with the actual Firebase UserCredential type if you have it.
  }
}

Cypress.Commands.add('login', () => {
  // Retrieve the credentials securely from cypress.env.json
  const email = 'cypress.test@example.com';
  const password = '123456';

  // A safety check
  if (!email || !password) {
    throw new Error('Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in cypress.env.json');
  }

  // Use cy.invoke() to call the custom function we attached to the window.
  // cy.invoke() will automatically wait for the promise returned by the function to resolve.
  cy.window().invoke('cypressLogin', email, password);
});

// This line is essential to make this file a module and allow global declarations.
export {};