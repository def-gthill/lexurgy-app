import Language from "@/language/Language";
import Lexeme from "@/lexicon/Lexeme";
import LexiconView from "@/lexicon/LexiconView";

describe("LexiconView", () => {
  const language: Language = {
    id: "foobarbaz",
    name: "Examplish",
  };
  const lexicon: Lexeme[] = [
    {
      romanized: "sha",
      pos: "noun",
      definitions: ["cat"],
    },
  ];

  it("displays one entry with one definition", () => {
    cy.mount(<LexiconView language={language} lexicon={lexicon} />);
    cy.contains("sha");
    cy.contains("noun");
    cy.contains("cat");
  });

  describe("in editable mode", () => {
    it("lets the user edit entries", () => {
      let saved = false;
      function saveEntry(entry: Lexeme) {
        saved = true;
        expect(entry.romanized).to.equal("fyel");
        expect(entry.pos).to.equal("noun");
        expect(entry.definitions).to.deep.equal(["cat"]);
      }
      cy.mount(
        <LexiconView
          language={language}
          lexicon={lexicon}
          onUpdate={saveEntry}
        />
      );
      cy.contains("Edit").click();
      cy.get("#schema__romanized").clear().type("fyel");
      cy.contains("Save")
        .click()
        .then(() => expect(saved).to.be.true);
      cy.contains("Edit"); // Confirm that the editor closed.
    });
  });
});
