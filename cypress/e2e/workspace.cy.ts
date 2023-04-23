describe("the workspace page", () => {
  it("displays the app name", () => {
    cy.visit("/");
    cy.contains("Lexurgy").should("be.visible");
  });

  it("provides links to go to each language", () => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
    cy.visit("/");
    cy.contains("Examplish").click();
    cy.title().should("contain", "Examplish");
  });

  it("lets the user create a language", () => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
    cy.visit("/");
    cy.contains("New Language").click();
    cy.get("#name").type("Acmese");
    cy.contains("Save").click();
    cy.contains("Acmese").parent().next().contains("Examplish");
    cy.reload();
    cy.contains("Acmese").parent().next().contains("Examplish");
  });

  it("lets the user delete a language", () => {
    cy.exec("npm run db:reset && npm run db:seed:examplish");
    cy.visit("/");
    cy.contains("Delete").click();
    cy.get("#confirm").type("Examplish");
    cy.get(".AlertDialogContent").contains("Delete").click();
    cy.get(".card").should("be.empty");
  });
});

export {};
