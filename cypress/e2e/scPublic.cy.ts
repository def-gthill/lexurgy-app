describe("the public sound changer page", () => {
  it("lets the user run ad hoc sound changes", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["foo", "bar"],
      changes: "my-rule:\n o => a",
    });
    cy.scOutputWordsAre(["faa", "bar"]);
  });

  it("displays intermediate forms if defined", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["foo", "bar"],
      changes:
        "rule-1:\n o => a\n\nromanizer-intermediate-form:\nunchanged\n\nrule-2:\n b => d",
    });
    cy.scOutputWordsAre(["faa", "dar"]);
    cy.scIntermediateWordsAre([["Intermediate Form", ["faa", "bar"]]]);
  });

  // Start At

  // Stop Before

  it("lets the user pick words to trace", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa", "bbb", "ccc"],
      changes: "a-to-b:\n a => b\n\nb-to-c:\n b => c\n\nc-to-d:\n c => d",
      traceWords: ["aaa", "ccc"],
    });
    cy.scOutputWordsAre(["ddd", "ddd", "ddd"]);
    cy.scIntermediateWordsAre([
      ["A To B", ["bbb", "", ""]],
      ["B To C", ["ccc", "", ""]],
      ["C To D", ["ddd", "", "ddd"]],
    ]);
  });

  // Then can I somehow test the file import/exports and the share button?

  // Fatal errors

  // Errors on individual words
});

export {};
