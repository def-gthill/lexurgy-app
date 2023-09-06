import Editor from "@/components/Editor";
import * as Schema from "@/components/Schema";
import SchematicEditor from "@/components/SchematicEditor";

describe("SchematicEditor", () => {
  it("lets the user edit a string", () => {
    testSchematicEditor(
      Schema.string("Some String"),
      () => {
        cy.contains("Some String").type("foobar");
        return cy.contains("Save").click();
      },
      "foobar"
    );
  });

  it("lets the user edit an array of strings", () => {
    testSchematicEditor(
      Schema.array("Some List", Schema.string("Some String")),
      () => {
        cy.get("input").last().type("foo");
        cy.contains("Add Some String").click();
        cy.get("input").last().type("bar");
        return cy.contains("Save").click();
      },
      ["foo", "bar"]
    );
  });

  it("lets the user edit an object", () => {
    testSchematicEditor(
      Schema.object("Some Object", {
        foo: Schema.string("Foohood"),
        bar: Schema.string("Barness"),
      }),
      () => {
        cy.contains("Foohood").type("oof");
        cy.contains("Barness").type("rab");
        return cy.contains("Save").click();
      },
      { foo: "oof", bar: "rab" }
    );
  });

  function testSchematicEditor<T>(
    schema: Schema.Schema<T>,
    command: () => Cypress.Chainable<any>,
    expected: T
  ) {
    const onSave = cy.stub().as("callback");
    cy.mount(
      <Editor
        component={(value, onChange) => (
          <SchematicEditor schema={schema} value={value} onChange={onChange} />
        )}
        initialValue={schema.empty()}
        onSave={onSave}
      />
    );
    command().then(() => expect(onSave).to.be.calledOnceWithExactly(expected));
  }
});
