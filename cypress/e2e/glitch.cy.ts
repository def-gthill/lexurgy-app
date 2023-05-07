describe("the glitch link", () => {
  beforeEach(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  it("doesn't show the glitch indicator in a pristine language", () => {
    cy.goToExamplish();
    cy.contains("Main");
    cy.contains("Glitch").should("not.exist");
  });

  it("indicates glitches if the user creates a translation with non-existent words", () => {
    cy.goToExamplish();
    cy.createTranslation({
      structure: {
        construction: "Intransitive Clause",
        children: [
          ["Subject", "sha"],
          ["Verb", "dor"],
        ],
      },
      translation: "The cat is sleeping",
    });
    cy.contains("2 Glitches");
  });
});

export {};
