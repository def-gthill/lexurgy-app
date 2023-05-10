import Glitch from "@/models/Glitch";
import Translation from "@/models/Translation";

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

  beforeEach(() => {
    cy.resetDb();
    cy.prepareExamplish();
  });

  it("creates glitch objects for words that can't be linked", () => {
    cy.request({
      url: "/api/translations",
      method: "POST",
      body: translation,
    });

    cy.request({
      url: `/api/translations/${translationId}/check`,
      method: "POST",
    });

    cy.request({
      url: `/api/glitches?language=${examplishUuid}`,
      method: "GET",
    })
      .its("body")
      .should((actual: Glitch[]) => {
        expect(actual).to.have.length(2);
        const catMissing = actual.find(
          (glitch) => glitch.referent.searchTerm === "sha"
        );
        expect(catMissing?.dependent.type).to.equal("Translation");
        expect(catMissing?.dependent.value.id).to.equal(translationId);
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
    cy.prepareExamplishLexicon();

    cy.request({
      url: "/api/translations",
      method: "POST",
      body: translation,
    });

    cy.request({
      url: `/api/translations/${translationId}/check`,
      method: "POST",
    });

    cy.request({
      url: `/api/glitches?language=${examplishUuid}`,
      method: "GET",
    })
      .its("body")
      .should((actual: Glitch[]) => {
        expect(actual).to.be.empty;
      });
  });
});
