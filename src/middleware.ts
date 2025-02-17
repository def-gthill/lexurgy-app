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
  "/favicon.png",
];

const publicPaths = ["/sc/docs"];

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      console.log("Beginning authorization.");
      if (publicPages.includes(req.nextUrl.pathname)) {
        console.log("Public page, no authentication needed.");
        return true;
      }
      for (const path of publicPaths) {
        if (req.nextUrl.pathname.startsWith(path)) {
          console.log("Public page, no authentication needed.");
          return true;
        }
      }
      if (!token?.email) {
        console.log("Not signed in, access denied.");
        return false;
      }
      console.log("Signed in, access granted.");
      return true;
    },
  },
});
