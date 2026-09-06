import { AuthSession } from "../modules/auth/require-session.ts";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
declare module "fastify" {
  interface FastifyRequest {
    authSession: AuthSession;
  }
}
