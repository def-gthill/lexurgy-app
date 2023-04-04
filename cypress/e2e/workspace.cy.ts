describe("the workspace page", () => {
  it("displays the app name", () => {
    cy.visit("/");
    cy.contains("Lexurgy").should("be.visible");
  });
});

export {};
