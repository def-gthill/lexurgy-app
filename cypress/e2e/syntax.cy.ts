describe("the construction editor", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.goToHome();
    cy.createLanguage("Examplish");
    cy.navigateToLanguage("Examplish");
    cy.clickNavigationLink("Syntax");
    cy.createConstruction({
      name: "Intransitive Clause",
      children: ["Subject", "Verb"],
    });
  });

  it("displays the language's constructions", () => {
    cy.goToLanguage("Examplish");
    cy.clickNavigationLink("Syntax");
    cy.contains("Intransitive Clause");
    cy.contains("Subject");
    cy.contains("Verb");
  });

  it("lets the user create a construction", () => {
    cy.goToLanguage("Examplish");
    cy.clickNavigationLink("Syntax");
    cy.createConstruction({
      name: "Noun Phrase",
      children: ["Noun", "Modifier"],
    });
    cy.contains("Noun Phrase");
    cy.reload();
    cy.contains("Noun Phrase");
  });
});

export {};
