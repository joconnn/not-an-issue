import Fastify from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export function buildApplication() {
  const app = Fastify({ logger: true });

  app.get("/", async () => {
    return { hello: "world" };
  });

  app.get("/api/me", async (request, reply) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    return reply.send(session);
  });

  // Register authentication endpoint
  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = fromNodeHeaders(request.headers);
        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });
        // Process authentication request
        const response = await auth.handler(req);
        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        return reply.send(response.body ? await response.text() : null);
      } catch (error) {
        app.log.error("Authentication Error:", error);
        return reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });

  return app;
}
