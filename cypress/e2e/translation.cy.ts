describe("the translation editor", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  function createTranslation() {
    cy.contains("Add Translation").click();
    cy.get("#construction").select("Intransitive Clause");
    cy.contains("Create").click();
    cy.contains("Subject").type("sha");
    cy.contains("Verb").type("dor");
    cy.contains("Done").click();
    cy.contains("Subject");
    cy.get("#translation").type("The cat is sleeping.");
    cy.contains("Save").click();
  }

  it("lets the user create a one-node syntax tree", () => {
    cy.visit(`/language/${examplishUuid}`);
    createTranslation();
    cy.contains("Sha dor.");
    cy.contains("Show Structure").click();
    cy.contains("Subject");
    cy.reload();
    cy.contains("Sha dor.");
    cy.contains("Show Structure").click();
    cy.contains("Subject");
  });

  it("lets the user create a multi-node syntax tree", () => {
    cy.visit(`/language/${examplishUuid}`);
    cy.contains("Add Translation").click();
    cy.get("#construction").select("Intransitive Clause");
    cy.contains("Create").click();
    cy.contains("Subject")
      .parents(".editor")
      .first()
      .contains("Expand")
      .click();
    cy.get("#construction").select("Noun Phrase");
    cy.contains("Create").click();
    cy.contains("Det").type("le");
    cy.contains("Noun").type("sha");
    cy.contains("Modifier").type("nwa");
    cy.contains("Done").click();
    cy.contains("Verb").type("dor");
    cy.contains("Done").click();
    cy.get("#translation").type("The black cat is sleeping.");
    cy.contains("Save").click();
    cy.contains("Le sha nwa dor.");
    cy.contains("Show Structure").click();
    cy.contains("Subject");
    cy.contains("Det");
    cy.reload();
    cy.contains("Le sha nwa dor.");
    cy.contains("Show Structure").click();
    cy.contains("Subject");
    cy.contains("Det");
  });

  it("lets the user create a syntax tree with lexicon links", () => {
    cy.exec("npm run db:seed:examplish:lexicon");
    cy.visit(`/language/${examplishUuid}`);
    createTranslation();
    cy.visit(`/language/${examplishUuid}/lexicon`);
    cy.contains("cat").parents(".card").contains("Edit").click();
    cy.get("#romanized").clear().type("fyel");
    cy.contains("Save").click();
    cy.contains("fyel");
    cy.visit(`/language/${examplishUuid}`);
    cy.contains("Fyel dor.");
  });

  it("lets the user edit an existing translation", () => {
    cy.visit(`/language/${examplishUuid}`);
    createTranslation();
    cy.contains("Sha dor.");
    cy.contains("Edit").click();
    cy.contains("Edit").click();
    cy.get("#Subject").clear().type("fyel");
    cy.contains("Done").click();
    cy.contains("Save").click();
    cy.contains("Fyel dor.");
    cy.reload();
    cy.contains("Fyel dor.");
    cy.contains("Sha dor.").should("not.exist");
  });

  it("lets the user delete a translation", () => {
    cy.visit(`/language/${examplishUuid}`);
    createTranslation();
    cy.contains("Sha dor.");
    cy.contains("Delete").click();
    cy.contains("Sha dor.").should("not.exist");
  });
});

export {};
