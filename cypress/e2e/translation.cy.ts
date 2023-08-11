describe("the translation editor", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.goToHome();
    cy.createLanguage("Examplish");
    cy.navigateToLanguage("Examplish");
    cy.clickNavigationLink("Syntax");
    cy.createConstruction({
      name: "Intransitive Clause",
      children: ["Subject", "Verb"],
    });
    cy.createConstruction({
      name: "Noun Phrase",
      children: ["Det", "Noun", "Modifier"],
    });
  });

  function createTranslation() {
    cy.createTranslation({
      structure: {
        construction: "Intransitive Clause",
        children: [
          ["Subject", "sha"],
          ["Verb", "dor"],
        ],
      },
      translation: "The cat is sleeping.",
    });
  }

  it("lets the user create a one-node syntax tree", () => {
    cy.goToLanguage("Examplish");
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
    cy.goToLanguage("Examplish");
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

  function createLexicon() {
    cy.clickNavigationLink("Lexicon");
    cy.createLexeme({
      romanized: "sha",
      pos: "noun",
      definitions: ["cat"],
    });
    cy.createLexeme({
      romanized: "dor",
      pos: "verb",
      definitions: ["sleep"],
    });
    cy.clickNavigationLink("Main");
  }

  it("lets the user create a syntax tree with lexicon links", () => {
    cy.goToLanguage("Examplish");
    createLexicon();
    createTranslation();
    cy.clickNavigationLink("Lexicon");
    cy.changeRomanization("cat", "fyel");
    cy.contains("fyel");
    cy.goToLanguage("Examplish");
    cy.contains("Fyel dor.");
  });

  it("links multiple copies of the same word", () => {
    cy.goToLanguage("Examplish");
    createLexicon();
    cy.createTranslation({
      structure: {
        construction: "Intransitive Clause",
        children: [
          ["Subject", "sha"],
          ["Verb", "sha"],
        ],
      },
      translation: "The cat is catting.",
    });
    cy.clickNavigationLink("Lexicon");
    cy.contains("cat").parents(".card").contains("Edit").click();
    cy.get("#romanized").clear().type("fyel");
    cy.contains("Save").click();
    cy.contains("fyel");
    cy.clickNavigationLink("Main");
    cy.contains("Fyel fyel.");
  });

  it("lets the user edit an existing translation", () => {
    cy.goToLanguage("Examplish");
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
    cy.goToLanguage("Examplish");
    createTranslation();
    cy.contains("Sha dor.");
    cy.contains("Delete").click();
    cy.contains("Sha dor.").should("not.exist");
  });
});

export {};
