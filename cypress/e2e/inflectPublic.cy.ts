describe("The public inflection page", () => {
  it("lets the user create a single hard-coded form", () => {
    cy.goToInflectPublic();
    cy.runInflect({
      rules: "foo",
      stemsAndCategories: ["bar"],
    });
    cy.inflectedFormsAre(["foo"]);
  });
});
