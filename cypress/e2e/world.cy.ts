describe("a world page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createWorldWithApi("Handwavia", "Home of Betamax Crinkledash");
    cy.goToWorld("Handwavia");
    cy.contains("Home of Betamax Crinkledash");
  });

  it("lets the user create a language in the world", () => {
    cy.createLanguage("Examplish");
    cy.contains("Examplish");
    cy.reload();
    cy.contains("Examplish");
  });

  it("only shows languages from this world", () => {
    cy.createLanguageWithApi("Unwantese");
    cy.reload();
    cy.waitForApiResult("/api/languages*", "getLanguages");
    cy.contains("Unwantese").should("not.exist");
  });
});

export {};
