describe("the world endpoint", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
  });

  it("can round-trip a world", () => {
    cy.createWorldWithApi("Handwavia", "Home of Betamax Crinkledash");
    cy.getWorlds().should((worlds) => {
      expect(worlds).to.have.length(1);
      expect(worlds[0].name).to.equal("Handwavia");
      expect(worlds[0].description).to.equal("Home of Betamax Crinkledash");
    });
  });

  it("can update a world", () => {
    cy.createWorldWithApi("Handwavia", "Home of Betamax Crinkledash");
    cy.updateWorldWithApi("Handwavia", { name: "Examplia" });
    cy.getWorlds().then((worlds) => {
      expect(worlds).to.have.length(1);
      expect(worlds[0].name).to.equal("Examplia");
      expect(worlds[0].description).to.equal("Home of Betamax Crinkledash");
    });
  });
});

export {};
