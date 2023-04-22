describe("a language page", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  it("displays the language name", () => {
    cy.visit(`/language/${examplishUuid}`);
    cy.title().should("equal", "Lexurgy - Examplish");
    cy.contains("Examplish").should("be.visible");
  });

  it("has a link to the lexicon page", () => {
    cy.visit(`/language/${examplishUuid}`);
    cy.contains("Lexicon").click();
    cy.title().should("equal", "Lexurgy - Examplish Lexicon");
    cy.contains("Examplish Lexicon").should("be.visible");
  });

  it("has a link to the syntax page", () => {
    cy.visit(`/language/${examplishUuid}`);
    cy.contains("Syntax").click();
    cy.title().should("equal", "Lexurgy - Examplish Syntax");
    cy.contains("Examplish Syntax").should("be.visible");
  });
});

export {};
