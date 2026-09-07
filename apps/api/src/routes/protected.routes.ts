import { FastifyPluginAsync } from "fastify";
import { requireSession } from "../modules/auth/require-session.js";
import { meRoutes } from "../modules/auth/me.routes.js";
import { workspaceRoutes } from "../modules/workspace/workspace.routes.js";

export const protectedRoutes: FastifyPluginAsync = async (app) => {
  app.decorateRequest("authSession");
  app.addHook("onRequest", requireSession);

  app.register(meRoutes);
  // TODO: Create workspace routes and add here
  app.register(workspaceRoutes, { prefix: "/workspaces" });
};
