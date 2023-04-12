import Language from "@/models/Language";
import Translation from "@/models/Translation";
import TranslationEditor from "./TranslationEditor";

describe("TranslationEditor", () => {
  it("saves the translation when Save is clicked", () => {
    const language: Language = {
      name: "Examplish",
    };
    function saveTranslation(translation: Translation) {
      expect(translation.romanized).to.equal("Sha dor.");
      expect(translation.translation).to.equal("The cat is sleeping.");
    }
    cy.mount(
      <TranslationEditor
        language={language}
        saveTranslation={saveTranslation}
      />
    );
    cy.get("#text").type("Sha dor.");
    cy.get("#translation").type("The cat is sleeping.");
    cy.contains("Save").click();
  });
});
