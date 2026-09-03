import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  workspace: WorkspaceTable;
}

export interface WorkspaceTable {
  id: Generated<string>;
  name: string;
  created_at: Generated<Date>;
}

export type Workspace = Selectable<WorkspaceTable>;
export type NewWorkspace = Insertable<WorkspaceTable>;
export type WorkspaceUpdate = Updateable<WorkspaceTable>;
