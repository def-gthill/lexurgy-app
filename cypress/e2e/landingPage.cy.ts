describe("the public landing page", () => {
  it("has a link to the public SC page", () => {
    cy.goToPublicHome();
    cy.contains("Sound Changer").click();
    cy.tabTitleIs("Lexurgy Sound Changer");
  });
});
