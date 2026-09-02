import Fastify from "fastify";

export function buildApplication() {
  const app = Fastify({ logger: true });

  app.get("/", async () => {
    return { hello: "world" };
  });

  return app;
}
