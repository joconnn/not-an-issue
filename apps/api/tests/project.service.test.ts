import { expect, test } from "vitest";
import { randomUUID } from "node:crypto";
import { db, pool } from "@not-an-issue/db";
import { workspaceService } from "../src/modules/workspace/workspace.service";
import { projectService } from "../src/modules/projects/project.service";
import {
  ProjectCreationForbiddenError,
  ProjectGetForbiddenError,
} from "../src/modules/projects/project.errors";

test("createProject creates a project and returns the project row", async () => {
  // create our user
  // create a workspace
  // set role as owner
  // run project service

  // Arrange values
  const userId = randomUUID();
  const email = `${userId}@example.test`;

  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  // Create our better auth user row
  await pool.query(
    `
        insert into "user" ("id", "name", "email", "emailVerified")
        values ($1, $2, $3, $4)
      `,
    [userId, "Test User", email, false],
  );

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
      await pool.query(`delete from "user" where "id" = $1`, [userId]);
    }
  }
});

test("createProject throws error when role is not owner or member", async () => {
  const userA = randomUUID();
  const emailA = `${userA}@example.test`;
  const userB = randomUUID();
  const emailB = `${userB}@example.test`;
  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  // Create our better auth user row
  await pool.query(
    `
        insert into "user" ("id", "name", "email", "emailVerified")
        values ($1, $2, $3, $4)
      `,
    [userA, "Test User", emailA, false],
  );
  await pool.query(
    `
        insert into "user" ("id", "name", "email", "emailVerified")
        values ($1, $2, $3, $4)
      `,
    [userB, "Test User", emailB, false],
  );

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
      await pool.query(`delete from "user" where "id" = $1`, [userA]);
      await pool.query(`delete from "user" where "id" = $1`, [userB]);
    }
  }
});

test("getProjects returns all projects that you are a workspace member in", async () => {
  const userId = randomUUID();
  const email = `${userId}@example.test`;

  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  // Create our better auth user row
  await pool.query(
    `
        insert into "user" ("id", "name", "email", "emailVerified")
        values ($1, $2, $3, $4)
      `,
    [userId, "Test User", email, false],
  );

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
      await pool.query(`delete from "user" where "id" = $1`, [userId]);
    }
  }
});

test("getProjects throws error when you do not have a role in the workspace", async () => {
  const userA = randomUUID();
  const emailA = `${userA}@example.test`;
  const userB = randomUUID();
  const emailB = `${userB}@example.test`;
  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  // Create our better auth user row
  await pool.query(
    `
        insert into "user" ("id", "name", "email", "emailVerified")
        values ($1, $2, $3, $4)
      `,
    [userA, "Test User", emailA, false],
  );
  await pool.query(
    `
        insert into "user" ("id", "name", "email", "emailVerified")
        values ($1, $2, $3, $4)
      `,
    [userB, "Test User", emailB, false],
  );

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
      await pool.query(`delete from "user" where "id" = $1`, [userA]);
      await pool.query(`delete from "user" where "id" = $1`, [userB]);
    }
  }
});
