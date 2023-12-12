// Testing that experimental features aren't visible
// to general users.
// When a feature stops being experimental, change the
// corresponding test to assert that the feature is
// now visible.
describe("feature hiding", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("random");
    cy.createLanguageWithApi("Examplish");
    cy.goToHome();
    cy.navigateToLanguage("Examplish");
  });

  it("gives general users the Evolution page as a language's main page", () => {
    cy.tabTitleIs("Lexurgy - Examplish Evolution");
    cy.pageTitleIs("Examplish Evolution");
  });
});
