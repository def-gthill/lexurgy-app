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

  it("lets the user edit a map", () => {
    testSchematicEditor(
      Schema.map("Some Map", Schema.string("Key"), Schema.string("Value")),
      () => {
        cy.get("#schema__0__key").type("foo");
        cy.get("#schema__0__value").type("oof");
        cy.contains("Add Value").click();
        cy.get("#schema__1__key").type("bar");
        cy.get("#schema__1__value").type("rab");
        return cy.contains("Save").click();
      },
      new Map([
        ["foo", "oof"],
        ["bar", "rab"],
      ])
    );
  });

  it("lets the user switch between alternative structures", () => {
    testSchematicEditor(
      Schema.array(
        "Some Array",
        Schema.union<string | { foo: string; bar: string }>("Choice", [
          Schema.string("String"),
          Schema.object("Object", {
            foo: Schema.string("Foohood"),
            bar: Schema.string("Barness"),
          }),
        ])
      ),
      () => {
        cy.get("input").last().type("gnirts");
        cy.contains("Add Choice").click();
        cy.get("select").last().select("Object");
        cy.contains("Foohood").type("oof");
        cy.contains("Barness").type("rab");
        return cy.contains("Save").click();
      },
      ["gnirts", { foo: "oof", bar: "rab" }]
    );
  });

  it("lets the user switch between objects tagged by a type property", () => {
    testSchematicEditor(
      Schema.array(
        "Some Array",
        Schema.taggedUnion<
          | { type: "str"; string: string }
          | { type: "obj"; foo: string; bar: string }
        >("Choice", {
          str: Schema.object("String", { string: Schema.string("String") }),
          obj: Schema.object("Object", {
            foo: Schema.string("Foohood"),
            bar: Schema.string("Barness"),
          }),
        })
      ),
      () => {
        cy.get("input").last().type("gnirts");
        cy.contains("Add Choice").click();
        cy.get("select").last().select("Object");
        cy.contains("Foohood").type("oof");
        cy.contains("Barness").type("rab");
        return cy.contains("Save").click();
      },
      [
        { type: "str", string: "gnirts" },
        { type: "obj", foo: "oof", bar: "rab" },
      ]
    );
  });

  it("lets the user build recursive structures", () => {
    const ref = Schema.ref<Recursive>();
    testSchematicEditor(
      Schema.defineRef(
        Schema.union<string | Recursive>("Recursive", [
          Schema.string("String"),
          Schema.object("Object", {
            payload: Schema.string("Payload"),
            nested: Schema.useRef("Nested", ref),
          }),
        ]),
        ref
      ),
      () => {
        cy.get("select").select("Object");
        cy.get("#schema__payload").type("foo");
        cy.get("select").last().select("Object");
        cy.get("#schema__nested__payload").last().type("bar");
        cy.get("input").last().type("baz");
        return cy.contains("Save").click();
      },
      { payload: "foo", nested: { payload: "bar", nested: "baz" } }
    );
  });

  interface Recursive {
    payload: string;
    nested: string | Recursive;
  }

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
    command().then(() => {
      if (expected instanceof Map) {
        expect(onSave).to.be.calledOnceWithExactly(
          Cypress.sinon.match.map.deepEquals(expected)
        );
      } else {
        expect(onSave).to.be.calledOnceWithExactly(expected);
      }
    });
  }
});
