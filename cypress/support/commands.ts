/// <reference types="cypress" />

import UserTranslation from "./UserTranslation";

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
      goToLanguage(name: string): Chainable<void>;
      createTranslation(translation: UserTranslation): Chainable<void>;
      waitForApiResult(url: string, name: string): Chainable<void>;
    }
  }
}

const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

const languages = new Map([["Examplish", examplishUuid]]);

Cypress.Commands.add("resetDb", () => {
  cy.exec("npm run db:reset");
});

Cypress.Commands.add("prepareExamplish", () => {
  cy.exec("npm run db:seed:examplish");
});

Cypress.Commands.add("prepareExamplishLexicon", () => {
  cy.exec("npm run db:seed:examplish:lexicon");
});

Cypress.Commands.add("goToLanguage", (name: string) => {
  const id = languages.get(name);
  cy.visit(`/language/${id}`);
});

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

Cypress.Commands.add("waitForApiResult", (url: string, name: string) => {
  cy.intercept(url).as(name);
  cy.wait(`@${name}`);
});

//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       loginByGoogleApi(): Chainable<void>;
//     }
//   }
// }

// cypress/support/commands.js
// Cypress.Commands.add("loginByGoogleApi", () => {
//   cy.log("Logging in to Google");
//   cy.request({
//     method: "POST",
//     url: "https://www.googleapis.com/oauth2/v4/token",
//     body: {
//       grant_type: "refresh_token",
//       client_id: Cypress.env("googleClientId"),
//       client_secret: Cypress.env("googleClientSecret"),
//       refresh_token: Cypress.env("googleRefreshToken"),
//     },
//   }).then(({ body }) => {
//     const { access_token, id_token } = body;

//     cy.request({
//       method: "GET",
//       url: "https://www.googleapis.com/oauth2/v3/userinfo",
//       headers: { Authorization: `Bearer ${access_token}` },
//     }).then(({ body }) => {
//       cy.log(body);
//       const userItem = {
//         token: id_token,
//         user: {
//           googleId: body.sub,
//           email: body.email,
//           givenName: body.given_name,
//           familyName: body.family_name,
//           imageUrl: body.picture,
//         },
//       };

//       window.localStorage.setItem("googleCypress", JSON.stringify(userItem));
//       cy.setCookie(Cypress.env("cookieName"), JSON.stringify(id_token));
//       cy.visit("/");
//       cy.contains("Sign in").click();
//     });
//   });
// const username = Cypress.env("GOOGLE_USER");
// const password = Cypress.env("GOOGLE_PW");
// const loginUrl = Cypress.env("SITE_NAME");
// const cookieName = Cypress.env("COOKIE_NAME");
// const socialLoginOptions = {
//   username,
//   password,
//   loginUrl,
//   headless: true,
//   logs: false,
//   isPopup: true,
//   loginSelector: `a[href="${Cypress.env(
//     "SITE_NAME"
//   )}/api/auth/signin/google"]`,
//   postLoginSelector: ".unread-count",
// };

// return cy
//   .task("GoogleSocialLogin", socialLoginOptions)
//   .then(({ cookies }) => {
//     cy.clearCookies();

//     const cookie = cookies
//       .filter((cookie) => cookie.name === cookieName)
//       .pop();
//     if (cookie) {
//       cy.setCookie(cookie.name, cookie.value, {
//         domain: cookie.domain,
//         expiry: cookie.expires,
//         httpOnly: cookie.httpOnly,
//         path: cookie.path,
//         secure: cookie.secure,
//       });

//       Cypress.Cookies.defaults({
//         preserve: cookieName,
//       });
//     }
//   });
// });

export {};
