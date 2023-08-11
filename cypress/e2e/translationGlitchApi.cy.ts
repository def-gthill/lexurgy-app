import Glitch from "@/models/Glitch";
import Translation from "@/models/Translation";
import ApiTranslation from "../support/ApiTranslation";

describe("the translation glitch endpoint", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";
  const translationId = "4efb8162-4b63-474b-8b1d-c22bd5782ad2";
  const clauseUuid = "8361bff7-57b8-461f-bb1a-c6109d070205";

  const translation: Translation = {
    id: translationId,
    languageId: examplishUuid,
    romanized: "Sha dor.",
    structure: {
      nodeTypeId: clauseUuid,
      children: [
        ["Subject", { romanized: "sha" }],
        ["Verb", { romanized: "dor" }],
      ],
    },
    translation: "The cat is sleeping.",
  };

  const translation_NEW: ApiTranslation = {
    languageName: "Examplish",
    romanized: "Sha dor.",
    structure: {
      construction: "Intransitive Clause",
      children: [
        ["Subject", "sha"],
        ["Verb", "dor"],
      ],
    },
    translation: "The cat is sleeping.",
  };

  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
    cy.createLanguageWithApi("Examplish");
    cy.createConstructionWithApi({
      name: "Intransitive Clause",
      languageName: "Examplish",
      children: ["Subject", "Verb"],
    });
    cy.createConstructionWithApi({
      name: "Noun Phrase",
      languageName: "Examplish",
      children: ["Det", "Noun", "Modifier"],
    });
  });

  it("creates glitch objects for words that can't be linked", () => {
    cy.createTranslationWithApi(translation_NEW);

    cy.checkTranslation("The cat is sleeping.");

    cy.getGlitches("Examplish").should((actual: Glitch[]) => {
      expect(actual).to.have.length(2);
      const catMissing = actual.find(
        (glitch) => glitch.referent.searchTerm === "sha"
      );
      expect(catMissing?.dependent.type).to.equal("Translation");
      expect(catMissing?.dependent.invalidPartPath).to.deep.equal([
        "structure",
        "children",
        "Subject",
        "stem",
      ]);
      expect(catMissing?.referent.referenceType).to.equal("Undefined");
      expect(catMissing?.referent.type).to.equal("Lexeme");
    });
  });

  it("doesn't create glitch objects for words that exist", () => {
    cy.createLexemeWithApi({
      languageName: "Examplish",
      romanized: "sha",
    });
    cy.createLexemeWithApi({
      languageName: "Examplish",
      romanized: "dor",
    });

    cy.createTranslationWithApi(translation_NEW);

    cy.checkTranslation("The cat is sleeping.");

    cy.getGlitches("Examplish").should((actual: Glitch[]) => {
      expect(actual).to.be.empty;
    });
  });
});
