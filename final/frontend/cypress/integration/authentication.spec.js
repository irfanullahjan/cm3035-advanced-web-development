describe("Authentication", () => {
  const login = () => {
    cy.visit("/login");

    cy.get("input[name=username]").type("irfan");
    cy.get("input[name=password]").type("adminadmin");
    cy.get("button[type=submit]").click();

    // wait for login
    cy.wait(1500);
  }
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
    login();

    // url should redirect to home page
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
  it("should allow logout", () => {
    login();

    // click logout link with content "Logout"
    cy.get('a').contains("Logout").click();

    // wait for popup to show
    cy.wait(1000);

    // click yes logout on modal
    cy.get('button').contains('Yes').click();

    // user should see a login link
    cy.get('a').contains("Login");
  });

});
