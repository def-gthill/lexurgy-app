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

  it("lets the user create a construction", () => {
    cy.visit(`/language/${examplishUuid}/syntax`);
    cy.contains("Add Construction").click();
    cy.get("#name").type("Noun Phrase");
    cy.get("#slot1").type("Noun");
    cy.contains("Add Slot").click();
    cy.get("#slot2").type("Modifier");
    cy.contains("Save").click();
    cy.contains("Noun Phrase");
    cy.reload();
    cy.contains("Noun Phrase");
  });
});
