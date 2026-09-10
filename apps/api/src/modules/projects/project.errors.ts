export class ProjectCreationForbiddenError extends Error {
  constructor() {
    super("You do not have permission to create a project in this workspace");
    this.name = "ProjectCreationForbiddenError";
  }
}
