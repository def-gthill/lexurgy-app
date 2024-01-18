describe("the workspace page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.goToHome();
    cy.createLanguage("Examplish");
  });

  it("provides links to go to each language", () => {
    cy.navigateToLanguage("Examplish");
    cy.title().should("contain", "Examplish");
  });

  it("lets the user create a language", () => {
    cy.createLanguage("Acmese");
    cy.contains("Acmese").parents(".card").next().contains("Examplish");
    cy.reload();
    cy.contains("Acmese").parents(".card").next().contains("Examplish");
  });

  it("lets the user rename a language", () => {
    cy.contains("Edit").click();
    cy.get("#name").clear().type("Examplian");
    cy.contains("Save").click();
    cy.contains("Examplian");
    cy.contains("Examplish").should("not.exist");
  });

  it("lets the user delete a language", () => {
    cy.contains("Delete").click();
    cy.get("#confirm").type("Examplish");
    cy.get(".AlertDialogContent").contains("Delete").click();
    cy.get(".card").should("not.exist");
  });

  it("lets the user add a world", () => {
    cy.createWorld("Handwavia", "Home of Betamax Crinkledash");
    cy.navigateToWorld("Handwavia");
    cy.contains("Loading world");
    cy.pageTitleIs("Handwavia");
    cy.contains("Home of Betamax Crinkledash");
  });
});

export {};
