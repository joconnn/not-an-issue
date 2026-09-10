import { db } from "@not-an-issue/db";
import { CreateProjectInput, GetProjectsInput } from "./types.js";
import { ProjectCreationForbiddenError } from "./project.errors.js";

class ProjectService {
  // create project needs: name and user id
  async createProject({ name, userId, workspaceId }: CreateProjectInput) {
    // is user a member of workspace
    // is user an owner or member of workspace
    // then they can create a project

    const permission = await db
      .selectFrom("workspace_member")
      .select("workspace_id")
      .where("user_id", "=", userId)
      .where("workspace_id", "=", workspaceId)
      .where("role", "in", ["owner", "member"])
      .executeTakeFirst();

    if (!permission) {
      throw new ProjectCreationForbiddenError();
    }

    const project = await db
      .insertInto("project")
      .values({
        name,
        workspace_id: permission.workspace_id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return project;
  }

  async getProjects({ workspaceId }: GetProjectsInput) {
    const projects = await db
      .selectFrom("project")
      .selectAll()
      .where("project.workspace_id", "=", workspaceId)
      .execute();

    return projects;
  }
}

export const projectService = new ProjectService();
