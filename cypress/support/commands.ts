/// <reference types="cypress" />

import SyntaxNode from "@/models/SyntaxNode";
import Translation from "@/models/Translation";
import ApiConstruction from "./ApiConstruction";
import ApiTranslation from "./ApiTranslation";
import UserConstruction from "./UserConstruction";
import { UserLexeme } from "./UserLexeme";
import { UserSoundChangeInputs } from "./UserSoundChangeInputs";
import UserTranslation, { UserStructure } from "./UserTranslation";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      resetDb(): Chainable<void>;
      prepareExamplish(): Chainable<void>;
      prepareExamplishLexicon(): Chainable<void>;
      goToHome(): Chainable<void>;
      login(user: string): Chainable<void>;
      tabTitleIs(expected: string): Chainable<void>;
      pageTitleIs(expected: string): Chainable<void>;
      clickNavigationLink(name: string): Chainable<void>;
      createLanguage(name: string): Chainable<void>;
      createLanguageWithApi(name: string): Chainable<void>;
      goToLanguage(name: string): Chainable<void>;
      navigateToLanguage(name: string): Chainable<void>;
      createLexeme(lexeme: UserLexeme): Chainable<void>;
      createConstruction(construction: UserConstruction): Chainable<void>;
      createConstructionWithApi(construction: ApiConstruction): Chainable<void>;
      createTranslation(translation: UserTranslation): Chainable<void>;
      createTranslationWithApi(translation: ApiTranslation): Chainable<void>;
      getTranslations(language: string): Chainable<Translation[]>;
      getTranslation(translation: string): Chainable<Translation>;
      postTranslation(translation: Translation): Chainable<void>;
      goToLexicon(name: string): Chainable<void>;
      changeRomanization(
        language: string,
        lexeme: string,
        newRomanization: string
      ): Chainable<void>;
      goToScPublic(): Chainable<void>;
      runSc(inputs: UserSoundChangeInputs): Chainable<void>;
      startSc(): Chainable<void>;
      scEnterFreeInputWords(inputWords: string): Chainable<void>;
      scEnterSoundChanges(soundChanges: string): Chainable<void>;
      scInputWordsAre(expectedWords: string[]): Chainable<void>;
      scOutputWordsAre(expectedWords: string[]): Chainable<void>;
      scIntermediateWordsAre(
        expectedWords: [string, string[]][]
      ): Chainable<void>;
      scNoIntermediates(): Chainable<void>;
      scShowsSyntaxError(): Chainable<void>;
      waitForApiResult(url: string, name: string): Chainable<void>;
    }
  }
}

const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

class AliasMap {
  private aliasMap = new Map();

  getId(name: string): string {
    if (!this.aliasMap.has(name)) {
      this.aliasMap.set(name, crypto.randomUUID());
    }
    return this.aliasMap.get(name);
  }
}

const languages = new AliasMap();
const constructions = new AliasMap();
const translations = new AliasMap();

Cypress.Commands.add("resetDb", () => {
  cy.exec("npm run db:reset");
});

Cypress.Commands.add("prepareExamplish", () => {
  cy.exec("npm run db:seed:examplish");
});

Cypress.Commands.add("prepareExamplishLexicon", () => {
  cy.exec("npm run db:seed:examplish:lexicon");
});

Cypress.Commands.add("goToHome", () => {
  cy.visit("/");
});

Cypress.Commands.add("login", (user: string) => {
  cy.session(user, () => {
    cy.goToHome();
    cy.contains("Email").type(Cypress.env(`${user}UserEmail`));
    cy.contains("Sign in with Email").click();
    cy.contains("Lexurgy");
  });
});

Cypress.Commands.add("tabTitleIs", (expected: string) => {
  cy.title().should("equal", expected);
});

Cypress.Commands.add("pageTitleIs", (expected: string) => {
  cy.get("h1").then((header) => expect(header.text()).to.equal(expected));
});

