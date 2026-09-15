import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  CreateWorkspaceRequestSchema,
  CreateWorkspaceResponseSchema,
  WorkspaceListResponseSchema,
} from "@not-an-issue/contracts/workspaces";
import { workspaceService } from "./workspace.service.js";

export const workspaceRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        body: CreateWorkspaceRequestSchema,
        response: {
          201: CreateWorkspaceResponseSchema,
        },
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
  app.get(
    "/",
    {
      schema: {
        response: {
          200: WorkspaceListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.authSession.user.id;

      const workspaces = await workspaceService.getWorkspaces({ userId });
      return reply.send(workspaces);
    },
  );
};
