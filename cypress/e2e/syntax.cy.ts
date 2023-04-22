describe("the construction editor", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  it("displays the language's constructions", () => {
    cy.visit(`/language/${examplishUuid}/syntax`);
    cy.contains("Intransitive Clause");
    cy.contains("Subject");
    cy.contains("Verb");
  });
});
