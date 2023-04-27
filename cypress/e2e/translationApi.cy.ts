import Translation from "@/models/Translation";

describe("the translation endpoint", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";
  const translationId = "4efb8162-4b63-474b-8b1d-c22bd5782ad2";
  const clauseUuid = "8361bff7-57b8-461f-bb1a-c6109d070205";
  const phraseUuid = "6bc72dc1-6e25-4f55-acb5-a65678ff71e7";

  beforeEach(() => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  it("can round-trip a one-node syntax tree", () => {
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
      url: `/api/translations/${translationId}`,
      method: "GET",
    })
      .its("body")
      .should("containSubset", translation);
  });

  it("can round-trip a multi-node syntax tree", () => {
    const translation: Translation = {
      id: translationId,
      languageId: examplishUuid,
      romanized: "Sha dor.",
      structure: {
        nodeTypeId: clauseUuid,
        children: [
          [
            "Subject",
            {
              nodeTypeId: phraseUuid,
              children: [
                ["Det", { romanized: "le" }],
                ["Noun", { romanized: "sha" }],
                ["Modifier", { romanized: "nwa" }],
              ],
            },
          ],
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
      url: `/api/translations/${translationId}`,
      method: "GET",
    })
      .its("body")
      .should("containSubset", translation);
  });
});
