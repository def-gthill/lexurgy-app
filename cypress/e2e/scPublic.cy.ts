describe("the public sound changer page", () => {
  it("lets the user run ad hoc sound changes", () => {
    cy.goToScPublic();
    cy.runSc({
      inputWords: ["foo", "bar"],
      changes: "my-rule:\n o => a",
    });
    cy.scOutputWordsAre(["faa", "bar"]);
  });
});
