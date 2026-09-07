1. Create a test database

Add `.env.test` with a separate `DATABASE_URL`, run migrations against it, and ensure integration tests never write to your development database.

2. Implement workspace creation

Create:

```text
modules/workspace/
├── workspace.routes.ts
└── workspace.service.ts
```

Implement:

```text
POST /api/workspaces
```

The route should:

- Receive and validate `{ name: string }`.
- Read `request.authSession.user.id`.
- Call the workspace service.
- Return the workspace with status `201`.

The service should use one transaction to:

- Insert the workspace.
- Insert the authenticated user into `workspace_member`.
- Give that membership the `owner` role.

You don’t need a repository layer yet. Use:

```text
route → service → Kysely
```

Introduce repositories only when database queries become repeated or complicated.

3. Test the workspace transaction

This is a worthwhile integration test:

- Create a workspace.
- Verify the workspace exists.
- Verify its creator has an `owner` membership.

The transaction is important application behaviour, so it deserves a test.

4. Add workspace listing

Implement:

```text
GET /api/workspaces
```

Return only workspaces where the current user has a `workspace_member` record. This establishes your authorization pattern.

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
