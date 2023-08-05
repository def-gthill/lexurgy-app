describe("a language page", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.goToHome();
    cy.createLanguage("Examplish");
    cy.navigateToLanguage("Examplish");
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
