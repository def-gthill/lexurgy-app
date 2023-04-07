describe("a language", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  it("displays the language name", () => {
    cy.visit(`/lang/${examplishUuid}`);
    cy.title().should("equal", "Lexurgy - Examplish");
  });
});

export {};
