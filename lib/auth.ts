// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { SignIn } from "./sign-in";
// import { User } from "@/types/types";

// export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//     maxAge: 7 * 24 * 60 * 60, // 7 days to match your API token expiry
//     updateAge: 24 * 60 * 60,
//   },
//   pages: {
//     signIn: "/sign-in",
//     signOut: "/sign-in",
//     error: "/sign-in",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "Email" },
//         password: { label: "Password", type: "password" },
//         tenant: { label: "Tenant", type: "text" },
//         subdomain: { label: "Subdomain", type: "text" ,},
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) {
//           throw new Error("Invalid credentials");
//         }

//         // Convert tenant string to boolean
//         const isTenant = credentials.tenant === "true";

//         const user = await SignIn(
//           credentials.email,
//           credentials.password,
//           isTenant,
//           credentials.subdomain
//         ) as User;

//         if (!user) {
//           throw new Error("Invalid credentials");
//         }

//         // Handle different response structures - store only common essential data
//         const commonData = {
//           id: user.admin.id,
//           email: user.admin.email,
//           accessToken: user.access_token,
//           role: user.admin.role,
//           name:""
//         };

//         // Handle name field difference between tenant and admin responses
//         if (isTenant) {
//           // Tenant response has first_name and last_name
//           commonData.name = `${user.admin.first_name} ${user.admin.last_name}`;
//         } else {
//           // Admin response has single name field
//           commonData.name = user.admin.name;
//         }

//         return commonData;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user, trigger, session }) {
//       // Handle session update
//       if (trigger === "update") {
//         token.name = session.data?.name || token.name;
//         token.email = session.email || token.email;
//         return token;
//       }

//       // Initial sign in - store user data in token
//       if (user) {
//         return {
//           ...token,
//           accessToken: user.accessToken,
//           role: user.role,
//         };
//       }
//       // Check if token is expired (optional - for automatic refresh)
//       if (typeof token.tokenExpiry === 'number' && Date.now() > token.tokenExpiry) {
//         // Token has expired - you might want to handle refresh here
//         // or redirect to sign in
//         console.warn("Access token has expired");
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       // Pass token data to session
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: token.sub,
//           accessToken: token.accessToken,
//           role: token.role,
//         },
//         accessToken: token.accessToken, // Also available at session level
//       };
//     },
//     async redirect({ url, baseUrl }) {
//       console.log("url",url);
//       console.log("baseUrl",baseUrl);
//       return url.startsWith(baseUrl) ? url : `${baseUrl}/admin/dashboard`;
//     },
//   },
// };


import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignIn } from "./sign-in";
import { User } from "@/types/types";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days to match your API token expiry
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
        tenant: { label: "Tenant", type: "text" },
        subdomain: { label: "Subdomain", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        // Convert tenant string to boolean
        const isTenant = credentials.tenant === "true";

        const user = await SignIn(
          credentials.email,
          credentials.password,
          isTenant,
          credentials.subdomain
        ) as User;

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Handle different response structures - store only common essential data
        const commonData = {
          id: user.admin.id,
          email: user.admin.email,
          accessToken: user.access_token,
          role: user.admin.role,
          name: ""
        };

        // Handle name field difference between tenant and admin responses
        if (isTenant) {
          // Tenant response has first_name and last_name
          commonData.name = `${user.admin.first_name} ${user.admin.last_name}`;
        } else {
          // Admin response has single name field
          commonData.name = user.admin.name;
        }

        return commonData;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Handle session update
      if (trigger === "update") {
        token.name = session.data?.name || token.name;
        token.email = session.email || token.email;
        return token;
      }

      // Initial sign in - store user data in token
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          role: user.role,
        };
      }
      // Check if token is expired (optional - for automatic refresh)
      if (typeof token.tokenExpiry === 'number' && Date.now() > token.tokenExpiry) {
        // Token has expired - you might want to handle refresh here
        // or redirect to sign in
        console.warn("Access token has expired");
      }

      return token;
    },
    async session({ session, token }) {
      // Pass token data to session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          accessToken: token.accessToken,
          role: token.role,
        },
        accessToken: token.accessToken, // Also available at session level
      };
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url);
      console.log("Base URL:", baseUrl);
      
      // If url is just the callbackUrl from logout, return it directly
      if (url !== baseUrl && !url.includes('/api/auth/') && !url.includes('/admin/')) {
        // This is likely a logout redirect to home page
        return url;
      }
      
      // For sign-in redirects, use your existing logic
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Default redirect after successful login
      return `${baseUrl}/admin/dashboard`;
    },
  },
};