import HiddenEditor from "@/components/HiddenEditor";

describe("HiddenEditor", () => {
  function StringEditor({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  it("lets the user create a resource", () => {
    let saved = false;
    function saveString(s: string) {
      saved = true;
      expect(s).to.equal("foobar");
    }
    cy.mount(
      <HiddenEditor
        showButtonLabel="Create String"
        component={(value, onChange) => (
          <StringEditor value={value} onChange={onChange} />
        )}
        initialValue=""
        onSave={saveString}
      />
    );
    cy.contains("Create String").click();
    cy.get("input").type("foobar");
    cy.contains("Save")
      .click()
      .then(() => expect(saved).to.be.true);
  });

  it("lets the user edit an existing resource", () => {
    let saved = false;
    function saveString(s: string) {
      saved = true;
      expect(s).to.equal("foobar");
    }
    cy.mount(
      <HiddenEditor
        showButtonLabel="Edit String"
        component={(value, onChange) => (
          <StringEditor value={value} onChange={onChange} />
        )}
        initialValue="foo"
        onSave={saveString}
      />
    );
    cy.contains("Edit String").click();
    cy.get("input").type("bar");
    cy.contains("Save")
      .click()
      .then(() => expect(saved).to.be.true);
  });

  it("lets the user cancel editing", () => {
    let saved = false;
    function saveString(s: string) {
      saved = true;
    }
    cy.mount(
      <HiddenEditor
        showButtonLabel="Edit String"
        component={(value, onChange) => (
          <StringEditor value={value} onChange={onChange} />
        )}
        initialValue="foo"
        onSave={saveString}
      />
    );
    cy.contains("Edit String").click();
    cy.get("input").type("bar");
    cy.contains("Cancel").click();
    cy.contains("Edit String");
    cy.then(() => expect(saved).to.be.false);
  });
});
