import NextAuth, { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const providers: Provider[] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID || "",
    clientSecret: process.env.GOOGLE_SECRET || "",
  }),
];

if (process.env.NODE_ENV === "development") {
  // In development mode, you can claim to be whoever you want!
  providers.push(
    CredentialsProvider({
      name: "Email",
      credentials: { email: { label: "Email", type: "text" } },
      async authorize(credentials: { email: string } | undefined) {
        if (!credentials) {
          return null;
        }
        return { id: credentials.email, email: credentials.email };
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
};

export default NextAuth(authOptions);
