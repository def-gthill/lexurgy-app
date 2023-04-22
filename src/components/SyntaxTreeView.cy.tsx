import SyntaxNode from "@/models/SyntaxNode";
import SyntaxTreeView from "./SyntaxTreeView";

describe("SyntaxTreeView", () => {
  it("displays a one-node syntax tree", () => {
    const root: SyntaxNode = {
      children: [
        ["Subject", { romanized: "sha" }],
        ["Verb", { romanized: "dor" }],
      ],
    };
    cy.mount(<SyntaxTreeView root={root} />);
    cy.contains("Subject");
    cy.contains("Verb");
    cy.contains("sha");
    cy.contains("dor");
  });

  it("displays the construction name if available", () => {
    const root: SyntaxNode = {
      construction: {
        name: "Intransitive Clause",
        children: ["Subject", "Verb"],
      },
      children: [
        ["Subject", { romanized: "sha" }],
        ["Verb", { romanized: "dor" }],
      ],
    };
    cy.mount(<SyntaxTreeView root={root} />);
    cy.contains("Intransitive Clause");
    cy.contains("Subject");
    cy.contains("Verb");
    cy.contains("sha");
    cy.contains("dor");
  });

  it("displays a complex syntax tree", () => {
    const root: SyntaxNode = {
      children: [
        [
          "Subject",
          {
            children: [
              ["Det", { romanized: "the" }],
              [
                "Noun",
                {
                  children: [
                    ["Modifier", { romanized: "quick" }],
                    [
                      "Noun",
                      {
                        children: [
                          ["Modifier", { romanized: "brown" }],
                          ["Noun", { romanized: "fox" }],
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        ],
        [
          "Verb",
          {
            children: [
              ["Verb", { romanized: "jumps" }],
              ["Prep", { romanized: "over" }],
            ],
          },
        ],
        [
          "Object",
          {
            children: [
              ["Det", { romanized: "the" }],
              [
                "Noun",
                {
                  children: [
                    ["Modifier", { romanized: "lazy" }],
                    ["Noun", { romanized: "dog" }],
                  ],
                },
              ],
            ],
          },
        ],
      ],
    };
    cy.mount(<SyntaxTreeView root={root} />);
    for (const word of [
      "the",
      "quick",
      "brown",
      "fox",
      "jumps",
      "over",
      "lazy",
      "dog",
    ]) {
      cy.contains(word);
    }
  });
});
