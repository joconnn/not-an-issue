import { db } from "@not-an-issue/db";
import {
  CreateProjectIssueInput,
  GetIssueInput,
  GetProjectIssuesInput,
  UpdateIssueInput,
} from "./types.js";
import {
  InvalidIssueUpdateError,
  IssueGetForbiddenError,
  IssueUpdateForbiddenError,
  ProjectIssueCreationForbiddenError,
  ProjectIssueGetForbiddenError,
} from "./issue.errors.js";

class IssueService {
  async createProjectIssue({
    title,
    description,
    userId,
    projectId,
  }: CreateProjectIssueInput) {
    const permission = await db
      .selectFrom("project")
      .innerJoin(
        "workspace_member",
        "project.workspace_id",
        "workspace_member.workspace_id",
      )
      .select("project.id")
      .where("project.id", "=", projectId)
      .where("workspace_member.user_id", "=", userId)
      .where("workspace_member.role", "in", ["member", "owner"])
      .executeTakeFirst();

    if (!permission) {
      throw new ProjectIssueCreationForbiddenError();
    }

    const newIssue = await db
      .insertInto("issue")
      .values({
        title,
        description,
        project_id: projectId,
        created_by: userId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newIssue;
  }

  async getProjectIssues({ userId, projectId }: GetProjectIssuesInput) {
    const permission = await db
      .selectFrom("project")
      .innerJoin(
        "workspace_member",
        "project.workspace_id",
        "workspace_member.workspace_id",
      )
      .select("project.id")
      .where("project.id", "=", projectId)
      .where("workspace_member.user_id", "=", userId)
      .where("workspace_member.role", "in", ["member", "owner", "viewer"])
      .executeTakeFirst();

    if (!permission) {
      throw new ProjectIssueGetForbiddenError();
    }

    return await db
      .selectFrom("issue")
      .selectAll()
      .where("issue.project_id", "=", projectId)
      .orderBy("issue.updated_at", "desc")
      .execute();
  }

  async getIssue({ userId, issueId }: GetIssueInput) {
    const issue = await db
      .selectFrom("issue")
      .innerJoin("project", "issue.project_id", "project.id")
      .innerJoin(
        "workspace_member",
        "project.workspace_id",
        "workspace_member.workspace_id",
      )
      .selectAll("issue")
      .where("issue.id", "=", issueId)
      .where("workspace_member.user_id", "=", userId)
      .where("workspace_member.role", "in", ["owner", "member", "viewer"])
      .executeTakeFirst();

    if (!issue) {
      throw new IssueGetForbiddenError();
    }

    const comments = await db
      .selectFrom("comment")
      .selectAll()
      .where("comment.issue_id", "=", issueId)
      .orderBy("comment.created_at", "asc")
      .execute();

    return {
      ...issue,
      comments,
    };
  }

  async updateIssue({
    userId,
    issueId,
    title,
    description,
    status,
  }: UpdateIssueInput) {
    if (
      title === undefined &&
      description === undefined &&
      status === undefined
    ) {
      throw new InvalidIssueUpdateError();
    }

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
      throw new IssueUpdateForbiddenError();
    }

    const updatedIssue = await db
      .updateTable("issue")
      .set({
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
        updated_at: new Date(),
      })
      .where("id", "=", issueId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedIssue;
  }
}

export const issueService = new IssueService();
