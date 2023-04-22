import Translation from "@/models/Translation";
import TranslationView from "./TranslationView";

describe("TranslationView", () => {
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
    const translation: Translation = {
      romanized: "Sha dor.",
      structure: {
        children: [
          ["Subject", { romanized: "sha" }],
          ["Verb", { romanized: "dor" }],
        ],
      },
      translation: "The cat is sleeping.",
    };
    cy.mount(<TranslationView translation={translation} />);
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
});
