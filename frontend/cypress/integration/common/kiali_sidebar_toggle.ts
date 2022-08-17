import { When, Then} from "cypress-cucumber-preprocessor/steps";

function sidebarVisibility(){
  cy.get('#page-sidebar').should('be.visible');
  return;
};

function buttonClick(){
  cy.get('#nav-toggle').click()
  return;
};

Then('user sees the sidebar', () => {
  sidebarVisibility();
});

When('user presses the navigation toggle button', () => {
  buttonClick();
});

Then('user cannot see the sidebar', () => {
  cy.get('#page-sidebar').should('not.be.visible');
});

When('user presses the navigation toggle button again', () => {
  buttonClick();
});

Then('user can see the sidebar again', () => {
  sidebarVisibility();
});
