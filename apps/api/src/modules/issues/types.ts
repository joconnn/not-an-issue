import { AuthSession } from "../auth/require-session.js";

export interface CreateProjectIssueInput {
  title: string;
  description: string | null;
  userId: AuthSession["user"]["id"];
  projectId: string;
}

export interface GetProjectIssuesInput {
  userId: AuthSession["user"]["id"];
  projectId: string;
}
