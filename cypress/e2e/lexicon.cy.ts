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
    cy.contains("Add Entry").click();
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
});

export {};
