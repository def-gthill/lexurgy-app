describe("the glitch link", () => {
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
    cy.createConstruction({
      name: "Noun Phrase",
      children: ["Det", "Noun", "Modifier"],
    });
  });

  it("doesn't show the glitch indicator in a pristine language", () => {
    cy.goToLanguage("Examplish");
    cy.contains("Main");
    cy.contains("Glitch").should("not.exist");
  });

  it("indicates glitches if the user creates a translation with non-existent words", () => {
    cy.goToLanguage("Examplish");
    cy.createTranslation({
      structure: {
        construction: "Intransitive Clause",
        children: [
          ["Subject", "sha"],
          ["Verb", "dor"],
        ],
      },
      translation: "The cat is sleeping",
    });
    cy.contains("2 Glitches").click();
    cy.contains("non-existent lexeme");
    cy.contains("Sha dor");
    cy.contains("The cat is sleeping");
    cy.contains("Add Lexeme");
    cy.contains("Delete Translation");
  });

  it("doesn't show the glitch indicator if the user creates a translation with real words", () => {
    cy.goToLanguage("Examplish");
    cy.clickNavigationLink("Lexicon");
    cy.createLexeme({
      romanized: "sha",
    });
    cy.createLexeme({
      romanized: "dor",
    });
    cy.clickNavigationLink("Main");
    cy.createTranslation({
      structure: {
        construction: "Intransitive Clause",
        children: [
          ["Subject", "sha"],
          ["Verb", "dor"],
        ],
      },
      translation: "The cat is sleeping",
    });
    cy.intercept("/api/glitches*").as("getGlitches");
    cy.wait("@getGlitches");
    cy.contains("Glitch").should("not.exist");
  });
});

export {};
