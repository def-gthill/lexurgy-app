import Construction from "@/models/Construction";
import SyntaxNode from "@/models/SyntaxNode";
import SyntaxTreeEditor from "./SyntaxTreeEditor";

describe("SyntaxTreeEditor", () => {
  const wantedId = "8361bff7-57b8-461f-bb1a-c6109d070205";
  const unwantedId = "6bc72dc1-6e25-4f55-acb5-a65678ff71e7";

  it("lets the user create a one-node syntax tree", () => {
    const constructions: Construction[] = [
      {
        id: unwantedId,
        name: "Unwanted Construction",
        children: ["Foo", "Bar", "Baz"],
      },
      {
        id: wantedId,
        name: "Intransitive Clause",
        children: ["Subject", "Verb"],
      },
    ];
    let saved = false;
    function saveTree(root: SyntaxNode) {
      saved = true;
      expect(root.nodeTypeId).to.equal(wantedId);
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
});
