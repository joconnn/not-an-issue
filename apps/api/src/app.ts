import Fastify from "fastify";
import { authRoutes } from "./modules/auth/index.js";
import { protectedRoutes } from "./routes/protected.routes.js";

export function buildApplication() {
  const app = Fastify({ logger: true });

  app.get("/", async () => {
    return { hello: "world" };
  });

  app.register(authRoutes, {
    prefix: "/api",
  });

  app.register(protectedRoutes, {
    prefix: "/api",
  });

  return app;
}
