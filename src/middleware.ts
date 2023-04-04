import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return (
        process.env.NODE_ENV === "development" ||
        token?.email === process.env.NEXTAUTH_ADMIN_EMAIL
      );
    },
  },
});
