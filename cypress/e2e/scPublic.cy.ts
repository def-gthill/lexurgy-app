describe("the public sound changer page", () => {
  it("lets the user run ad hoc sound changes", () => {
    cy.visit("/sc");
    cy.contains("Input Words").type("foo\nbar");
    cy.contains("Sound Changes").type("my-rule:\n o => a");
    cy.contains("Apply").click();
    cy.contains("faa");
  });
});
