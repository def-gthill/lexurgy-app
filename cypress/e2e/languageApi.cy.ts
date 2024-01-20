import Language from "@/language/Language";

describe("the language endpoint", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
  });

  it("can round-trip a language", () => {
    cy.createLanguageWithApi("Examplish");
    cy.getLanguage("Examplish").should((actual: Language) => {
      expect(actual.name).to.equal("Examplish");
    });
  });

  it("can round-trip a language in a world", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Examplish", { world: "Handwavia" });
    cy.getLanguage("Examplish").should((actual: Language) => {
      expect(actual.name).to.equal("Examplish");
      expect(actual.worldId).to.be.a("string");
    });
  });

  it("can retrieve all the languages in a world", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Examplish", { world: "Handwavia" });
    cy.createLanguageWithApi("Unwantese");
    cy.getLanguages({ world: "Handwavia" }).should((actual: Language[]) => {
      expect(actual.length).to.equal(1);
      expect(actual[0].name).to.equal("Examplish");
    });
  });

  it("can retrieve only the languages that aren't in worlds", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Unwantese", { world: "Handwavia" });
    cy.createLanguageWithApi("Examplish");
    cy.getLanguages({ world: null }).should((actual: Language[]) => {
      expect(actual.length).to.equal(1);
      expect(actual[0].name).to.equal("Examplish");
    });
  });
});
