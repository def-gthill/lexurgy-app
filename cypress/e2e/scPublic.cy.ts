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

  // Trace

  // Then can I somehow test the file import/exports and the share button?
});

export {};
