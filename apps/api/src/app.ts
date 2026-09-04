import Fastify from "fastify";
import { authRoutes } from "./modules/auth/auth.routes.js";

export function buildApplication() {
  const app = Fastify({ logger: true });

  app.get("/", async () => {
    return { hello: "world" };
  });

  app.register(authRoutes, {
    prefix: "/api",
  });

  return app;
}
