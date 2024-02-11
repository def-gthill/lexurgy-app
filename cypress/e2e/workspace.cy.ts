describe("the workspace page", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.goToHome();
    cy.createLanguage("Examplish");
  });

  it("provides links to go to each language", () => {
    cy.navigateToLanguage("Examplish");
    cy.title().should("contain", "Examplish");
  });

  it("lets the user create a language", () => {
    cy.createLanguage("Acmese");
    cy.contains("Acmese").parents(".card").next().contains("Examplish");
    cy.reload();
    cy.contains("Acmese").parents(".card").next().contains("Examplish");
  });

  it("lets the user rename a language", () => {
    cy.contains("Edit").click();
    cy.get("#name").clear().type("Examplian");
    cy.contains("Save").click();
    cy.contains("Examplian");
    cy.contains("Examplish").should("not.exist");
  });

  it("lets the user delete a language", () => {
    cy.contains("Delete").click();
    cy.get("#confirm").type("Examplish");
    cy.get(".AlertDialogContent").contains("Delete").click();
    cy.get(".card").should("not.exist");
  });

  it("lets the user add a world", () => {
    cy.createWorld("Handwavia", "Home of Betamax Crinkledash");
    cy.navigateToWorld("Handwavia");
    cy.contains("Loading world");
    cy.pageTitleIs("Handwavia");
    cy.contains("Home of Betamax Crinkledash");
  });

  it("doesn't list languages in worlds", () => {
    cy.createWorldWithApi("Handwavia", "Home of Betamax Crinkledash");
    cy.createLanguageWithApi("Unwantese", { world: "Handwavia" });
    cy.reload();
    cy.waitForApiResult("/api/languages*", "getLanguages");
    cy.contains("Unwantese").should("not.exist");
  });

  it("lets the user move an existing language into a world", () => {
    cy.createWorld("Handwavia", "Home of Betamax Crinkledash");
    cy.contains("Move").click();
    cy.get("#to-world").select("Handwavia");
    cy.contains("Save").click();
    cy.navigateToWorld("Handwavia");
    cy.contains("Home of Betamax Crinkledash");
    cy.contains("Examplish");
  });

  it("lets the admin user mark a world as an example world", () => {
    cy.createWorldWithApi("Handwavia", "Home of Betamax Crinkledash");
    cy.createLanguageWithApi("Worldish", { world: "Handwavia" });
    cy.createEvolutionWithApi("Worldish", {
      soundChanges: "foo:\n  o => a",
      testWords: ["foo", "bar"],
    });
    cy.goToHome();
    cy.get("#example").click();
    cy.waitForApiResult("/api/worlds", "worlds");
    cy.goToScExamples();
    cy.contains("Worldish");
  });

  it("doesn't let any other user mark a world as an example world", () => {
    cy.logout();
    cy.login("second");
    cy.goToHome();
    cy.createWorld("Handwavia", "Home of Betamax Crinkledash");
    cy.contains("Edit");
    cy.contains("Example").should("not.exist");
  });
});

export {};
