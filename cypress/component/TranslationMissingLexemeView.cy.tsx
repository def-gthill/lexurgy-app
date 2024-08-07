import Glitch from "@/glitch/Glitch";
import GlitchView from "@/glitch/GlitchView";
import TranslationMissingLexemeView from "@/glitch/TranslationMissingLexemeView";
import Language from "@/language/Language";
import Lexeme from "@/lexicon/Lexeme";

describe("TranslationMissingLexemeView", () => {
  const language: Language = {
    name: "Examplish",
  };
  const translation = {
    id: "foobarbaz",
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
    cy.mount(<GlitchView language={language} glitch={glitch} />);
    cy.contains("non-existent lexeme");
    cy.contains("in this translation.");
  });

  it("displays the translation details", () => {
    cy.mount(<GlitchView language={language} glitch={glitch} />);
    cy.contains("Sha dor.");
    cy.contains("The cat is sleeping.");
  });

  it("displays the missing lexeme", () => {
    cy.mount(<GlitchView language={language} glitch={glitch} />);
    cy.contains(`"sha"`);
  });

  it("lets the user resolve the glitch by deleting the translation", () => {
    let deleted = false;
    function deleteTranslation(id: string) {
      deleted = true;
      expect(id).to.equal(translation.id);
    }
    cy.mount(
      <TranslationMissingLexemeView
        language={language}
        translation={glitch.dependent}
        missingLexeme={glitch.referent.searchTerm}
        deleteTranslation={deleteTranslation}
      />
    );
    cy.contains("Delete Translation")
      .click()
      .then(() => expect(deleted).to.be.true);
  });

  it("lets the user resolve the glitch by adding the missing lexeme", () => {
    let added = false;
    function addLexeme(lexeme: Lexeme) {
      added = true;
      expect(lexeme.romanized).to.equal("sha");
      expect(lexeme.pos).to.equal("noun");
      expect(lexeme.definitions).to.deep.equal(["cat"]);
    }
    cy.mount(
      <TranslationMissingLexemeView
        language={language}
        translation={glitch.dependent}
        missingLexeme={glitch.referent.searchTerm}
        addLexeme={addLexeme}
      />
    );
    cy.contains("Add Lexeme").click();
    cy.enterLexemePartOfSpeech("noun");
    cy.enterLexemeDefinitions(["cat"]);
    cy.contains("Save")
      .click()
      .then(() => expect(added).to.be.true);
  });
});
