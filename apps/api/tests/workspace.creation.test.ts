import { test, expect } from "vitest";
import { workspaceService } from "../src/modules/workspace/workspace.service";
import { db } from "@not-an-issue/db";

// mocked userId for better auth tables
const userId = "XwQfJ6d4htPfoqjm0Y6XFMNyIw23prNo";
// workspace id could be undefined if transaction fails
let workspaceId: string | undefined;

test("workspace is created and membership role is owner", async () => {
  try {
    // Call service and create workspace
    const workspace = await workspaceService.createWorkspace({
      userId,
      name: "Test Workspace",
    });
    // Assign id or undefined
    workspaceId = workspace.id;
    // Retrieve membership that matches workspace id and user id
    const membership = await db
      .selectFrom("workspace_member")
      .selectAll()
      .where("workspace_id", "=", workspace.id)
      .where("user_id", "=", userId)
      .executeTakeFirstOrThrow();

    expect(workspace.name).toBe("Test Workspace");
    expect(membership.role).toBe("owner");
    expect(membership.user_id).toBe(userId);
    expect(membership.workspace_id).toBe(workspace.id);
  } finally {
    // If we have a workspace delete it from the db
    if (workspaceId) {
      await db.deleteFrom("workspace").where("id", "=", workspaceId).execute();
    }
  }
});
