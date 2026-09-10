5. Add projects

Implement the minimum:

```text
POST /api/workspaces/:workspaceId/projects
GET  /api/workspaces/:workspaceId/projects
```

Before either operation, verify that the authenticated user belongs to the workspace.

6. Add issues

Implement:

```text
POST  /api/projects/:projectId/issues
GET   /api/projects/:projectId/issues
GET   /api/issues/:issueId
PATCH /api/issues/:issueId
```

For the MVP, updating the title, description, or status is sufficient.

7. Add comments

Implement:

```text
POST /api/issues/:issueId/comments
GET  /api/issues/:issueId/comments
```

Set `author_id` from the authenticated session—never accept it from the request body.

8. Build the smallest frontend journey

Replace the starter Vite screen with:

```text
Sign up/sign in
    ↓
List/create workspace
    ↓
List/create project
    ↓
List/create issue
    ↓
View issue and add comments
```

At that point, you have an actual MVP. Invitations, member management, role editing, issue assignment, pagination, search, labels, and polished UI can all wait.

One additional frontend requirement will be configuring CORS and cookie credentials between the web and API development servers. Do that when connecting the first sign-in screen, rather than building it speculatively now.
