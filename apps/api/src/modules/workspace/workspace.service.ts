// The service needs access to the db
// The service needs to receive valid input
// The route has the user and needs to pass this down to service
// Validate at the data layer as they say

import { db } from "@not-an-issue/db";
import { CreateWorkspaceInput, GetWorkspaceInput } from "./types.js";

class WorkspaceService {
  async createWorkspace({ userId, name }: CreateWorkspaceInput) {
    const data = await db.transaction().execute(async (trx) => {
      const workspace = await trx
        .insertInto("workspace")
        .values({
          name,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("workspace_member")
        .values({
          user_id: userId,
          workspace_id: workspace.id,
          role: "owner",
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return workspace;
    });

    return data;
  }

  async getWorkspaces({ userId }: GetWorkspaceInput) {
    // I need to find workspaces membership with my userid
    // We need to join these values with workspaces
    // We want workspace id | name | user id | role

    const data = await db
      // Select from workspace member table
      .selectFrom("workspace_member")
      // Join on workspace table using the same keys from both tables
      .innerJoin("workspace", "workspace_member.workspace_id", "workspace.id")
      // Internal service callers also use membership metadata. The route's
      // response schema limits the public HTTP response to id and name.
      .select([
        "workspace.id",
        "workspace.name",
        "workspace_member.role",
        "workspace.created_at",
      ])
      .where("workspace_member.user_id", "=", userId)
      // Order by the most recent
      .orderBy("workspace.created_at", "desc")
      // execute will return [] or results
      .execute();

    return data;
  }
}

export const workspaceService = new WorkspaceService();
