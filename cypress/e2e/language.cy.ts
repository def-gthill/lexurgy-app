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

  describe("the translation editor", () => {
    it("lets the user create a simple translation", () => {
      cy.visit(`/language/${examplishUuid}`);
      cy.contains("Add Translation").click();
      cy.get("#text").type("Sha dor.");
      cy.get("#translation").type("The cat is sleeping.");
      cy.contains("Save").click();
      cy.contains("Sha dor.");
      cy.reload();
      cy.contains("Sha dor.");
    });

    it("lets the user create a one-node syntax tree", () => {
      cy.visit(`/language/${examplishUuid}`);
      cy.contains("Add Structured Translation").click();
      cy.get("#construction").select("Intransitive Clause");
      cy.contains("Create").click();
      cy.contains("Subject").type("sha");
      cy.contains("Verb").type("dor");
      cy.contains("Done").click();
      cy.get("#translation").type("The cat is sleeping.");
      cy.contains("Save").click();
      cy.contains("Sha dor.");
      cy.reload();
      cy.contains("Sha dor.");
    });
  });
});

export {};
