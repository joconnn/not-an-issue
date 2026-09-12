// POST  /api/projects/:projectId/issues
// GET   /api/projects/:projectId/issues

// Create issue to project
// schema: params: projectid, body: title, description (nullable)

import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  CreateProjectIssueBody,
  CreateProjectIssueParams,
} from "./issues.schema.js";
import {
  ProjectIssueCreationForbiddenError,
  ProjectIssueGetForbiddenError,
} from "./issue.errors.js";
import { issueService } from "./issues.service.js";

export const issueRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/projects/:projectId/issues",
    {
      schema: {
        body: CreateProjectIssueBody,
        params: CreateProjectIssueParams,
      },
    },
    async (request, reply) => {
      const { title, description } = request.body;
      const { projectId } = request.params;
      const userId = request.authSession.user.id;

      try {
        const issue = await issueService.createProjectIssue({
          title,
          description: description ?? null,
          projectId,
          userId,
        });

        return reply.code(201).send(issue);
      } catch (e) {
        if (e instanceof ProjectIssueCreationForbiddenError) {
          return reply.code(403).send({
            error: "Forbidden",
            message: e.message,
          });
        }

        throw e;
      }
    },
  );
  app.get(
    "/projects/:projectId/issues",
    {
      schema: {
        params: CreateProjectIssueParams,
      },
    },
    async (request, reply) => {
      const { projectId } = request.params;
      const userId = request.authSession.user.id;

      try {
        const issue = await issueService.getProjectIssues({
          userId,
          projectId,
        });

        return reply.send(issue);
      } catch (e) {
        if (e instanceof ProjectIssueGetForbiddenError) {
          return reply.code(403).send({
            error: "Forbidden",
            message: e.message,
          });
        }

        throw e;
      }
    },
  );
};
