import Construction from "@/models/Construction";
import ConstructionEditor from "./ConstructionEditor";
import Editor from "./Editor";

describe("ConstructionEditor", () => {
  it("lets the user create a construction", () => {
    let saved = false;
    function saveConstruction(construction: Construction) {
      saved = true;
      expect(construction.name).to.equal("Intransitive Clause");
      expect(construction.children).to.deep.equal(["Subject", "Verb"]);
    }
    cy.mount(
      <Editor
        component={(value, onChange) => (
          <ConstructionEditor construction={value} onChange={onChange} />
        )}
        initialValue={{ name: "", children: [""] } as Construction}
        onSave={saveConstruction}
      />
    );
    cy.get("#name").type("Intransitive Clause");
    cy.get("#slot1").type("Subject");
    cy.contains("Add Slot").click();
    cy.get("#slot2").type("Verb");
    cy.contains("Save")
      .click()
      .then(() => expect(saved).to.be.true);
  });
});
