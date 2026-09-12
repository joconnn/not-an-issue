import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { db } from "@not-an-issue/db";
import { workspaceService } from "../src/modules/workspace/workspace.service.js";
import { createTestUser, deleteTestUsers } from "./helpers/test-users.js";

test("createWorkspace creates a workspace and adds the user as owner", async () => {
  // Arrange Values

  const userId = randomUUID();

  const workspaceName = `Test Workspace ${randomUUID()}`;

  let workspaceId: string | undefined;

  await createTestUser(userId);

  try {
    // Act

    const workspace = await workspaceService.createWorkspace({
      userId,
      name: workspaceName,
    });

    workspaceId = workspace.id;

    // Assert that workspace and membership roles have persisted
    const persistedWorkspace = await db
      .selectFrom("workspace")
      .selectAll()
      .where("id", "=", workspace.id)
      .executeTakeFirstOrThrow();

    const membership = await db
      .selectFrom("workspace_member")
      .selectAll()
      .where("workspace_id", "=", workspace.id)
      .where("user_id", "=", userId)
      .executeTakeFirstOrThrow();

    expect(persistedWorkspace.name).toBe(workspaceName);
    expect(membership.role).toBe("owner");
    expect(membership.user_id).toBe(userId);
    expect(membership.workspace_id).toBe(workspace.id);
  } finally {
    // Deleting the workspace cascades to workspace_member as per our schema
    if (workspaceId) {
      await db.deleteFrom("workspace").where("id", "=", workspaceId).execute();
    }
    await deleteTestUsers([userId]);
  }
});

test("createWorkspace rolls back when owner membership cannot be created", async () => {
  const missingUserId = randomUUID();
  const workspaceName = `Rollback Workspace ${randomUUID()}`;

  try {
    // No user fixture exists, so the membership foreign key must fail.
    await expect(
      workspaceService.createWorkspace({
        userId: missingUserId,
        name: workspaceName,
      }),
    ).rejects.toThrow();

    // The earlier workspace insertion should have been rolled back.
    const persistedWorkspace = await db
      .selectFrom("workspace")
      .select("id")
      .where("name", "=", workspaceName)
      .executeTakeFirst();

    expect(persistedWorkspace).toBeUndefined();
  } finally {
    // Defensive cleanup in case the transaction implementation is broken.
    await db
      .deleteFrom("workspace")
      .where("name", "=", workspaceName)
      .execute();
  }
});

test("getWorkspaces returns every workspace the user belongs to and excludes other users' workspaces", async () => {
  // Arrange
  // Create two users to make sure we do not get other users data
  const userAId = randomUUID();
  const userBId = randomUUID();

  const workspaceIds: string[] = [];

  try {
    await createTestUser(userAId, "Test User A");
    await createTestUser(userBId, "Test User B");

    const userAWorkspaceOne = await workspaceService.createWorkspace({
      userId: userAId,
      name: `User A Workspace One ${randomUUID()}`,
    });

    workspaceIds.push(userAWorkspaceOne.id);

    const userAWorkspaceTwo = await workspaceService.createWorkspace({
      userId: userAId,
      name: `User A Workspace Two ${randomUUID()}`,
    });

    workspaceIds.push(userAWorkspaceTwo.id);

    const userBWorkspace = await workspaceService.createWorkspace({
      userId: userBId,
      name: `User B Workspace ${randomUUID()}`,
    });

    workspaceIds.push(userBWorkspace.id);

    // Act
    const workspaces = await workspaceService.getWorkspaces({
      userId: userAId,
    });

    // Assert
    expect(workspaces).toHaveLength(2);

    expect(workspaces).toEqual(
      expect.arrayContaining([
        {
          id: userAWorkspaceOne.id,
          name: userAWorkspaceOne.name,
          role: "owner",
          created_at: userAWorkspaceOne.created_at,
        },
        {
          id: userAWorkspaceTwo.id,
          name: userAWorkspaceTwo.name,
          role: "owner",
          created_at: userAWorkspaceTwo.created_at,
        },
      ]),
    );

    expect(
      workspaces.some((workspace) => workspace.id === userBWorkspace.id),
    ).toBe(false);
  } finally {
    try {
      if (workspaceIds.length > 0) {
        await db
          .deleteFrom("workspace")
          .where("id", "in", workspaceIds)
          .execute();
      }
    } finally {
      await deleteTestUsers([userAId, userBId]);
    }
  }
});
