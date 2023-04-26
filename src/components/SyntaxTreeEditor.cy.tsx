import Construction from "@/models/Construction";
import SyntaxNode from "@/models/SyntaxNode";
import SyntaxTreeEditor from "./SyntaxTreeEditor";

describe("SyntaxTreeEditor", () => {
  const clauseId = "8361bff7-57b8-461f-bb1a-c6109d070205";
  const phraseId = "6bc72dc1-6e25-4f55-acb5-a65678ff71e7";

  const clause = {
    id: clauseId,
    name: "Intransitive Clause",
    children: ["Subject", "Verb"],
  };

  const phrase = {
    id: phraseId,
    name: "Noun Phrase",
    children: ["Det", "Noun", "Modifier"],
  };

  const constructions: Construction[] = [clause, phrase];

  it("lets the user create a one-node syntax tree", () => {
    let saved = false;
    function saveTree(root: SyntaxNode) {
      saved = true;
      expect(root.nodeTypeId).to.equal(clauseId);
      expect(root.children).to.deep.equal([
        ["Subject", { romanized: "sha" }],
        ["Verb", { romanized: "dor" }],
      ]);
    }
    cy.mount(
      <SyntaxTreeEditor constructions={constructions} saveTree={saveTree} />
    );
    cy.get("#construction").select("Intransitive Clause");
    cy.contains("Create").click();
    cy.contains("Subject").type("sha");
    cy.contains("Verb").type("dor");
    cy.contains("Done")
      .click()
      .then(() => expect(saved).to.be.true);
  });

  it("lets the user create a multi-node syntax tree", () => {
    let saved = false;
    function saveTree(root: SyntaxNode) {
      saved = true;
      expect(root).to.deep.equal({
        nodeTypeId: clauseId,
        construction: clause,
        children: [
          [
            "Subject",
            {
              nodeTypeId: phraseId,
              construction: phrase,
              children: [
                ["Det", { romanized: "le" }],
                ["Noun", { romanized: "sha" }],
                ["Modifier", { romanized: "nwa" }],
              ],
            },
          ],
          ["Verb", { romanized: "dor" }],
        ],
      } as SyntaxNode);
    }
    cy.mount(
      <SyntaxTreeEditor constructions={constructions} saveTree={saveTree} />
    );
    cy.get("#construction").select("Intransitive Clause");
    cy.contains("Create").click();
    cy.contains("Subject")
      .parents(".editor")
      .first()
      .contains("Expand")
      .click();
    cy.get("#construction").select("Noun Phrase");
    cy.contains("Create").click();
    cy.contains("Det").type("le");
    cy.contains("Noun").type("sha");
    cy.contains("Modifier").type("nwa");
    cy.contains("Done").click();
    cy.contains("Verb").type("dor");
    cy.contains("Done")
      .click()
      .then(() => expect(saved).to.be.true);
  });
});
