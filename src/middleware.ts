import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return token?.email === process.env.NEXTAUTH_ADMIN_EMAIL;
    },
  },
});
