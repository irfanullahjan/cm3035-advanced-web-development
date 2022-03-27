describe("Navigation", () => {
  const login = () => {
    cy.visit("/login");

    cy.get("input[name=username]").type("irfan");
    cy.get("input[name=password]").type("adminadmin");
    cy.get("button[type=submit]").click();

    // wait for login
    cy.wait(1500);
  }
  it("should navigate to the login page", () => {
    // Start from the index page
    cy.visit("/");

    // Find a link with an href attribute containing "login" and click it
    cy.get('a[href*="/login"]').trigger("click");

    // The new url should include "/login"
    cy.url().should("include", "/login");

    // The new page should contain an h1 with "Login"
    cy.get("h1").contains("Login");
  });

  it("should navigate to the signup page", () => {
    cy.visit("/");

    cy.get('a[href*="/signup"]').trigger("click");

    cy.url().should("include", "/signup");

    cy.get("h1").contains("Signup");
  });

  it("should allow navigation to lobby once logged in", () => {
    login();

    // naviagte to lobby
    cy.visit("/lobby");

    // h1 should contain "Lobby"
    cy.get("h1").contains("Lobby");
  });

  it("should allow navigation to profile once logged in", () => {
    login();

    // naviagte to profile
    cy.visit("/profile");

    // h1 should contain "Profile"
    cy.get("h1").contains("Profile");
  });

  it("should allow navigation to requests once logged in", () => {
    login();

    // naviagte to requests
    cy.visit("/requests");

    // h1 should contain "Requests"
    cy.get("h2").contains("Requests");
  });

  it("should allow navigation to friends once logged in", () => {
    login();

    // naviagte to friends
    cy.visit("/friends");

    // first h1 should contain "Find Friends"
    cy.get("h2").contains("Find Friends");
  });
});
