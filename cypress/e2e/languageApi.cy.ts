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

  it("can update a language", () => {
    cy.createLanguageWithApi("Examplish");
    cy.updateLanguageWithApi("Examplish", { name: "Renamese" });
    cy.getLanguages().then((languages) => {
      expect(languages).to.have.length(1);
      expect(languages[0]).to.have.property("name", "Renamese");
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

  it("can update a language in a world", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Examplish", { world: "Handwavia" });
    cy.updateLanguageWithApi("Examplish", {
      name: "Renamese",
    });
    cy.getLanguages({ world: "Handwavia" }).should((languages) => {
      expect(languages).to.have.length(1);
      expect(languages[0]).to.have.property("name", "Renamese");
    });
  });

  it("can retrieve all the languages in a world", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Examplish", { world: "Handwavia" });
    cy.createLanguageWithApi("Unwantese");
    cy.getLanguages({ world: "Handwavia" }).should((languages) => {
      expect(languages.length).to.equal(1);
      expect(languages[0].name).to.equal("Examplish");
    });
  });

  it("can retrieve only the languages that aren't in worlds", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Unwantese", { world: "Handwavia" });
    cy.createLanguageWithApi("Examplish");
    cy.getLanguages({ world: null }).should((languages) => {
      expect(languages.length).to.equal(1);
      expect(languages[0].name).to.equal("Examplish");
      expect(languages[0]).not.to.haveOwnProperty("worldId");
    });
  });

  it("finds languages in worlds the user can't see when world=none", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Examplish", { world: "Handwavia" });
    cy.ensureUserExists("second");
    cy.addCoOwnerToLanguageWithApi("Examplish", "second");
    cy.login("second");
    cy.getLanguages({ world: null }).should((languages) => {
      expect(languages.length).to.equal(1);
      expect(languages[0].name).to.equal("Examplish");
      expect(languages[0].worldId).to.equal("redacted");
    });
  });

  it("can move a language to a different world", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createWorldWithApi("Wavehandia");
    cy.createLanguageWithApi("Examplish", { world: "Handwavia" });
    cy.updateLanguageWithApi("Examplish", {
      world: "Wavehandia",
    });
    cy.getLanguages({ world: "Handwavia" }).should((languages) => {
      expect(languages).to.be.empty;
    });
    cy.getLanguages({ world: "Wavehandia" }).should((languages) => {
      expect(languages).to.have.length(1);
    });
  });

  it("can remove a language from its world", () => {
    cy.createWorldWithApi("Handwavia");
    cy.createLanguageWithApi("Examplish", { world: "Handwavia" });
    cy.updateLanguageWithApi("Examplish", { world: "none" });
    cy.getLanguages({ world: "Handwavia" }).should((languages) => {
      expect(languages).to.be.empty;
    });
    cy.getLanguages().should((languages) => {
      expect(languages).to.have.length(1);
    });
    cy.getWorlds().should((worlds) => {
      expect(worlds).to.have.length(1);
    });
  });
});
