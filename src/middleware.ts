import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (["/sc", "/api/services"].includes(req.nextUrl.pathname)) {
        return true;
      }
      if (!token?.email) {
        return false;
      }
      return (
        token.email === process.env.NEXTAUTH_ADMIN_EMAIL ||
        process.env.NEXTAUTH_TEST_USER_EMAILS?.split(",")?.includes(
          token.email
        ) ||
        false
      );
    },
  },
});
