import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    defaultUserEmail: process.env.NEXTAUTH_ADMIN_EMAIL,
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    video: false,
    defaultCommandTimeout: 6000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {},
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    video: false,
  },
});
