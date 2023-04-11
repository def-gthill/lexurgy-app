import Language from "@/models/Language";
import Translation from "@/models/Translation";
import TranslationEditor from "./TranslationEditor";

describe("<TranslationEditor />", () => {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

  it("renders", () => {
    const language: Language = {
      id: examplishUuid,
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
