describe("the SC examples page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Private", { world: "Handwavia" });
    cy.createExampleWorldWithApi("Examples");
    cy.createLanguageWithApi("Example 1", { world: "Examples" });
    cy.createEvolutionWithApi("Example 1", {
      soundChanges: "foo:\n  o => a",
      testWords: ["foo", "bar"],
    });
    cy.createLanguageWithApi("Example 2", { world: "Examples" });
    cy.createEvolutionWithApi("Example 2", {
      soundChanges: "boo:\n  a => o",
      testWords: ["foo", "bar"],
    });
    cy.logout();
  });

  it("is a sound changes page with a dropdown to choose the language", () => {
    cy.goToScExamples();
    cy.contains("Sound Changes");
    cy.get("#chooseExample").click();
    cy.contains("Example 1");
    cy.contains("Handwavia").should("not.exist");
    cy.contains("Example 2").click();
    cy.contains("a => o");
  });
});

export {};
