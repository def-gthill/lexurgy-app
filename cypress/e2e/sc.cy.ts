describe("a sound changer page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createLanguageWithApi("Examplish");
    cy.goToHome();
    cy.navigateToLanguage("Examplish");
    cy.clickNavigationLink("Evolution");
  });

  it("displays the language name and page type", () => {
    cy.tabTitleIs("Lexurgy - Examplish Evolution");
    cy.pageTitleIs("Examplish Evolution");
  });

  it("lets the user enter sound changes and run them on test words", () => {
    cy.runSc({
      inputWords: ["foo", "bar"],
      changes: "my-rule:\n o => a",
    });
    cy.scOutputWordsAre(["faa", "bar"]);
  });

  it("persists the sound changes and test words", () => {
    cy.scEnterSoundChanges("my-rule:\n o => a");
    cy.scEnterInputWords(["foo", "bar"]);
    cy.waitForApiResult("/api/evolutions*", "postEvolution");
    cy.reload();
    cy.startSc();
    cy.scOutputWordsAre(["faa", "bar"]);
  });
});
