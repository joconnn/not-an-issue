import { AuthSession } from "../auth/require-session.js";

export interface CreateWorkspaceUser {
  user: AuthSession["user"];
  name: string;
}
