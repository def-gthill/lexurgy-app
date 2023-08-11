describe("the construction editor", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

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
