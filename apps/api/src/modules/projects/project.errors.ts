export class ProjectCreationForbiddenError extends Error {
  constructor() {
    super("You do not have permission to create a project in this workspace");
    this.name = "ProjectCreationForbiddenError";
  }
}

export class ProjectGetForbiddenError extends Error {
  constructor() {
    super("You are not a member of this workspace to view projects");
    this.name = "ProjectGetForbiddenError";
  }
}
