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

  it("goes to a specific example if given an id query parameter", () => {
    cy.goToScExamples("Example 2");
    cy.contains("a => o", { timeout: 10000 });
  });

  it("replaces the URL with the example-specific URL if none specified", () => {
    cy.goToScExamples();
    cy.scExampleUrlHas("Example 1");
  });

  it("replaces the URL with the example-specific URL if it's invalid", () => {
    cy.visit("/sc/examples?id=nonsense");
    cy.scExampleUrlHas("Example 1");
  });

  it("replaces the URL with the example-specific URL when switching examples", () => {
    cy.goToScExamples();
    cy.get("#chooseExample").click();
    cy.contains("Example 2").click();
    cy.scExampleUrlHas("Example 2");
  });
});

export {};
