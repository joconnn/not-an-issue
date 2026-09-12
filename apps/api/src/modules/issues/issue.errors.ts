export class ProjectIssueCreationForbiddenError extends Error {
  constructor() {
    super("You do not have permission to create an issue in this project");
    this.name = "ProjectIssueCreationForbiddenError";
  }
}

export class ProjectIssueGetForbiddenError extends Error {
  constructor() {
    super("You do not have permission to get the issues in this project");
    this.name = "ProjectIssueGetForbiddenError";
  }
}

export class IssueGetForbiddenError extends Error {
  constructor() {
    super("You do not have permission to view this issue");
    this.name = "IssueGetForbiddenError";
  }
}

export class IssueUpdateForbiddenError extends Error {
  constructor() {
    super("You do not have permission to update this issue");
    this.name = "IssueUpdateForbiddenError";
  }
}

export class InvalidIssueUpdateError extends Error {
  constructor() {
    super("At least one issue field must be provided");
    this.name = "InvalidIssueUpdateError";
  }
}
