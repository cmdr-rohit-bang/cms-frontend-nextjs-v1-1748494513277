import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    token: string;
    name?: string;
    email?: string;
    image?: string;
    role: string;
    data: {
      name: string;
    };
  }

  interface Session {
    user: {
      token: string;
      name: string;
      email: string;
      image: string;
      role: string;
      data: {
        name: string;
      };
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface jwt {
    token: string;
    name?: string;
    email?: string;
    image?: string;
    role: string;
    data: {
      name: string;
    };
  }
}
