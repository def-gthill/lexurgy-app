describe("the translation editor", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

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
    cy.contains("Subject");
    cy.get("#translation").type("The cat is sleeping.");
    cy.contains("Save").click();
    cy.contains("Sha dor.");
    cy.contains("Show Structure").click();
    cy.contains("Subject");
    cy.reload();
    cy.contains("Sha dor.");
    cy.contains("Show Structure").click();
    cy.contains("Subject");
  });

  it("lets the user create a syntax tree with lexicon links", () => {
    cy.exec("npm run db:seed:examplish:lexicon");
    cy.visit(`/language/${examplishUuid}`);
    cy.contains("Add Structured Translation").click();
    cy.get("#construction").select("Intransitive Clause");
    cy.contains("Create").click();
    cy.contains("Subject").type("sha");
    cy.contains("Verb").type("dor");
    cy.contains("Done").click();
    cy.get("#translation").type("The cat is sleeping.");
    cy.contains("Save").click();
    cy.visit(`/language/${examplishUuid}/lexicon`);
    cy.contains("cat").parents(".card").contains("Edit").click();
    cy.get("#romanized").clear().type("fyel");
    cy.contains("Save").click();
    cy.contains("fyel");
    cy.visit(`/language/${examplishUuid}`);
    cy.contains("Fyel dor.");
  });
});
