describe("a lexicon page", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  it("displays the language name and page type", () => {
    cy.visit(`/language/${examplishUuid}/lexicon`);
    cy.title().should("equal", "Lexurgy - Examplish Lexicon");
    cy.contains("Examplish Lexicon").should("be.visible");
  });

  it("lets the user create a lexicon entry", () => {
    cy.visit(`/language/${examplishUuid}/lexicon`);
    cy.contains("Add Entry").click();
    cy.get("#romanized").type("sha");
    cy.get("#pos").type("noun");
    cy.get("#definition").type("cat");
    cy.contains("Save").click();
    cy.contains("sha");
    cy.reload();
    cy.contains("sha");
  });
});

export {};