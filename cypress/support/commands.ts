/// <reference types="cypress" />

import Glitch from "@/glitch/Glitch";
import { Formula, InflectRules } from "@/inflect/InflectRules";
import Language from "@/language/Language";
import Evolution from "@/sc/Evolution";
import SyntaxNode from "@/translation/SyntaxNode";
import Translation from "@/translation/Translation";
import { User } from "@/user/User";
import World from "@/world/World";
import { encode } from "js-base64";
import ApiConstruction from "./ApiConstruction";
import ApiLexeme from "./ApiLexeme";
import ApiTranslation from "./ApiTranslation";
import UserConstruction from "./UserConstruction";
import UserInflectInputs from "./UserInflectInputs";
import UserLanguage from "./UserLanguage";
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
      goToPublicHome(): Chainable<void>;
      goToHome(): Chainable<void>;
      login(user: string): Chainable<void>;
      logout(): Chainable<void>;
      ensureUserExists(user: string): Chainable<void>;
      getUser(user: string): Chainable<User>;
      tabTitleIs(expected: string): Chainable<void>;
      pageTitleIs(expected: string): Chainable<void>;
      clickNavigationLink(name: string): Chainable<void>;
      previewShowsJsonOf(value: any): Chainable<void>;
      createWorld(name: string, description?: string): Chainable<void>;
      deleteWorld(name: string): Chainable<void>;
      createWorldWithApi(name: string, description?: string): Chainable<void>;
      updateWorldWithApi(name: string, update: Partial<World>): Chainable<void>;
      createExampleWorldWithApi(
        name: string,
        description?: string
      ): Chainable<void>;
      getWorlds(): Chainable<World[]>;
      getWorld(name: string): Chainable<World>;
      goToWorld(name: string): Chainable<void>;
      navigateToWorld(name: string): Chainable<void>;
      createLanguage(name: string): Chainable<void>;
      createLanguageWithApi(
        name: string,
        options?: { world?: string }
      ): Chainable<void>;
      updateLanguageWithApi(
        name: string,
        update: Partial<UserLanguage>
      ): Chainable<void>;
      addCoOwnerToLanguageWithApi(
        langaugeName: string,
        user: string
      ): Chainable<void>;
      getLanguages(filter?: { world?: string | null }): Chainable<Language[]>;
      getLanguage(name: string): Chainable<Language>;
      goToLanguage(name: string): Chainable<void>;
      navigateToLanguage(name: string): Chainable<void>;
      ownersAre(users: string[]): Chainable<void>;
      addOwner(user: string): Chainable<void>;
      createLexeme(lexeme: UserLexeme): Chainable<void>;
      enterLexemeRomanization(romanized: string): Chainable<void>;
      enterLexemePartOfSpeech(pos: string): Chainable<void>;
      enterLexemeDefinitions(definitions: string[]): Chainable<void>;
      createLexemeWithApi(lexeme: ApiLexeme): Chainable<void>;
      importLexeme(lexeme: UserLexeme): Chainable<void>;
      exportLexeme(romanized: string): Chainable<void>;
      createConstruction(construction: UserConstruction): Chainable<void>;
      createConstructionWithApi(construction: ApiConstruction): Chainable<void>;
      createTranslation(translation: UserTranslation): Chainable<void>;
      createTranslationWithApi(translation: ApiTranslation): Chainable<void>;
      getTranslations(language: string): Chainable<Translation[]>;
      getTranslation(translation: string): Chainable<Translation>;
      checkTranslation(translation: string): Chainable<void>;
      changeRomanization(
        lexeme: string,
        newRomanization: string
      ): Chainable<void>;
      getGlitches(language: string): Chainable<Glitch[]>;
      goToScPublic(inputs?: {
        inputWords: string[];
        changes: string;
      }): Chainable<void>;
      runSc(inputs: UserSoundChangeInputs): Chainable<void>;
      startSc(): Chainable<void>;
      scEnterInputWords(inputWords: string[]): Chainable<void>;
      scEnterFreeInputWords(inputWords: string): Chainable<void>;
      scInsertFreeInputWord(word: string, index: number): Chainable<void>;
      scEnterSoundChanges(soundChanges: string): Chainable<void>;
      scStartAt(ruleName: string): Chainable<void>;
      scToggleTracing(): Chainable<void>;
      scInputWordsAre(expectedWords: string[]): Chainable<void>;
      scOutputWordsAre(expectedWords: string[]): Chainable<void>;
      scIntermediateWordsAre(
        expectedWords: [string, string[]][]
      ): Chainable<void>;
      scNoIntermediates(): Chainable<void>;
      scShowsSyntaxError(): Chainable<void>;
      createEvolutionWithApi(
        language: string,
        evolution: Evolution
      ): Chainable<void>;
      goToScExamples(exampleName?: string): Chainable<void>;
      scExampleUrlHas(exampleName: string): Chainable<void>;
      goToInflectPublic(): Chainable<void>;
      runInflect(inputs: UserInflectInputs): Chainable<void>;
      inflectedFormsAre(forms: string[]): Chainable<void>;
      waitForApiResult(url: string, name: string): Chainable<void>;
    }
  }
}

