import { AuthSession } from "../modules/auth/require-session.js";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
declare module "fastify" {
  interface FastifyRequest {
    authSession: AuthSession;
  }
}
