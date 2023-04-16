import Language from "@/models/Language";
import Translation from "@/models/Translation";
import Editor from "./Editor";
import TranslationEditor from "./TranslationEditor";

describe("TranslationEditor", () => {
  it("saves the translation when Save is clicked", () => {
    const language: Language = {
      name: "Examplish",
    };
    let saved = false;
    function saveTranslation(translation: Translation) {
      saved = true;
      expect(translation.romanized).to.equal("Sha dor.");
      expect(translation.translation).to.equal("The cat is sleeping.");
    }
    cy.mount(
      <Editor
        component={(value, onChange) => (
          <TranslationEditor
            language={language}
            translation={value}
            onChange={onChange}
          />
        )}
        initialValue={{ romanized: "", translation: "" }}
        onSave={saveTranslation}
      />
    );
    cy.get("#text").type("Sha dor.");
    cy.get("#translation").type("The cat is sleeping.");
    cy.contains("Save")
      .click()
      .then(() => expect(saved).to.be.true);
  });
});
