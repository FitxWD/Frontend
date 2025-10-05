/// <reference types="cypress" />

describe('Wellness Assistance App Landing Page', () => {
  // Before each test, we visit the landing page to ensure a clean state.
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  // Test suite for the main "Hero" section (the first thing users see).
  context('Hero Section', () => {
    it('should display the main heading, subheading, and CTA button', () => {
      // Check for the main heading text. 
      // We use `cy.contains()` which is great for finding elements by their text content.
      cy.get('h1').contains('Your Personal AI Fitness Coach is Here.');

      // Check for the paragraph text under the heading.
      cy.get('p').contains("Tired of generic plans that don't fit your life?");

      // Find the main call-to-action button, check its text, and ensure it's visible.
      cy.get('button').contains('Start My Journey').should('be.visible');
    });

    it('should display the hero image', () => {
      // Best practice for selecting images is by their 'alt' text.
      // This checks that the image is loaded and visible on the page.
      cy.get('img[alt="Woman doing a plank exercise at home"]').should('be.visible');
    });

    it('should navigate to the signup page when "Start My Journey" is clicked', () => {
      // Find the button by its text and click it.
      cy.contains('Start My Journey').click();

      // After clicking, we assert that the URL has changed to '/signup'.
      // `cy.url()` gets the current URL, and `.should('include', ...)` checks if it contains the string.
      cy.url().should('include', '/signup');
    });
  });

  // Test suite for verifying the content of different sections on the page.
  context('Content Sections', () => {
    it('should display the "Journey Steps" section with three steps', () => {
      // Cypress automatically scrolls to elements, so we don't need to manually scroll.
      cy.contains('Get Started in Minutes').scrollIntoView().should('be.visible');

      // Check for the heading of each step card.
      cy.contains('1. Chat About Your Goals').should('be.visible');
      cy.contains('2. Receive Your Custom Plan').should('be.visible');
      cy.contains('3. Adapt As You Go').should('be.visible');
    });

    it('should display the "Plan Features" section', () => {
      cy.contains('Designed for Real Life, Not Robots').scrollIntoView().should('be.visible');
      
      // Check for the list items (features).
      cy.contains('Intuitive chat-based setup').should('be.visible');
      cy.contains('Adapts to your schedule and tastes').should('be.visible');
      cy.contains('Grounded in proven fitness principles').should('be.visible');
    });

    it('should display the "Testimonials" section', () => {
      cy.contains('Don\'t Just Take Our Word For It').scrollIntoView().should('be.visible');

      // We can check if the testimonial cards exist by looking for the user names.
      cy.contains('Akila').should('be.visible');
      cy.contains('Sara').should('be.visible');
      cy.contains('Anna').should('be.visible');
    });

    it('should display the final Call-to-Action section', () => {
      cy.contains('Ready to Change Your Life?').scrollIntoView().should('be.visible');

      // Check that the final CTA button is visible.
      cy.contains('Create My Free Plan Now').should('be.visible');
    });
  });

  // Test suite for checking navigation from all CTA buttons on the page.
  context('Navigation', () => {
    it('should navigate to signup from the "Plan Features" section button', () => {
      cy.contains('Get My Smart Plan').click();
      cy.url().should('include', '/signup');
    });

    it('should navigate to signup from the final CTA section button', () => {
      cy.contains('Create My Free Plan Now').click();
      cy.url().should('include', '/signup');
    });
  });

  // Test suite for responsiveness. We simulate a mobile device viewport.
  context('Responsiveness', () => {
    it('should display correctly on a mobile device', () => {
      // Use `cy.viewport()` to change the screen size to match an iPhone X.
      cy.viewport('iphone-x');

      // Check if the main heading is still visible on mobile.
      cy.get('h1').contains('Your Personal AI Fitness Coach is Here.').should('be.visible');

      // The button text should still be there.
      cy.contains('Start My Journey').should('be.visible');

      // Often, a hamburger menu button appears on mobile. If your Navbar component
      // has one, you could add a test for it here. For example:
      // cy.get('.mobile-menu-button').should('be.visible');
    });
  });

  // Test suite for the Navbar and Footer components.
  // No need to provide the component code; we can test for their presence.
  context('Header and Footer', () => {
    it('should display the Navbar and Footer on the page', () => {
      // We assume your Navbar is within a <nav> HTML5 element.
      cy.get('nav').should('be.visible');

      // We assume your Footer is within a <footer> HTML5 element.
      // We scroll to the bottom to ensure it's in view.
      cy.get('footer').scrollIntoView().should('be.visible');
    });
  });
});