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

  it("lets the user start the changes at a specific rule", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa", "bbb", "ccc"],
      changes: "a-to-b:\n a => b\n\nb-to-c:\n b => c\n\nc-to-d:\n c => d",
      startAt: "B To C",
    });
    cy.scOutputWordsAre(["aaa", "ddd", "ddd"]);
  });

  it("lets the user stop changes before a specific rule", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa", "bbb", "ccc"],
      changes: "a-to-b:\n a => b\n\nb-to-c:\n b => c\n\nc-to-d:\n c => d",
      stopBefore: "C To D",
    });
    cy.scOutputWordsAre(["ccc", "ccc", "ccc"]);
  });

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

  it("doesn't trace any words if tracing is turned off", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa", "bbb", "ccc"],
      changes: "a-to-b:\n a => b\n\nb-to-c:\n b => c\n\nc-to-d:\n c => d",
      traceWords: ["aaa", "ccc"],
      turnOffTracing: true,
    });
    cy.scOutputWordsAre(["ddd", "ddd", "ddd"]);
    cy.scNoIntermediates();
  });

  it("displays an error message if the sound changes contain a parse-time error", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa"],
      changes: "bad-rule:\na =>",
    });
    cy.scShowsError();
  });

  // Errors on individual words

  // Then can I somehow test the file import/exports and the share button?
});

export {};