class AliasMap {
  private aliasMap = new Map();

  getId(name: string): string {
    if (!this.aliasMap.has(name)) {
      this.aliasMap.set(name, crypto.randomUUID());
    }
    return this.aliasMap.get(name);
  }
}

const worlds = new AliasMap();
const languages = new AliasMap();
const lexemes = new AliasMap();
const constructions = new AliasMap();
const translations = new AliasMap();

Cypress.Commands.add("resetDb", () => {
  cy.exec("npm run db:reset");
});

Cypress.Commands.add("goToHome", () => {
  cy.visit("/");
  cy.contains("Accept").click();
});

Cypress.Commands.add("goToPublicHome", () => {
  cy.visit("/");
});

function getUserEmail(user: string) {
  return Cypress.env(`${user}UserEmail`);
}

Cypress.Commands.add("login", (user: string) => {
  cy.session(user, () => {
    cy.goToPublicHome();
    cy.contains("Sign In").click();
    cy.contains("Email").type(getUserEmail(user));
    cy.contains("Sign in with Email").click();
    cy.contains("Lexurgy");
  });
});

Cypress.Commands.add("logout", () => {
  cy.session("anonymous", () => {});
});

Cypress.Commands.add("ensureUserExists", (user: string) => {
  cy.request({
    url: "/api/users",
    method: "POST",
    body: {
      id: crypto.randomUUID(),
      username: getUserEmail(user),
    },
  });
});

Cypress.Commands.add("getUser", (user: string) => {
  return cy
    .request({
      url: `/api/users?username=${getUserEmail(user)}`,
      method: "GET",
    })
    .its("body")
    .its(0);
});

Cypress.Commands.add("tabTitleIs", (expected: string) => {
  cy.title().should("equal", expected);
});

Cypress.Commands.add("pageTitleIs", (expected: string) => {
  cy.get("h1").then((header) => expect(header.text()).to.equal(expected));
});

Cypress.Commands.add("clickNavigationLink", (name: string) => {
  cy.waitForApiResult("/api/userType", "userType");
  cy.contains(name).click();
});

Cypress.Commands.add("previewShowsJsonOf", (value: any) => {
  cy.get("#preview").then((element) =>
    expect(JSON.parse(element.text())).to.deep.equal(value)
  );
});

Cypress.Commands.add("createWorld", (name: string, description?: string) => {
  cy.contains("New World").click();
  cy.contains("Name").type(name);
  if (description) {
    cy.contains("Description").type(description);
  }
  cy.contains("Save").click();
});

Cypress.Commands.add("deleteWorld", (name: string) => {
  cy.contains(name).parents(".card").contains("Delete").click();
  cy.get("#confirm").type(name);
  cy.get(".AlertDialogContent").contains("Delete").click();
});

Cypress.Commands.add(
  "createWorldWithApi",
  (name: string, description?: string) => {
    cy.request({
      url: "/api/worlds",
      method: "POST",
      body: {
        id: worlds.getId(name),
        name,
        description: description ?? "",
      },
    });
  }
);

Cypress.Commands.add(
  "updateWorldWithApi",
  (name: string, update: Partial<World>) => {
    cy.getWorld(name).then((existingWorld) => {
      const newWorld = { ...existingWorld };
      if (update.name) {
        newWorld.name = update.name;
      }
      if (update.description) {
        newWorld.description = update.description;
      }
      if ("isExample" in update) {
        newWorld.isExample = update.isExample;
      }
      cy.request({
        url: "/api/worlds",
        method: "POST",
        body: newWorld,
      });
    });
  }
);

