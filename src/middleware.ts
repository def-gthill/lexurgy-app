import { withAuth } from "next-auth/middleware";

const publicPages = [
  "/sc",
  "/sc/examples",
  "/inflect",
  "/api/services",
  "/api/daily",
  "/api/scExampleWorlds",
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
