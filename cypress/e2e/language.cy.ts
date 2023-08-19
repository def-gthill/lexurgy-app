describe("a language page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createLanguageWithApi("Examplish");
    cy.goToLanguage("Examplish");
  });

  it("displays the language name", () => {
    cy.tabTitleIs("Lexurgy - Examplish");
    cy.pageTitleIs("Examplish");
  });

  it("has a link to the lexicon page", () => {
    cy.clickNavigationLink("Lexicon");
    cy.tabTitleIs("Lexurgy - Examplish Lexicon");
    cy.pageTitleIs("Examplish Lexicon");
  });

  it("has a link to the syntax page", () => {
    cy.clickNavigationLink("Syntax");
    cy.tabTitleIs("Lexurgy - Examplish Syntax");
    cy.pageTitleIs("Examplish Syntax");
  });
});

export {};
