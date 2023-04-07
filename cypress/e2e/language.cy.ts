describe("a language page", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
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

  describe("the translation editor", () => {
    it("lets the user create a simple translation", () => {
      cy.visit(`/lang/${examplishUuid}`);
      cy.contains("Add Translation").click();
      cy.get("#text").type("Sha dor.");
      cy.get("#translation").type("The cat is sleeping.");
      cy.contains("Save").click();
      cy.contains("Sha dor.");
      cy.reload();
      cy.contains("Sha dor.");
    });
  });
});

export {};
