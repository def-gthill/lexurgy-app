import SyntaxNode from "@/models/SyntaxNode";
import Translation from "@/models/Translation";

describe("the translation endpoint", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";
  const translationId = "4efb8162-4b63-474b-8b1d-c22bd5782ad2";
  const clauseUuid = "8361bff7-57b8-461f-bb1a-c6109d070205";
  const phraseUuid = "6bc72dc1-6e25-4f55-acb5-a65678ff71e7";

  const oneNodeTranslation: Translation = {
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
    cy.exec("npm run db:reset && npm run db:seed:examplish");
  });

  it("can round-trip a one-node syntax tree", () => {
    const translation = oneNodeTranslation;

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
      .should((actual: Translation) => {
        expect(actual.id).to.equal(translation.id!);
        expect(actual.languageId).to.equal(translation.languageId!);
        expect(actual.romanized).to.equal(translation.romanized);
        expect(actual.translation).to.equal(translation.translation);
        expect(actual.structure!.nodeTypeId).to.equal(
          translation.structure!.nodeTypeId
        );
        const children = actual.structure!.children;
        expect(children).to.have.deep.members([
          ["Subject", { romanized: "sha" }],
          ["Verb", { romanized: "dor" }],
        ]);
      });
  });

  it("can round-trip a multi-node syntax tree", () => {
    const translation: Translation = {
      id: translationId,
      languageId: examplishUuid,
      romanized: "Le sha nwa dor.",
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
      .should((actual: Translation) => {
        expect(actual.id).to.equal(translation.id!);
        expect(actual.languageId).to.equal(translation.languageId!);
        expect(actual.romanized).to.equal(translation.romanized);
        expect(actual.translation).to.equal(translation.translation);
        expect(actual.structure!.nodeTypeId).to.equal(
          translation.structure!.nodeTypeId
        );
        const children = actual.structure!.children;
        expect(children).to.deep.include(["Verb", { romanized: "dor" }]);
        const nestedChildren = (
          children.find(([name]) => name === "Subject")![1] as SyntaxNode
        ).children;
        expect(nestedChildren).to.have.deep.members([
          ["Det", { romanized: "le" }],
          ["Noun", { romanized: "sha" }],
          ["Modifier", { romanized: "nwa" }],
        ]);
      });
  });

  it("can post the same translation twice without duplicating", () => {
    const translation = oneNodeTranslation;

    cy.postTranslation(translation);
    cy.postTranslation(translation);
    cy.getTranslations("Examplish").should("have.length", 1);
  });
});