Cypress.Commands.add("clickNavigationLink", (name: string) => {
  cy.contains(name).click();
});

Cypress.Commands.add("createLanguage", (name: string) => {
  cy.contains("New Language").click();
  cy.get("#name").type(name);
  cy.contains("Save").click();
});

Cypress.Commands.add("createLanguageWithApi", (name: string) => {
  cy.request({
    url: "/api/languages",
    method: "POST",
    body: {
      id: languages.getId(name),
      name,
    },
  });
});

Cypress.Commands.add("goToLanguage", (name: string) => {
  cy.visit("/");
  cy.navigateToLanguage(name);
});

Cypress.Commands.add("navigateToLanguage", (name: string) => {
  cy.contains(name).click();
});

Cypress.Commands.add("createLexeme", (lexeme: UserLexeme) => {
  cy.contains("Add Entry").click();
  cy.get("#romanized").type(lexeme.romanized);
  cy.get("#pos").type(lexeme.pos ?? "contentive");
  cy.get("#definition").type(lexeme.definitions?.at(0) ?? "TBD");
  cy.contains("Save").click();
});

Cypress.Commands.add("createConstruction", (construction: UserConstruction) => {
  cy.contains("Add Construction").click();
  cy.get("#name").type(construction.name);
  construction.children.forEach((child, i) => {
    if (i > 0) {
      cy.contains("Add Slot").click();
    }
    cy.get(`#slot${i + 1}`).type(child);
  });
  cy.contains("Save").click();
});

Cypress.Commands.add(
  "createConstructionWithApi",
  (construction: ApiConstruction) => {
    cy.request({
      url: "/api/constructions",
      method: "POST",
      body: {
        id: constructions.getId(construction.name),
        languageId: languages.getId(construction.languageName),
        name: construction.name,
        children: construction.children,
      },
    });
  }
);

Cypress.Commands.add("createTranslation", (translation: UserTranslation) => {
  cy.contains("Add Translation").click();
  cy.get("#construction").select(translation.structure.construction);
  cy.contains("Create").click();
  for (const [childName, child] of translation.structure.children) {
    cy.contains(childName).type(child as string);
  }
  cy.contains("Done").click();
  cy.get("#translation").type(translation.translation);
  cy.contains("Save").click();
});

Cypress.Commands.add(
  "createTranslationWithApi",
  (translation: ApiTranslation) => {
    cy.request({
      url: "/api/translations",
      method: "POST",
      body: {
        id: translations.getId(translation.translation),
        languageId: languages.getId(translation.languageName),
        romanized: translation.romanized,
        structure: userStructureToSyntaxNode(translation.structure),
        translation: translation.translation,
      },
    });

    function userStructureToSyntaxNode(
      userStructure: UserStructure
    ): SyntaxNode {
      return {
        nodeTypeId: constructions.getId(userStructure.construction),
        children: userStructure.children.map(([name, child]) => {
          if (typeof child === "string") {
            return [name, { romanized: child }];
          } else {
            return [name, userStructureToSyntaxNode(child)];
          }
        }),
      };
    }
  }
);

Cypress.Commands.add("getTranslations", (language: string) => {
  return cy
    .request({
      url: `/api/translations?language=${languages.getId(language)}`,
      method: "GET",
    })
    .its("body");
});

Cypress.Commands.add("getTranslation", (translation: string) => {
  return cy
    .request({
      url: `/api/translations/${translations.getId(translation)}`,
      method: "GET",
    })
    .its("body");
});

Cypress.Commands.add("postTranslation", (translation: Translation) => {
  cy.request({
    url: "/api/translations",
    method: "POST",
    body: translation,
  });
});

Cypress.Commands.add("goToLexicon", (name: string) => {
  const id = languages.getId(name);
  cy.visit(`/language/${id}/lexicon`);
});

