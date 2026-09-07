// The service needs access to the db
// The service needs to receive valid input
// The route has the user and needs to pass this down to service
// Validate at the data layer as they say

import { db } from "@not-an-issue/db";
import { CreateWorkspaceInput } from "./types.js";

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
}

export const workspaceService = new WorkspaceService();
