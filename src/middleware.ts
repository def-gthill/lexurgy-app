import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      // if (process.env.NODE_ENV === "development") {
      //   return true;
      // }
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
