import { defineConfig } from "cypress";
// require("dotenv").config({ path: ".env.local" });

export default defineConfig({
  // env: {
  //   googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  //   googleClientId: process.env.GOOGLE_ID,
  //   googleClientSecret: process.env.GOOGLE_SECRET,
  //   cookieName: "next-auth.session-token",
  // },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
