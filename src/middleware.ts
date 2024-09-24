import { withAuth } from "next-auth/middleware";

const publicPages = [
  "/",
  "/sc",
  "/sc/examples",
  "/inflect",
  "/api/services",
  "/api/daily",
  "/api/scExampleWorlds",
  "/logo.png",
];

const publicPaths = ["/sc/docs"];

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (publicPages.includes(req.nextUrl.pathname)) {
        return true;
      }
      for (const path of publicPaths) {
        if (req.nextUrl.pathname.startsWith(path)) {
          return true;
        }
      }
      if (!token?.email) {
        return false;
      }
      return true;
    },
  },
});
