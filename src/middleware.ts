import { withAuth } from "next-auth/middleware";

const publicPages = ["/sc", "/inflect", "/api/services", "/api/daily"];

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (publicPages.includes(req.nextUrl.pathname)) {
        return true;
      }
      if (!token?.email) {
        return false;
      }
      return (
        token.email === process.env.NEXTAUTH_ADMIN_EMAIL ||
        process.env.NEXTAUTH_EXPERIMENTAL_FEATURE_EMAILS?.split(",")?.includes(
          token.email
        ) ||
        process.env.NEXTAUTH_TEST_USER_EMAILS?.split(",")?.includes(
          token.email
        ) ||
        false
      );
    },
  },
});
