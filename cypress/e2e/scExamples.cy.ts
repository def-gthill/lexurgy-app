describe("the SC examples page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Private", { world: "Handwavia" });
    cy.createExampleWorldWithApi("Examples");
    cy.createLanguageWithApi("Example 1", { world: "Examples" });
    cy.createLanguageWithApi("Example 2", { world: "Examples" });
    cy.logout();
  });

  it("provides links for all the tutorial languages", () => {
    cy.goToScExamples();
    cy.contains("Example 1");
    cy.contains("Example 2");
    cy.contains("Handwavia").should("not.exist");
  });
});
