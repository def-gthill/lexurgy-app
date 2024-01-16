describe("the SC examples page", () => {
  beforeEach(() => {
    cy.goToScExamples();
  });

  it.skip("provides links for all the tutorial languages", () => {
    // This should be based on the database, not hard-coded!
    cy.contains("Basican");
  });
});
