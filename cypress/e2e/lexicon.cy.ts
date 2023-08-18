describe("a lexicon page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.goToHome();
    cy.createLanguage("Examplish");
    cy.navigateToLanguage("Examplish");
    cy.clickNavigationLink("Lexicon");
  });

  it("displays the language name and page type", () => {
    cy.tabTitleIs("Lexurgy - Examplish Lexicon");
    cy.pageTitleIs("Examplish Lexicon");
  });

  it("lets the user create a lexicon entry", () => {
    cy.createLexeme({
      romanized: "sha",
      pos: "noun",
      definitions: ["cat"],
    });
    cy.contains("sha");
    cy.contains("noun");
    cy.contains("cat");
    cy.reload();
    cy.contains("sha");
    cy.contains("noun");
    cy.contains("cat");
  });

  it("lets the user export a lexicon entry", () => {
    const lexeme = {
      romanized: "sha",
      pos: "noun",
      definitions: ["cat"],
    };
    cy.createLexeme(lexeme);
    cy.exportLexeme("sha");
    cy.previewShowsJsonOf(lexeme);
    cy.contains("Copy");
    cy.contains("Download");
    cy.contains("Done").click();
    cy.contains("Export");
  });

  it("lets the user import a lexicon entry", () => {
    const lexeme = {
      romanized: "sha",
      pos: "noun",
      definitions: ["cat"],
    };
    cy.importLexeme(lexeme);
    cy.contains("sha");
    cy.contains("noun");
    cy.contains("cat");
    cy.reload();
    cy.contains("sha");
    cy.contains("noun");
    cy.contains("cat");
  });
});

export {};