Cypress.Commands.add(
  "createExampleWorldWithApi",
  (name: string, description?: string) => {
    cy.request({
      url: "/api/worlds",
      method: "POST",
      body: {
        id: worlds.getId(name),
        name,
        description: description ?? "",
        isExample: true,
      },
    });
  }
);

Cypress.Commands.add("getWorlds", () => {
  return cy.request({ url: "/api/worlds", method: "GET" }).its("body");
});

Cypress.Commands.add("getWorld", (name: string) => {
  return cy
    .request({
      url: `/api/worlds/${worlds.getId(name)}`,
      method: "GET",
    })
    .its("body");
});

Cypress.Commands.add("goToWorld", (name: string) => {
  cy.goToHome();
  cy.navigateToWorld(name);
});

Cypress.Commands.add("navigateToWorld", (name: string) => {
  cy.contains(name).click();
});

Cypress.Commands.add("createLanguage", (name: string) => {
  cy.contains("New Language").click();
  cy.get("#name").type(name);
  cy.contains("Save").click();
});

Cypress.Commands.add(
  "createLanguageWithApi",
  (name: string, { world }: { world?: string } = {}) => {
    const language: Language = {
      id: languages.getId(name),
      name,
    };
    if (world) {
      language.worldId = worlds.getId(world);
    }
    cy.request({
      url: "/api/languages",
      method: "POST",
      body: language,
    });
  }
);

Cypress.Commands.add(
  "updateLanguageWithApi",
  (name: string, update: Partial<UserLanguage>) => {
    cy.getLanguage(name).then((existingLanguage) => {
      const newLanguage = { ...existingLanguage };
      if (update.name) {
        newLanguage.name = update.name;
      }
      if (update.world) {
        newLanguage.worldId = worlds.getId(update.world);
      }
      cy.request({
        url: "/api/languages",
        method: "POST",
        body: newLanguage,
      });
    });
  }
);

Cypress.Commands.add(
  "addCoOwnerToLanguageWithApi",
  (languageName: string, user: string) => {
    cy.getUser(user).then((userObject) => {
      const languageId = languages.getId(languageName);
      cy.request({
        url: `/api/languages/${languageId}/access`,
        method: "POST",
        body: {
          languageId,
          user: userObject,
          accessType: "owner",
        },
      });
    });
  }
);

Cypress.Commands.add(
  "getLanguages",
  ({ world }: { world?: string | null } = {}) => {
    const url =
      world === undefined
        ? "/api/languages"
        : `/api/languages?world=${
            world === null ? "none" : worlds.getId(world)
          }`;
    return cy.request({ url, method: "GET" }).its("body");
  }
);

Cypress.Commands.add("getLanguage", (name: string) => {
  return cy
    .request({ url: `/api/languages/${languages.getId(name)}`, method: "GET" })
    .its("body");
});

Cypress.Commands.add("goToLanguage", (name: string) => {
  cy.goToHome();
  cy.navigateToLanguage(name);
});

Cypress.Commands.add("navigateToLanguage", (name: string) => {
  cy.contains(name).click();
});

Cypress.Commands.add("ownersAre", (users: string[]) => {
  for (const user of users) {
    cy.get("main").contains(getUserEmail(user));
  }
});

Cypress.Commands.add("addOwner", (user: string) => {
  cy.contains("Give Access").click();
  cy.contains("Username").type(getUserEmail(user));
  cy.contains("Save").click();
});

Cypress.Commands.add("createLexeme", (lexeme: UserLexeme) => {
  cy.contains("Add Entry").click();
  cy.enterLexemeRomanization(lexeme.romanized);
  cy.enterLexemePartOfSpeech(lexeme.pos ?? "contentive");
  cy.enterLexemeDefinitions(lexeme.definitions ?? ["TBD"]);
  cy.contains("Save").click();
});

Cypress.Commands.add("enterLexemeRomanization", (romanized: string) => {
  cy.get("#schema__romanized").type(romanized);
});

Cypress.Commands.add("enterLexemePartOfSpeech", (pos: string) => {
  cy.get("#schema__pos").type(pos);
});

Cypress.Commands.add("enterLexemeDefinitions", (definitions: string[]) => {
  definitions.forEach((definition, i) => {
    if (i > 0) {
      cy.contains("Add Definition").click();
    }
    cy.get(`#schema__definitions__${i}`).type(definition);
  });
});

