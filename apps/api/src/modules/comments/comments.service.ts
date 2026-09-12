import { db } from "@not-an-issue/db";
import {
  IssueCommentCreationForbiddenError,
  IssueCommentGetForbiddenError,
} from "./comment.errors.js";
import {
  CreateIssueCommentInput,
  GetIssueCommentsInput,
} from "./types.js";

class CommentService {
  async createIssueComment({
    userId,
    issueId,
    body,
  }: CreateIssueCommentInput) {
    const permission = await db
      .selectFrom("issue")
      .innerJoin("project", "issue.project_id", "project.id")
      .innerJoin(
        "workspace_member",
        "project.workspace_id",
        "workspace_member.workspace_id",
      )
      .select("issue.id")
      .where("issue.id", "=", issueId)
      .where("workspace_member.user_id", "=", userId)
      .where("workspace_member.role", "in", ["owner", "member"])
      .executeTakeFirst();

    if (!permission) {
      throw new IssueCommentCreationForbiddenError();
    }

    const comment = await db
      .insertInto("comment")
      .values({
        issue_id: issueId,
        author_id: userId,
        body,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return comment;
  }

  async getIssueComments({ userId, issueId }: GetIssueCommentsInput) {
    const permission = await db
      .selectFrom("issue")
      .innerJoin("project", "issue.project_id", "project.id")
      .innerJoin(
        "workspace_member",
        "project.workspace_id",
        "workspace_member.workspace_id",
      )
      .select("issue.id")
      .where("issue.id", "=", issueId)
      .where("workspace_member.user_id", "=", userId)
      .where("workspace_member.role", "in", ["owner", "member", "viewer"])
      .executeTakeFirst();

    if (!permission) {
      throw new IssueCommentGetForbiddenError();
    }

    return db
      .selectFrom("comment")
      .selectAll()
      .where("comment.issue_id", "=", issueId)
      .orderBy("comment.created_at", "asc")
      .execute();
  }
}

export const commentService = new CommentService();