Cypress.Commands.add(
  "changeRomanization",
  (language: string, lexeme: string, newRomanization: string) => {
    cy.goToLexicon(language);
    cy.contains(lexeme).parents(".card").contains("Edit").click();
    cy.get("#romanized").clear().type(newRomanization);
    cy.contains("Save").click();
  }
);

Cypress.Commands.add("goToScPublic", () => {
  cy.visit("/sc");
});

Cypress.Commands.add("runSc", (inputs: UserSoundChangeInputs) => {
  for (const input of inputs.inputWords) {
    cy.get("table input").last().type(input);
    cy.contains("Add Word").click();
  }
  cy.scEnterSoundChanges(inputs.changes);
  if (inputs.traceWords) {
    cy.contains("Trace Changes").click();
    for (const traceWord of inputs.traceWords) {
      const index = inputs.inputWords.indexOf(traceWord);
      cy.get(`#tracing-${index}`).click();
    }
  }
  if (inputs.turnOffTracing) {
    cy.contains("Trace Changes").click();
  }
  if (inputs.startAt) {
    cy.get("#start-at-enabled").click();
    cy.get("#start-at").select(inputs.startAt);
    if (inputs.turnOffStartAt) {
      cy.get("#start-at-enabled").click();
    }
  }
  if (inputs.stopBefore) {
    cy.get("#stop-before-enabled").click();
    cy.get("#stop-before").select(inputs.stopBefore);
    if (inputs.turnOffStopBefore) {
      cy.get("#stop-before-enabled").click();
    }
  }
  cy.startSc();
});

Cypress.Commands.add("startSc", () => {
  cy.contains("Apply").click();
});

Cypress.Commands.add("scEnterFreeInputWords", (inputWordText: string) => {
  cy.get("#free-edit").click();
  cy.get("#input-words").type(inputWordText);
});

Cypress.Commands.add("scEnterSoundChanges", (soundChanges: string) => {
  cy.get(".cm-line").type(soundChanges);
});

Cypress.Commands.add("scInputWordsAre", (expectedWords: string[]) => {
  expectedWords.forEach((word, i) => {
    cy.get(`tbody > :nth-child(${i + 1}) > :first > input`).then((element) =>
      expect(element).to.have.value(word)
    );
  });
});

Cypress.Commands.add("scOutputWordsAre", (expectedWords: string[]) => {
  cy.contains(expectedWords[0]);
  expectedWords.forEach((word, i) => {
    cy.get(`tbody > :nth-child(${i + 1}) > :last`).then((element) =>
      expect(element.text()).to.equal(word)
    );
  });
});

Cypress.Commands.add(
  "scIntermediateWordsAre",
  (expectedWords: [string, string[]][]) => {
    cy.contains(expectedWords[0][0]);
    cy.get("#trace-changes").then((element) => {
      const tracing = element.attr("data-state") === "checked";
      const traceOffset = tracing ? 1 : 0;
      expectedWords.forEach(([key, words], i) => {
        cy.get(
          `thead > tr > :nth-child(${2 * (i + 1) + 1 + traceOffset})`
        ).then((element) => expect(element.text()).to.equal(key));
        words.forEach((word, j) => {
          cy.get(
            `tbody > :nth-child(${j + 1}) > :nth-child(${
              2 * (i + 1) + 1 + traceOffset
            })`
          ).then((element) => expect(element.text()).to.equal(word));
        });
      });
    });
  }
);

Cypress.Commands.add("scNoIntermediates", () => {
  cy.get(`thead > tr > :nth-child(3)`).then((element) =>
    expect(element.text()).to.equal("Output Word")
  );
});

Cypress.Commands.add("scShowsSyntaxError", () => {
  cy.get("#status").invoke("text").should("match", /line/);
});

Cypress.Commands.add("waitForApiResult", (url: string, name: string) => {
  cy.intercept(url).as(name);
  cy.wait(`@${name}`);
});

export {};
