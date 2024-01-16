import Editor from "@/components/Editor";
import * as Schema from "@/components/Schema";
import SchematicEditor from "@/components/SchematicEditor";

describe("SchematicEditor", () => {
  it("lets the user edit a string", () => {
    testSchematicEditor({
      schema: Schema.string("Some String"),
      command: () => {
        cy.contains("Some String").type("foobar");
      },
      expected: "foobar",
    });
  });

  it("lets the user edit an array of strings", () => {
    testSchematicEditor({
      schema: Schema.array("Some List", Schema.string("Some String")),
      command: () => {
        cy.get("input").last().type("foo");
        cy.contains("Add Some String").click();
        cy.get("input").last().type("bar");
      },
      expected: ["foo", "bar"],
    });
  });

  it("lets the user edit an object", () => {
    testSchematicEditor({
      schema: Schema.object("Some Object", {
        foo: Schema.string("Foohood"),
        bar: Schema.string("Barness"),
      }),
      command: () => {
        cy.contains("Foohood").type("oof");
        cy.contains("Barness").type("rab");
      },
      expected: { foo: "oof", bar: "rab" },
    });
  });

  it("lets the user edit an object's only property", () => {
    testSchematicEditor({
      schema: Schema.object("Some Object", {
        foo: Schema.string("Foohood"),
      }),
      command: () => {
        cy.contains("Foohood").type("oof");
      },
      expected: { foo: "oof" },
    });
  });

  it("accepts an object editor with no properties, even though there's nothing to edit", () => {
    testSchematicEditor({
      schema: Schema.object("Empty", {}),
      expected: {},
    });
  });

  it("lets the user edit a map", () => {
    testSchematicEditor({
      schema: Schema.map(
        "Some Map",
        Schema.string("Key"),
        Schema.string("Value")
      ),
      command: () => {
        cy.get("#schema__0__key").type("foo");
        cy.get("#schema__0__value").type("oof");
        cy.contains("Add Value").click();
        cy.get("#schema__1__key").type("bar");
        cy.get("#schema__1__value").type("rab");
      },
      expected: new Map([
        ["foo", "oof"],
        ["bar", "rab"],
      ]),
    });
  });

  it("allows customizing the name of map entries", () => {
    testSchematicEditor({
      schema: Schema.map(
        "Some Map",
        Schema.string("Key"),
        Schema.string("Value"),
        { entryName: "Entry" }
      ),
      command: () => {
        cy.contains("Add Entry");
      },
    });
  });

  it("lets the user switch between alternative structures", () => {
    testSchematicEditor({
      schema: Schema.array(
        "Some Array",
        Schema.union<string | { foo: string; bar: string }>("Choice", [
          Schema.string("String"),
          Schema.object("Object", {
            foo: Schema.string("Foohood"),
            bar: Schema.string("Barness"),
          }),
        ])
      ),
      command: () => {
        cy.get("input").last().type("gnirts");
        cy.contains("Add Choice").click();
        cy.get("select").last().select("Object");
        cy.contains("Foohood").type("oof");
        cy.contains("Barness").type("rab");
      },
      expected: ["gnirts", { foo: "oof", bar: "rab" }],
    });
  });

  it("shows the current structure type in the dropdown", () => {
    testSchematicEditor({
      schema: Schema.union<string | { foo: string; bar: string }>("Choice", [
        Schema.string("String"),
        Schema.object("Object", {
          foo: Schema.string("Foohood"),
          bar: Schema.string("Barness"),
        }),
      ]),
      initialValue: { foo: "oof", bar: "rab" },
      command: () => {
        cy.get("select").then((select) =>
          select.map((_, element) =>
            expect(element.selectedOptions.item(0)?.text).to.equal("Object")
          )
        );
      },
    });
  });

  it("lets the user switch between objects tagged by a type property", () => {
    testSchematicEditor({
      schema: Schema.array(
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
      command: () => {
        cy.get("input").last().type("gnirts");
        cy.contains("Add Choice").click();
        cy.get("select").last().select("Object");
        cy.contains("Foohood").type("oof");
        cy.contains("Barness").type("rab");
      },
      expected: [
        { type: "str", string: "gnirts" },
        { type: "obj", foo: "oof", bar: "rab" },
      ],
    });
  });

  it("shows the current tagged type in the drowpdown", () => {
    testSchematicEditor({
      schema: Schema.taggedUnion<
        | { type: "str"; string: string }
        | { type: "obj"; foo: string; bar: string }
      >("Choice", {
        str: Schema.object("String", { string: Schema.string("String") }),
        obj: Schema.object("Object", {
          foo: Schema.string("Foohood"),
          bar: Schema.string("Barness"),
        }),
      }),
      initialValue: { type: "obj", foo: "oof", bar: "rab" },
      command: () => {
        cy.get("select").then((select) =>
          select.map((_, element) =>
            expect(element.selectedOptions.item(0)?.text).to.equal("Object")
          )
        );
      },
    });
  });

  it("lets the user build recursive structures", () => {
    const ref = Schema.ref<Recursive>();
    testSchematicEditor({
      schema: Schema.defineRef(
        Schema.union<string | Recursive>("Recursive", [
          Schema.string("String"),
          Schema.object("Object", {
            payload: Schema.string("Payload"),
            nested: Schema.callRef("Nested", ref),
          }),
        ]),
        ref
      ),
      command: () => {
        cy.get("select").select("Object");
        cy.get("#schema__option__payload").type("foo");
        cy.get("select").last().select("Object");
        cy.get("#schema__option__nested__option__payload").last().type("bar");
        cy.get("input").last().type("baz");
      },
      expected: { payload: "foo", nested: { payload: "bar", nested: "baz" } },
    });
  });

  interface Recursive {
    payload: string;
    nested: string | Recursive;
  }

  function testSchematicEditor<T>({
    schema,
    initialValue,
    command,
    expected,
  }: {
    schema: Schema.Schema<T>;
    initialValue?: T;
    command?: () => void;
    expected?: T;
  }) {
    const onSave = cy.stub().as("callback");
    cy.mount(
      <Editor
        component={(value, onChange) => (
          <SchematicEditor schema={schema} value={value} onChange={onChange} />
        )}
        initialValue={initialValue ?? schema.empty()}
        onSave={onSave}
      />
    );
    if (command) {
      command();
    }
    if (expected !== undefined) {
      cy.contains("Save")
        .click()
        .then(() => {
          if (expected instanceof Map) {
            expect(onSave).to.be.calledOnceWithExactly(
              Cypress.sinon.match.map.deepEquals(expected)
            );
          } else {
            expect(onSave).to.be.calledOnceWithExactly(expected);
          }
        });
    }
  }
});
