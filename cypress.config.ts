import { defineConfig } from "cypress";
// require("dotenv").config({ path: ".env.local" });

export default defineConfig({
  env: {
    defaultUserEmail: process.env.NEXTAUTH_ADMIN_EMAIL,
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    video: false,
  },
});
