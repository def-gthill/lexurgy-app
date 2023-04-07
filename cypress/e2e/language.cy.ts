describe("a language page", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  before(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  it("has the language name in its title", () => {
    cy.visit(`/lang/${examplishUuid}`);
    cy.title().should("equal", "Lexurgy - Examplish");
  });

  it("displays the language name", () => {
    cy.visit(`/lang/${examplishUuid}`);
    cy.contains("Examplish").should("be.visible");
  });
});

export {};
