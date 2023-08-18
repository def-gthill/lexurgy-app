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

  function HiddenStringEditor({
    showButtonLabel,
    initialValue,
    onSave,
  }: {
    showButtonLabel: string;
    initialValue: string;
    onSave: (value: string) => void;
  }) {
    return (
      <HiddenEditor
        showButtonLabel={showButtonLabel}
        component={(value, onChange) => (
          <StringEditor value={value} onChange={onChange} />
        )}
        initialValue={initialValue}
        onSave={onSave}
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
      <HiddenStringEditor
        showButtonLabel="Create String"
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
      <HiddenStringEditor
        showButtonLabel="Edit String"
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
      <HiddenStringEditor
        showButtonLabel="Edit String"
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

  it("retains entered information if the user cancels", () => {
    cy.mount(
      <HiddenStringEditor
        showButtonLabel="Edit String"
        initialValue="foo"
        onSave={() => {}}
      />
    );
    cy.contains("Edit String").click();
    cy.get("input").type("bar");
    cy.contains("Cancel").click();
    cy.contains("Edit String").click();
    cy.get("input").then((input) => expect(input).to.have.value("foobar"));
  });

  it("clears entered information if the user saves", () => {
    cy.mount(
      <HiddenStringEditor
        showButtonLabel="Create String"
        initialValue=""
        onSave={() => {}}
      />
    );
    cy.contains("Create String").click();
    cy.get("input").type("foobar");
    cy.contains("Save").click();
    cy.contains("Create String").click();
    cy.get("input").then((input) => expect(input).to.have.value(""));
  });
});
