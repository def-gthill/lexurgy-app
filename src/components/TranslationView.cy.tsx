import Construction from "@/models/Construction";
import Translation from "@/models/Translation";
import TranslationView from "./TranslationView";

describe("TranslationView", () => {
  const intransitiveClause: Construction = {
    name: "Intransitive Clause",
    children: ["Subject", "Verb"],
  };
  const constructions: Construction[] = [intransitiveClause];
  const oneNodeTranslation: Translation = {
    romanized: "Sha dor.",
    structure: {
      construction: intransitiveClause,
      children: [
        ["Subject", { romanized: "sha" }],
        ["Verb", { romanized: "dor" }],
      ],
    },
    translation: "The cat is sleeping.",
  };

  it("displays a simple translation", () => {
    const translation: Translation = {
      romanized: "Sha dor.",
      translation: "The cat is sleeping.",
    };
    cy.mount(<TranslationView translation={translation} />);
    cy.contains("Sha dor.");
    cy.contains("The cat is sleeping.");
  });

  it("displays a one-node structured translation", () => {
    cy.mount(
      <TranslationView
        constructions={constructions}
        translation={oneNodeTranslation}
      />
    );
    cy.contains("Sha dor.");
    cy.contains("The cat is sleeping.");
    cy.contains("Show Structure").click();
    cy.contains("Sha dor.");
    cy.contains("The cat is sleeping.");
    cy.contains(/^Subject$/);
    cy.contains(/^sha$/);
    cy.contains(/^Verb$/);
    cy.contains(/^dor$/);
  });

  it("lets the user edit the translation", () => {
    let saved = false;
    function saveTranslation(translation: Translation) {
      saved = true;
      expect(translation.romanized).to.equal("Fyel dor.");
    }
    cy.mount(
      <TranslationView
        constructions={constructions}
        translation={oneNodeTranslation}
        onUpdate={saveTranslation}
      />
    );
    cy.contains("Sha dor.");
    cy.contains("Edit").click();
    cy.contains("Edit").click();
    cy.get("#Subject").clear().type("fyel");
    cy.contains("Done").click();
    cy.contains("Save")
      .click()
      .then(() => expect(saved).to.be.true);
    cy.contains("Fyel dor.");
  });
});
