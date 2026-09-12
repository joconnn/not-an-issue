export class IssueCommentCreationForbiddenError extends Error {
  constructor() {
    super("You do not have permission to comment on this issue");
    this.name = "IssueCommentCreationForbiddenError";
  }
}

export class IssueCommentGetForbiddenError extends Error {
  constructor() {
    super("You do not have permission to view comments on this issue");
    this.name = "IssueCommentGetForbiddenError";
  }
}
