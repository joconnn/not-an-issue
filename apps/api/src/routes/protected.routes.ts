import { FastifyPluginAsync } from "fastify";
import { requireSession } from "../modules/auth/require-session.js";
import { meRoutes } from "../modules/auth/me.routes.js";
import { workspaceRoutes } from "../modules/workspace/workspace.routes.js";
import { projectRoutes } from "../modules/projects/projects.routes.js";
import { issueRoutes } from "../modules/issues/issues.routes.js";
import { commentRoutes } from "../modules/comments/comments.routes.js";

export const protectedRoutes: FastifyPluginAsync = async (app) => {
  app.decorateRequest("authSession");
  app.addHook("onRequest", requireSession);

  app.register(meRoutes);
  // TODO: Create workspace routes and add here
  app.register(workspaceRoutes, { prefix: "/workspaces" });
  app.register(projectRoutes, { prefix: "/workspaces" });
  app.register(issueRoutes);
  app.register(commentRoutes);
};
