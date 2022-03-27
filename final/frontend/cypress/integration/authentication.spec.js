describe("Authentication", () => {
  it('does not allow accessing lobby if not logged in', () => {
    cy.visit('/lobby');
    cy.get('h1').contains('401');
  });
  it('does not allow accessing profile if not logged in', () => {
    cy.visit('/profile');
    cy.get('h1').contains('401');
  });
  it('does not allow accessing requests if not logged in', () => {
    cy.visit('/requests');
    cy.get('h1').contains('401');
  });
  it('does not allow accessing friends if not logged in', () => {
    cy.visit('/friends');
    cy.get('h1').contains('401');
  });
  it("should allow login", () => {
    cy.visit("/login");

    cy.get("input[name=username]").type("irfan");
    cy.get("input[name=password]").type("adminadmin");
    cy.get("button[type=submit]").click();

    // url should redirect to home page
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
