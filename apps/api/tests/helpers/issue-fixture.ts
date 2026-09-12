import { randomUUID } from "node:crypto";
import { db } from "@not-an-issue/db";
import { issueService } from "../../src/modules/issues/issues.service.js";
import { projectService } from "../../src/modules/projects/project.service.js";
import { workspaceService } from "../../src/modules/workspace/workspace.service.js";
import { createTestUser, deleteTestUsers } from "./test-users.js";

export async function createIssueFixture() {
  const ownerId = randomUUID();
  let workspaceId: string | undefined;

  await createTestUser(ownerId, "Test Owner");

  try {
    const workspace = await workspaceService.createWorkspace({
      userId: ownerId,
      name: `Test Workspace ${randomUUID()}`,
    });

    workspaceId = workspace.id;

    const project = await projectService.createProject({
      userId: ownerId,
      workspaceId: workspace.id,
      name: `Test Project ${randomUUID()}`,
    });

    const issue = await issueService.createProjectIssue({
      userId: ownerId,
      projectId: project.id,
      title: `Test Issue ${randomUUID()}`,
      description: "Test issue description",
    });

    return {
      ownerId,
      workspace,
      project,
      issue,
      async cleanup() {
        try {
          await db
            .deleteFrom("workspace")
            .where("id", "=", workspace.id)
            .execute();
        } finally {
          await deleteTestUsers([ownerId]);
        }
      },
    };
  } catch (error) {
    try {
      if (workspaceId) {
        await db
          .deleteFrom("workspace")
          .where("id", "=", workspaceId)
          .execute();
      }
    } finally {
      await deleteTestUsers([ownerId]);
    }

    throw error;
  }
}
