import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CreateProjectBody, CreateProjectParams } from "./projects.schema.js";
import { projectService } from "./project.service.js";
import { ProjectCreationForbiddenError } from "./project.errors.js";

export const projectRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/:workspaceId/projects",
    {
      schema: {
        body: CreateProjectBody,
        params: CreateProjectParams,
      },
    },
    async (request, reply) => {
      const { name } = request.body;
      const userId = request.authSession.user.id;
      const { workspaceId } = request.params;

      try {
        const project = await projectService.createProject({
          name,
          userId,
          workspaceId,
        });

        return reply.code(201).send(project);
      } catch (e) {
        app.log.error({ err: e }, "Permissions error");
        // look for our custom error
        if (e instanceof ProjectCreationForbiddenError) {
          return reply.code(403).send({
            error: "Forbidden",
            message: e.message,
          });
        }
        // We must throw the error otherwise kysely error will be swallowed
        throw e;
      }
    },
  );
};
