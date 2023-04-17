import Lexeme from "@/models/Lexeme";
import LexiconView from "./LexiconView";

describe("LexiconView", () => {
  it("displays one entry with one definition", () => {
    const lexicon: Lexeme[] = [
      {
        romanized: "sha",
        pos: "noun",
        definitions: ["cat"],
      },
    ];
    cy.mount(<LexiconView lexicon={lexicon} />);
    cy.contains("sha");
    cy.contains("noun");
    cy.contains("cat");
  });
});
