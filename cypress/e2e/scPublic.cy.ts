describe("the public sound changer page", () => {
  it("lets the user run ad hoc sound changes", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["foo", "bar"],
      changes: "my-rule:\n o => a",
    });
    cy.scOutputWordsAre(["faa", "bar"]);
  });

  it("allows the user to insert lines in the text area", () => {
    cy.goToScPublic();
    cy.scEnterSoundChanges("my-rule:\n o => a");
    cy.scEnterFreeInputWords("foo\nbar");
    cy.scInsertFreeInputWord("boo", 1);
    cy.startSc();
    cy.scOutputWordsAre(["faa", "baa", "bar"]);
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

  it("starts at the beginning if start-at is turned off", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa", "bbb", "ccc"],
      changes: "a-to-b:\n a => b\n\nb-to-c:\n b => c\n\nc-to-d:\n c => d",
      startAt: "B To C",
      turnOffStartAt: true,
    });
    cy.scOutputWordsAre(["ddd", "ddd", "ddd"]);
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

  it("continues to the end if stop-before is turned off", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa", "bbb", "ccc"],
      changes: "a-to-b:\n a => b\n\nb-to-c:\n b => c\n\nc-to-d:\n c => d",
      stopBefore: "C To D",
      turnOffStopBefore: true,
    });
    cy.scOutputWordsAre(["ddd", "ddd", "ddd"]);
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

  it.only("doesn't trace any words if tracing is turned on and then back off", () => {
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
    cy.scToggleTracing();
    cy.intercept("/api/services?endpoint=scv1*").as("runSc");
    cy.startSc();
    cy.wait("@runSc");
    cy.scNoIntermediates();
  });

  it("shows the correct names of special stages", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa"],
      changes: "foo:\n a => b\n\nromanizer-foo:\n b => c",
      traceWords: ["aaa"],
    });
    cy.scOutputWordsAre(["bbb"]);
    cy.scIntermediateWordsAre([
      ["Foo", ["bbb"]],
      ["Romanizer Foo", ["ccc"]],
    ]);
  });

  it("shows all stages even if some have the same nice name", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aba", "aca"],
      changes: "Syllables:\n {a, ba, aca}\n\nSyllables:\n {a, ba, ca}",
      traceWords: ["aba", "aca"],
    });
    cy.scOutputWordsAre(["a.ba", "a.ca"]);
    cy.scIntermediateWordsAre([
      ["Syllables", ["a.ba", ""]],
      ["Syllables", ["", "a.ca"]],
    ]);
  });

  it("displays an error message if the sound changes contain a parse-time error", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["aaa"],
      changes: "bad-rule:\na =>",
    });
    cy.scShowsSyntaxError();
  });

  // Errors on individual words

  // Then can I somehow test the file import/exports and the share button?

  it("populates the sound changes and input words from the URL if given", () => {
    cy.goToScPublic({
      inputWords: ["foo", "bar"],
      changes: "my-rule:\n o => a",
    });
    cy.scInputWordsAre(["foo", "bar"]);
    cy.startSc();
    cy.scOutputWordsAre(["faa", "bar"]);
  });
});

export {};
