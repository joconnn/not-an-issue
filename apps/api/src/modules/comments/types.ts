import { AuthSession } from "../auth/require-session.js";

export interface CreateIssueCommentInput {
  userId: AuthSession["user"]["id"];
  issueId: string;
  body: string;
}

export interface GetIssueCommentsInput {
  userId: AuthSession["user"]["id"];
  issueId: string;
}
