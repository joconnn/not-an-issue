import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CreateProjectBody, ProjectParams } from "./projects.schema.js";
import { projectService } from "./project.service.js";
import { ProjectCreationForbiddenError } from "./project.errors.js";

export const projectRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/:workspaceId/projects",
    {
      schema: {
        body: CreateProjectBody,
        params: ProjectParams,
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
  app.get(
    "/:workspaceId/projects",
    {
      schema: {
        params: ProjectParams,
      },
    },
    async (request, reply) => {
      const { workspaceId } = request.params;

      const projects = await projectService.getProjects({ workspaceId });

      return reply.code(200).send(projects);
    },
  );
};
