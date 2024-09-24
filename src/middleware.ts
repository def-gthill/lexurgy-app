import { withAuth } from "next-auth/middleware";

const publicPages = [
  "/",
  "/sc",
  "/sc/examples",
  "/sc/docs*",
  "/inflect",
  "/api/services",
  "/api/daily",
  "/api/scExampleWorlds",
  "/logo.png",
];

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (publicPages.includes(req.nextUrl.pathname)) {
        return true;
      }
      if (!token?.email) {
        return false;
      }
      return true;
    },
  },
});
