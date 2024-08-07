// When you resolve a glitch, a) the resolution is actually applied and b) the glitch goes away.
describe("the resolution of Translation Missing Lexeme glitches", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createLanguageWithApi("Examplish");
    cy.createConstructionWithApi({
      languageName: "Examplish",
      name: "Intransitive Clause",
      children: ["Subject", "Verb"],
    });
    cy.createConstructionWithApi({
      languageName: "Examplish",
      name: "Noun Phrase",
      children: ["Det", "Noun", "Modifier"],
    });
    cy.createLexemeWithApi({
      languageName: "Examplish",
      romanized: "sha",
      pos: "noun",
      definitions: ["cat"],
    });
    cy.createLexemeWithApi({
      languageName: "Examplish",
      romanized: "dor",
      pos: "verb",
      definitions: ["sleep"],
    });
    cy.goToLanguage("Examplish");
    cy.createTranslation({
      structure: {
        construction: "Intransitive Clause",
        children: [
          ["Subject", "lape"],
          ["Verb", "dor"],
        ],
      },
      translation: "The rabbit is sleeping.",
    });
    cy.contains("1 Glitch").click();
  });

  it("lets the user delete the offending translation", () => {
    cy.contains("Delete Translation").click();
    cy.waitForApiResult("/api/glitches*", "getGlitches");
    cy.contains("non-existent lexeme").should("not.exist");
    cy.contains("Main").click();
    cy.waitForApiResult("/api/translations*", "getTranslations");
    cy.contains("The rabbit is sleeping.").should("not.exist");
  });

  it("lets the user add the missing lexicon entry", () => {
    cy.contains("Add Lexeme").click();
    cy.enterLexemePartOfSpeech("noun");
    cy.enterLexemeDefinitions(["rabbit"]);
    cy.contains("Save").click();
    cy.waitForApiResult("/api/glitches*", "getGlitches");
    cy.contains("non-existent lexeme").should("not.exist");
    cy.contains("Lexicon").click();
    cy.contains("rabbit");
    cy.changeRomanization("rabbit", "kone");
    cy.goToLanguage("Examplish");
    cy.contains("Kone dor.");
    cy.get(".card").should("have.length", 1);
  });
});

export {};
