describe("a settings page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createLanguageWithApi("Examplish");
    cy.goToHome();
    cy.navigateToLanguage("Examplish");
    cy.clickNavigationLink("Settings");
  });

  it("displays the language name and page type", () => {
    cy.tabTitleIs("Lexurgy - Examplish Settings");
    cy.pageTitleIs("Examplish Settings");
  });

  it("Displays the language's owner", () => {
    cy.ownersAre(["default"]);
  });

  it("Lets an owner assign a co-owner", () => {
    cy.ensureUserExists("second");
    cy.addOwner("second");
    cy.ownersAre(["default", "second"]);
    cy.login("second");
    cy.goToHome();
    cy.contains("Examplish");
  });

  it.skip("Lets an owner revoke co-ownership", () => {});
});

export {};
