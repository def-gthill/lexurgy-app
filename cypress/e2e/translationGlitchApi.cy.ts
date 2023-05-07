import Glitch from "@/models/Glitch";
import Translation from "@/models/Translation";

describe("the translation glitch endpoint", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";
  const translationId = "4efb8162-4b63-474b-8b1d-c22bd5782ad2";
  const clauseUuid = "8361bff7-57b8-461f-bb1a-c6109d070205";

  beforeEach(() => {
    cy.resetDb();
    cy.prepareExamplish();
  });

  it("creates glitch objects for words that can't be linked", () => {
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
      url: "/api/glitches?language=Examplish",
      method: "GET",
    })
      .its("body")
      .should((actual: Glitch[]) => {
        expect(actual).to.have.length(2);
      });
  });
});
