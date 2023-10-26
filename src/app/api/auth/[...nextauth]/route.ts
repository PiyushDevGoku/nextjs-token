import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Credentials:", credentials); // Debugging line
        try {
          const { data } = await axios.post(
            "http://localhost:3000/api/users/login",
            {
              email: credentials?.email as string,
              password: credentials?.password as string,
            }
          );

          console.log("Sending Data:", {
            email: credentials?.email as string,
            password: credentials?.password as string,
          });

          // console.log("API Response:", data.token);

          if (data) {
            return Promise.resolve({
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              accesstoken: data.token,
            });
          } else {
            return Promise.resolve(null);
          }
        } catch (error: any) {
          console.error("API Response Data:", error.response?.data);
          console.error("Full API Error:", JSON.stringify(error, null, 2));
          throw new Error("Login failed");
        }
      },
    }),
  ],

  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        return Promise.resolve({
          ...session,
          user: {
            ...session.user,
            id: token.id,
            accesstoken: token.accesstoken,
          },
        });
      }
      return Promise.resolve(session);
    },
    jwt: async ({ token, user }) => {
      console.log("JWT Callback", { token, user });
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          accesstoken: u.accesstoken, // add this line
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_URL,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
