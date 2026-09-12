import { randomUUID } from "node:crypto";
import { db } from "@not-an-issue/db";
import { expect, test } from "vitest";
import { ProjectIssueCreationForbiddenError } from "../src/modules/issues/issue.errors.js";
import { issueService } from "../src/modules/issues/issues.service.js";
import { projectService } from "../src/modules/projects/project.service.js";
import { workspaceService } from "../src/modules/workspace/workspace.service.js";
import { createTestUser, deleteTestUsers } from "./helpers/test-users.js";

test("createProjectIssue creates an issue for a workspace member", async () => {
  const ownerId = randomUUID();
  const memberId = randomUUID();
  const workspaceName = `Issue Test Workspace ${randomUUID()}`;
  const projectName = `Issue Test Project ${randomUUID()}`;
  const issueTitle = `Issue ${randomUUID()}`;

  let workspaceId: string | undefined;

  try {
    await createTestUser(ownerId, "Test Owner");
    await createTestUser(memberId, "Test Member");

    const workspace = await workspaceService.createWorkspace({
      userId: ownerId,
      name: workspaceName,
    });

    workspaceId = workspace.id;

    await db
      .insertInto("workspace_member")
      .values({
        workspace_id: workspace.id,
        user_id: memberId,
        role: "member",
      })
      .executeTakeFirstOrThrow();

    const project = await projectService.createProject({
      name: projectName,
      userId: ownerId,
      workspaceId: workspace.id,
    });

    const issue = await issueService.createProjectIssue({
      title: issueTitle,
      description: "Issue created by a workspace member",
      userId: memberId,
      projectId: project.id,
    });

    expect(issue).toMatchObject({
      title: issueTitle,
      description: "Issue created by a workspace member",
      project_id: project.id,
      created_by: memberId,
      status: "open",
    });

    const persistedIssue = await db
      .selectFrom("issue")
      .selectAll()
      .where("id", "=", issue.id)
      .executeTakeFirstOrThrow();

    expect(persistedIssue).toEqual(issue);
  } finally {
    try {
      if (workspaceId) {
        await db
          .deleteFrom("workspace")
          .where("id", "=", workspaceId)
          .execute();
      }
    } finally {
      await deleteTestUsers([ownerId, memberId]);
    }
  }
});

test("createProjectIssue throws an error when a non-member tries to create an issue", async () => {
  const ownerId = randomUUID();
  const nonMemberId = randomUUID();
  const workspaceName = `Forbidden Issue Workspace ${randomUUID()}`;
  const projectName = `Forbidden Issue Project ${randomUUID()}`;
  const issueTitle = `Forbidden Issue ${randomUUID()}`;

  let workspaceId: string | undefined;

  try {
    await createTestUser(ownerId, "Test Owner");
    await createTestUser(nonMemberId, "Test Non-Member");

    const workspace = await workspaceService.createWorkspace({
      userId: ownerId,
      name: workspaceName,
    });

    workspaceId = workspace.id;

    const project = await projectService.createProject({
      name: projectName,
      userId: ownerId,
      workspaceId: workspace.id,
    });

    await expect(
      issueService.createProjectIssue({
        title: issueTitle,
        description: null,
        userId: nonMemberId,
        projectId: project.id,
      }),
    ).rejects.toBeInstanceOf(ProjectIssueCreationForbiddenError);

    const persistedIssue = await db
      .selectFrom("issue")
      .select("id")
      .where("project_id", "=", project.id)
      .where("title", "=", issueTitle)
      .executeTakeFirst();

    expect(persistedIssue).toBeUndefined();
  } finally {
    try {
      if (workspaceId) {
        await db
          .deleteFrom("workspace")
          .where("id", "=", workspaceId)
          .execute();
      }
    } finally {
      await deleteTestUsers([ownerId, nonMemberId]);
    }
  }
});
