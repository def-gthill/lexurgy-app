import { emptyEvolution } from "../../src/sc/Evolution";

describe("the SC example world endpoint", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createExampleWorldWithApi("Handwavia I", "Home of Betamax Crinkledash");
    cy.createExampleWorldWithApi("Handwavia II", "The Handwavening");
    cy.createLanguageWithApi("Examplish 1", { world: "Handwavia I" });
    cy.createEvolutionWithApi("Examplish 1", emptyEvolution());
    cy.createLanguageWithApi("Examplish 2", { world: "Handwavia I" });
    cy.createEvolutionWithApi("Examplish 2", emptyEvolution());
    cy.createLanguageWithApi("Examplish 3", { world: "Handwavia II" });
    cy.createEvolutionWithApi("Examplish 3", emptyEvolution());
    cy.createLanguageWithApi("Examplish 4", { world: "Handwavia II" });
    cy.createEvolutionWithApi("Examplish 4", emptyEvolution());
  });

  it("retrieves all example worlds", () => {
    cy.request({ url: "/api/scExampleWorlds", method: "GET" })
      .its("body")
      .then((worlds) => {
        expect(worlds).to.have.length(2);
      });
  });
});
