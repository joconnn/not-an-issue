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
