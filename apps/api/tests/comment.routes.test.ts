import { randomUUID } from "node:crypto";
import { db } from "@not-an-issue/db";
import { expect, test } from "vitest";
import { buildAuthenticatedTestApplication } from "./helpers/build-authenticated-route-test-app.js";
import { createIssueFixture } from "./helpers/issue-fixture.js";
import { createTestUser, deleteTestUsers } from "./helpers/test-users.js";

test("POST /api/issues/:issueId/comments creates and returns a comment", async () => {
  const fixture = await createIssueFixture();
  const app = buildAuthenticatedTestApplication(fixture.ownerId);

  try {
    const response = await app.inject({
      method: "POST",
      url: `/api/issues/${fixture.issue.id}/comments`,
      payload: {
        body: "A new comment",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      issue_id: fixture.issue.id,
      author_id: fixture.ownerId,
      body: "A new comment",
    });

    const persistedComment = await db
      .selectFrom("comment")
      .selectAll()
      .where("issue_id", "=", fixture.issue.id)
      .where("body", "=", "A new comment")
      .executeTakeFirstOrThrow();

    expect(persistedComment.author_id).toBe(fixture.ownerId);
  } finally {
    try {
      await app.close();
    } finally {
      await fixture.cleanup();
    }
  }
});

test("GET /api/issues/:issueId/comments returns comments to a viewer", async () => {
  const fixture = await createIssueFixture();
  const viewerId = randomUUID();
  const app = buildAuthenticatedTestApplication(viewerId);

  try {
    await createTestUser(viewerId, "Test Viewer");

    await db
      .insertInto("workspace_member")
      .values({
        workspace_id: fixture.workspace.id,
        user_id: viewerId,
        role: "viewer",
      })
      .executeTakeFirstOrThrow();

    const firstComment = await db
      .insertInto("comment")
      .values({
        issue_id: fixture.issue.id,
        author_id: fixture.ownerId,
        body: "First comment",
        created_at: new Date("2026-01-01T10:00:00.000Z"),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const secondComment = await db
      .insertInto("comment")
      .values({
        issue_id: fixture.issue.id,
        author_id: fixture.ownerId,
        body: "Second comment",
        created_at: new Date("2026-01-01T11:00:00.000Z"),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const response = await app.inject({
      method: "GET",
      url: `/api/issues/${fixture.issue.id}/comments`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().map((comment: { id: string }) => comment.id)).toEqual([
      firstComment.id,
      secondComment.id,
    ]);
  } finally {
    try {
      await app.close();
    } finally {
      try {
        await fixture.cleanup();
      } finally {
        await deleteTestUsers([viewerId]);
      }
    }
  }
});

test("POST /api/issues/:issueId/comments rejects a viewer", async () => {
  const fixture = await createIssueFixture();
  const viewerId = randomUUID();
  const app = buildAuthenticatedTestApplication(viewerId);
  const commentBody = `Forbidden comment ${randomUUID()}`;

  try {
    await createTestUser(viewerId, "Test Viewer");

    await db
      .insertInto("workspace_member")
      .values({
        workspace_id: fixture.workspace.id,
        user_id: viewerId,
        role: "viewer",
      })
      .executeTakeFirstOrThrow();

    const response = await app.inject({
      method: "POST",
      url: `/api/issues/${fixture.issue.id}/comments`,
      payload: {
        body: commentBody,
      },
    });

    expect(response.statusCode).toBe(403);

    const persistedComment = await db
      .selectFrom("comment")
      .select("id")
      .where("issue_id", "=", fixture.issue.id)
      .where("body", "=", commentBody)
      .executeTakeFirst();

    expect(persistedComment).toBeUndefined();
  } finally {
    try {
      await app.close();
    } finally {
      try {
        await fixture.cleanup();
      } finally {
        await deleteTestUsers([viewerId]);
      }
    }
  }
});
