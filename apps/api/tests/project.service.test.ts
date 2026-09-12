import { expect, test } from "vitest";
import { randomUUID } from "node:crypto";
import { db } from "@not-an-issue/db";
import { workspaceService } from "../src/modules/workspace/workspace.service";
import { projectService } from "../src/modules/projects/project.service";
import {
  ProjectCreationForbiddenError,
  ProjectGetForbiddenError,
} from "../src/modules/projects/project.errors";
import { createTestUser, deleteTestUsers } from "./helpers/test-users.js";

test("createProject creates a project and returns the project row", async () => {
  // create our user
  // create a workspace
  // set role as owner
  // run project service

  // Arrange values
  const userId = randomUUID();

  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  await createTestUser(userId);

  try {
    const workspace = await workspaceService.createWorkspace({
      userId,
      name: workspaceName,
    });

    workspaceId = workspace.id;

    const project = await projectService.createProject({
      name: "Test Project",
      userId,
      workspaceId,
    });

    expect(project.name).toBe("Test Project");
    expect(project.workspace_id).toBe(workspaceId);
  } finally {
    // Delete workspace, which will delete project as well
    try {
      if (workspaceId) {
        await db
          .deleteFrom("workspace")
          .where("id", "=", workspaceId)
          .execute();
      }
    } finally {
      await deleteTestUsers([userId]);
    }
  }
});

test("createProject throws error when role is not owner or member", async () => {
  const userA = randomUUID();
  const userB = randomUUID();
  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  await createTestUser(userA);
  await createTestUser(userB);

  try {
    const workspace = await workspaceService.createWorkspace({
      userId: userA,
      name: workspaceName,
    });

    workspaceId = workspace.id;

    const project = await projectService.createProject({
      name: "Test Project",
      userId: userA,
      workspaceId,
    });

    // add user b as viewer to project
    await db
      .insertInto("workspace_member")
      .values({
        workspace_id: workspaceId,
        user_id: userB,
        role: "viewer",
      })
      .executeTakeFirstOrThrow();

    // Promise will reject and throw our custom error
    await expect(
      projectService.createProject({
        name: "Forbidden Project",
        userId: userB,
        workspaceId,
      }),
    ).rejects.toBeInstanceOf(ProjectCreationForbiddenError);

    const persistedProject = await db
      .selectFrom("project")
      .select("id")
      .where("workspace_id", "=", workspaceId)
      .where("name", "=", "Forbidden Project")
      .executeTakeFirst();

    expect(persistedProject).toBeUndefined();
  } finally {
    // Delete workspace, which will delete project as well
    try {
      if (workspaceId) {
        await db
          .deleteFrom("workspace")
          .where("id", "=", workspaceId)
          .execute();
      }
    } finally {
      await deleteTestUsers([userA, userB]);
    }
  }
});

test("getProjects returns all projects that you are a workspace member in", async () => {
  const userId = randomUUID();

  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  await createTestUser(userId);

  try {
    const workspace = await workspaceService.createWorkspace({
      userId,
      name: workspaceName,
    });

    workspaceId = workspace.id;

    await projectService.createProject({
      name: "Test Project",
      userId,
      workspaceId,
    });

    const projects = await projectService.getProjects({ userId, workspaceId });

    expect(projects).length(1);
    expect(projects[0].name).toBe("Test Project");
  } finally {
    // Delete workspace, which will delete project as well
    try {
      if (workspaceId) {
        await db
          .deleteFrom("workspace")
          .where("id", "=", workspaceId)
          .execute();
      }
    } finally {
      await deleteTestUsers([userId]);
    }
  }
});

test("getProjects throws error when you do not have a role in the workspace", async () => {
  const userA = randomUUID();
  const userB = randomUUID();
  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  await createTestUser(userA);
  await createTestUser(userB);

  try {
    const workspace = await workspaceService.createWorkspace({
      userId: userA,
      name: workspaceName,
    });

    workspaceId = workspace.id;

    const project = await projectService.createProject({
      name: "Test Project",
      userId: userA,
      workspaceId,
    });

    // Promise will reject and throw our custom error
    await expect(
      projectService.getProjects({
        userId: userB,
        workspaceId,
      }),
    ).rejects.toBeInstanceOf(ProjectGetForbiddenError);
  } finally {
    // Delete workspace, which will delete project as well
    try {
      if (workspaceId) {
        await db
          .deleteFrom("workspace")
          .where("id", "=", workspaceId)
          .execute();
      }
    } finally {
      await deleteTestUsers([userA, userB]);
    }
  }
});
