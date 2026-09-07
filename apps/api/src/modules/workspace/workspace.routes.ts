import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { workspaceService } from "./workspace.service.js";
import { CreateWorkspaceBody } from "./workspace.schema.js";

export const workspaceRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        body: CreateWorkspaceBody,
      },
    },
    async (request, reply) => {
      const { name } = request.body;
      const userId = request.authSession.user.id;

      const workspace = await workspaceService.createWorkspace({
        userId,
        name,
      });
      return reply.code(201).send(workspace);
    },
  );
};
