import Fastify from "fastify";
import type {} from "../../src/types/fastify.js";
import { commentRoutes } from "../../src/modules/comments/comments.routes.js";
import type { AuthSession } from "../../src/modules/auth/require-session.js";
import { issueRoutes } from "../../src/modules/issues/issues.routes.js";

export function buildAuthenticatedTestApplication(userId: string) {
  const app = Fastify();

  app.decorateRequest("authSession");
  app.addHook("onRequest", async (request) => {
    request.authSession = {
      user: {
        id: userId,
      },
    } as AuthSession;
  });

  app.register(issueRoutes, { prefix: "/api" });
  app.register(commentRoutes, { prefix: "/api" });

  return app;
}
