import Glitch from "@/models/Glitch";
import Translation from "@/models/Translation";
import GlitchView from "./GlitchView";

describe("TranslationMissingLexemeView", () => {
  const translation: Translation = {
    romanized: "Sha dor.",
    translation: "The cat is sleeping.",
  };
  const glitch: Glitch = {
    id: "",
    dependent: {
      type: "Translation",
      value: translation,
      invalidPartPath: [],
    },
    referent: {
      referenceType: "Undefined",
      type: "Lexeme",
      searchTerm: "sha",
    },
  };

  it("displays the type of glitch", () => {
    cy.mount(<GlitchView glitch={glitch} />);
    cy.contains("non-existent lexeme");
    cy.contains("in this translation.");
  });

  it("displays the translation details", () => {
    cy.mount(<GlitchView glitch={glitch} />);
    cy.contains("Sha dor.");
    cy.contains("The cat is sleeping.");
  });

  it("displays the missing lexeme", () => {
    cy.mount(<GlitchView glitch={glitch} />);
    cy.contains(`"sha"`);
  });
});