Cypress.Commands.add("createLexemeWithApi", (lexeme: ApiLexeme) => {
  cy.request({
    url: "/api/lexemes",
    method: "POST",
    body: {
      id: lexemes.getId(lexeme.romanized),
      languageId: languages.getId(lexeme.languageName),
      romanized: lexeme.romanized,
      pos: lexeme.pos ?? "contentive",
      definitions: lexeme.definitions ?? ["TBD"],
    },
  });
});

Cypress.Commands.add("importLexeme", (lexeme: UserLexeme) => {
  cy.contains("Import Entry").click();
  cy.get("#editor").type(JSON.stringify(lexeme), {
    parseSpecialCharSequences: false,
  });
  cy.contains("Save").click();
});

Cypress.Commands.add("exportLexeme", (romanized: string) => {
  cy.contains(romanized).parents(".card").contains("Export").click();
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

Cypress.Commands.add("checkTranslation", (translation: string) => {
  cy.request({
    url: `/api/translations/${translations.getId(translation)}/check`,
    method: "POST",
  });
});

Cypress.Commands.add(
  "changeRomanization",
  (lexeme: string, newRomanization: string) => {
    cy.contains(lexeme).parents(".card").contains("Edit").click();
    cy.get("#schema__romanized").clear().type(newRomanization);
    cy.contains("Save").click();
  }
);

Cypress.Commands.add("getGlitches", (language: string) => {
  return cy
    .request({
      url: `/api/glitches?language=${languages.getId(language)}`,
      method: "GET",
    })
    .its("body");
});

Cypress.Commands.add(
  "goToScPublic",
  (inputs?: { inputWords: string[]; changes: string }) => {
    let url = "/sc";
    if (inputs) {
      const inputWordsEncoded = encode(inputs.inputWords.join("\n"), true);
      const changesEncoded = encode(inputs.changes, true);
      url += `?changes=${changesEncoded}&input=${inputWordsEncoded}`;
    }
    cy.visit(url);
  }
);

Cypress.Commands.add("runSc", (inputs: UserSoundChangeInputs) => {
  cy.scEnterInputWords(inputs.inputWords);
  cy.scEnterSoundChanges(inputs.changes);
  if (inputs.traceWords) {
    cy.scToggleTracing();
    for (const traceWord of inputs.traceWords) {
      const index = inputs.inputWords.indexOf(traceWord);
      cy.get(`#tracing-${index}`).click();
    }
  }
  if (inputs.turnOffTracing) {
    cy.contains("Trace Changes").click();
  }
  if (inputs.startAt) {
    cy.scStartAt(inputs.startAt);
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

Cypress.Commands.add("scEnterInputWords", (inputWords: string[]) => {
  cy.scEnterFreeInputWords(inputWords.join("\n"));
});

Cypress.Commands.add("scEnterFreeInputWords", (inputWordText: string) => {
  cy.get("#input-words").type(inputWordText);
});

Cypress.Commands.add("scInsertFreeInputWord", (word: string, index: number) => {
  let text = "{moveToStart}";
  for (let i = 0; i < index - 1; i++) {
    text += "{downArrow}";
  }
  text += "{end}\n";
  text += word;
  cy.get("#input-words").type(text);
});

Cypress.Commands.add("scEnterSoundChanges", (soundChanges: string) => {
  cy.get(".cm-line").type(soundChanges, { parseSpecialCharSequences: false });
});

Cypress.Commands.add("scStartAt", (ruleName: string) => {
  cy.get("#start-at-enabled").click();
  cy.get("#start-at").select(ruleName);
});

Cypress.Commands.add("scToggleTracing", () => {
  cy.contains("Trace Changes").click();
});

Cypress.Commands.add("scInputWordsAre", (expectedWords: string[]) => {
  expectedWords.forEach((word, i) => {
    cy.get(`tbody > :nth-child(${i + 1}) > :first`).should("have.text", word);
  });
});

Cypress.Commands.add("scOutputWordsAre", (expectedWords: string[]) => {
  cy.contains(expectedWords[0]);
  expectedWords.forEach((word, i) => {
    cy.get(`tbody > :nth-child(${i + 1}) > :last`).contains(word);
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
        cy.get(`thead > tr > :nth-child(${i + 2 + traceOffset})`).then(
          (element) => expect(element.text()).to.equal(key)
        );
        words.forEach((word, j) => {
          cy.get(
            `tbody > :nth-child(${j + 1}) > :nth-child(${i + 2 + traceOffset})`
          ).then((element) => expect(element.text()).to.equal(word));
        });
      });
    });
  }
);

Cypress.Commands.add("scNoIntermediates", () => {
  cy.get(`thead > tr > :nth-child(2)`).then((element) =>
    expect(element.text()).to.equal("Output Word")
  );
});

Cypress.Commands.add("scShowsSyntaxError", () => {
  cy.get("#status").invoke("text").should("match", /line/);
});

Cypress.Commands.add(
  "createEvolutionWithApi",
  (language: string, evolution: Evolution) => {
    const evolutionWithLanguageId: Evolution = {
      languageId: languages.getId(language),
      ...evolution,
    };
    cy.request({
      url: "/api/evolutions",
      method: "POST",
      body: evolutionWithLanguageId,
    });
  }
);

Cypress.Commands.add("goToScExamples", (exampleName?: string) => {
  const url = exampleName
    ? `/sc/examples?id=${languages.getId(exampleName)}`
    : "/sc/examples";
  cy.visit(url);
});

Cypress.Commands.add("scExampleUrlHas", (exampleName: string) => {
  cy.url().should(
    (url) => expect(url.endsWith(languages.getId(exampleName))).to.be.true
  );
});

Cypress.Commands.add("goToInflectPublic", () => {
  cy.visit("/inflect");
});

Cypress.Commands.add("runInflect", (inputs: UserInflectInputs) => {
  for (const [dimension, categories] of Object.entries(inputs.dimensions)) {
    cy.get("#dimensions input").last().type(dimension);
    for (const category of categories) {
      cy.get("#dimensions input").last().type(category);
      cy.get("#dimensions button").click();
    }
  }
  for (const stemAndCategories of inputs.stemsAndCategories) {
    let stem, categories: string[];
    if (typeof stemAndCategories === "string") {
      stem = stemAndCategories;
      categories = [];
    } else {
      stem = stemAndCategories.stem;
      categories = stemAndCategories.categories;
    }
    cy.get("table input").last().type(stem);
    for (const category of categories) {
      cy.get("table select").last().select(category);
    }
    cy.contains("Add Form").click();
  }
  enterInflectRules(inputs.rules);
  cy.contains("Apply").click();
});

function enterInflectRules(rules: InflectRules, parentId: string = "rules") {
  if (typeof rules === "string") {
    cy.get(`#${parentId}__option`).type(rules);
  } else if ("formula" in rules) {
    cy.get(`#${parentId} > select`).select("Formula");
    enterFormula(rules.formula, `${parentId}__option__formula`);
  } else {
    cy.get(`#${parentId} > select`).select("Branch");
    [...rules.branches.entries()].forEach(([category, branch], i) => {
      cy.get(`#${parentId}__option__branches__${i}__key`).type(category);
      enterInflectRules(branch, `${parentId}__option__branches__${i}__value`);
      cy.contains("Add Branch").click();
    });
  }
}

function enterFormula(formula: Formula["formula"], parentId: string) {
  if (formula.type === "stem") {
    cy.get(`#${parentId} > select`).select("Stem");
  } else if (formula.type === "form") {
    cy.get(`#${parentId} > select`).select("Fixed Form");
    cy.get(`#${parentId}__option__form`).type(formula.form);
  } else if (formula.type === "concat") {
    cy.get(`#${parentId} > select`).select("Concatenation");
    formula.parts.forEach((part, i) => {
      if (i > 0) {
        cy.contains("Add Part").click();
      }
      enterFormula(part.formula, `${parentId}__option__parts__${i}__formula`);
    });
  }
}

Cypress.Commands.add("inflectedFormsAre", (forms: string[]) => {
  cy.contains(forms[0]);
  forms.forEach((form, i) => {
    cy.get(`#morphs tbody > :nth-child(${i + 1}) > :last`).then((element) =>
      expect(element.text()).to.equal(form)
    );
  });
});

Cypress.Commands.add("waitForApiResult", (url: string, name: string) => {
  cy.intercept(url).as(name);
  cy.wait(`@${name}`);
});

export {};
