import { db } from "@not-an-issue/db";
import { CreateProjectIssueInput, GetProjectIssuesInput } from "./types.js";
import {
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
}

export const issueService = new IssueService();
