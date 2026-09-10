import { AuthSession } from "../auth/require-session.js";

export interface CreateProjectInput {
  userId: AuthSession["user"]["id"];
  name: string;
  workspaceId: string;
}

export interface GetProjectsInput {
  workspaceId: string;
}
