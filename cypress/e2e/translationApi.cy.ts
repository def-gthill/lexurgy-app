import SyntaxNode from "@/translation/SyntaxNode";
import Translation from "@/translation/Translation";
import ApiTranslation from "../support/ApiTranslation";

describe("the translation endpoint", () => {
  const oneNodeTranslation: ApiTranslation = {
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

  it("can round-trip a one-node syntax tree", () => {
    const translation = oneNodeTranslation;

    cy.createTranslationWithApi(translation);
    cy.getTranslation(translation.translation).should((actual: Translation) => {
      expect(actual.romanized).to.equal(translation.romanized);
      expect(actual.translation).to.equal(translation.translation);
      expect(actual.structure?.construction?.name).to.equal(
        translation.structure.construction
      );
      expect(actual.structure?.children).to.have.deep.members([
        ["Subject", { romanized: "sha" }],
        ["Verb", { romanized: "dor" }],
      ]);
    });
  });

  it("can round-trip a multi-node syntax tree", () => {
    const translation: ApiTranslation = {
      languageName: "Examplish",
      romanized: "Le sha nwa dor.",
      structure: {
        construction: "Intransitive Clause",
        children: [
          [
            "Subject",
            {
              construction: "Noun Phrase",
              children: [
                ["Det", "le"],
                ["Noun", "sha"],
                ["Modifier", "nwa"],
              ],
            },
          ],
          ["Verb", "dor"],
        ],
      },
      translation: "The black cat is sleeping.",
    };

    cy.createTranslationWithApi(translation);
    cy.getTranslation("The black cat is sleeping.").should(
      (actual: Translation) => {
        expect(actual.romanized).to.equal(translation.romanized);
        expect(actual.translation).to.equal(translation.translation);
        expect(actual.structure?.construction?.name).to.equal(
          translation.structure.construction
        );
        const children = actual.structure?.children;
        expect(children).to.deep.include(["Verb", { romanized: "dor" }]);
        const nestedChildren = (
          children?.find(([name]) => name === "Subject")?.at(1) as SyntaxNode
        ).children;
        expect(nestedChildren).to.have.deep.members([
          ["Det", { romanized: "le" }],
          ["Noun", { romanized: "sha" }],
          ["Modifier", { romanized: "nwa" }],
        ]);
      }
    );
  });

  it("can post the same translation twice without duplicating", () => {
    const translation = oneNodeTranslation;

    cy.createTranslationWithApi(translation);
    cy.createTranslationWithApi(translation);
    cy.getTranslations("Examplish").should("have.length", 1);
  });
});
