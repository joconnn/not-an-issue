import { AuthSession } from "../auth/require-session.js";

export interface CreateWorkspaceInput {
  userId: AuthSession["user"]["id"];
  name: string;
}

export interface GetWorkspaceInput {
  userId: AuthSession["user"]["id"];
}
