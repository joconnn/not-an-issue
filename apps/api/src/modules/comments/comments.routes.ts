import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  IssueCommentCreationForbiddenError,
  IssueCommentGetForbiddenError,
} from "./comment.errors.js";
import {
  CreateIssueCommentBody,
  IssueCommentParams,
} from "./comments.schema.js";
import { commentService } from "./comments.service.js";

export const commentRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/issues/:issueId/comments",
    {
      schema: {
        params: IssueCommentParams,
        body: CreateIssueCommentBody,
      },
    },
    async (request, reply) => {
      const { issueId } = request.params;
      const { body } = request.body;
      const userId = request.authSession.user.id;

      try {
        const comment = await commentService.createIssueComment({
          userId,
          issueId,
          body,
        });

        return reply.code(201).send(comment);
      } catch (e) {
        if (e instanceof IssueCommentCreationForbiddenError) {
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
    "/issues/:issueId/comments",
    {
      schema: {
        params: IssueCommentParams,
      },
    },
    async (request, reply) => {
      const { issueId } = request.params;
      const userId = request.authSession.user.id;

      try {
        const comments = await commentService.getIssueComments({
          userId,
          issueId,
        });

        return reply.send(comments);
      } catch (e) {
        if (e instanceof IssueCommentGetForbiddenError) {
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
