import { InflectRules } from "@/inflect/InflectRules";

describe("The public inflection page", () => {
  it("lets the user create a single hard-coded form", () => {
    cy.goToInflectPublic();
    cy.runInflect({
      dimensions: {},
      rules: "foo",
      stemsAndCategories: ["bar"],
    });
    cy.inflectedFormsAre(["foo"]);
  });

  it("lets the user create a category tree", () => {
    cy.goToInflectPublic();
    cy.runInflect({
      dimensions: { tense: ["present", "past"] },
      rules: {
        branches: new Map([
          ["present", "foo"],
          ["past", "fid"],
        ]),
      },
      stemsAndCategories: [
        { stem: "bar", categories: ["Past"] },
        { stem: "bar", categories: ["Present"] },
      ],
    });
    cy.inflectedFormsAre(["fid", "foo"]);
  });

  it("lets the user reference the stem", () => {
    cy.goToInflectPublic();
    cy.runInflect({
      dimensions: { type: ["stem", "fixed"] },
      rules: {
        branches: new Map<string, InflectRules>([
          ["stem", { formula: { type: "stem" } }],
          ["fixed", "fixed"],
        ]),
      },
      stemsAndCategories: [
        { stem: "foo", categories: ["Fixed"] },
        { stem: "foo", categories: ["Stem"] },
      ],
    });
    cy.inflectedFormsAre(["fixed", "foo"]);
  });

  it.only("lets the user define concatenation rules", () => {
    cy.goToInflectPublic();
    cy.runInflect({
      dimensions: {},
      rules: {
        formula: {
          type: "concat",
          parts: [
            { formula: { type: "form", form: "pre" } },
            { formula: { type: "stem" } },
          ],
        },
      },
      stemsAndCategories: [{ stem: "bar", categories: [] }],
    });
    cy.inflectedFormsAre(["prebar"]);
  });
});

export {};
