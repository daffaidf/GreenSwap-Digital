import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
    } & (NonNullable<Session["user"]> extends infer U ? U : never);
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
