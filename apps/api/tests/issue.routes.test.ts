import { db } from "@not-an-issue/db";
import { expect, test } from "vitest";
import { buildAuthenticatedTestApplication } from "./helpers/build-authenticated-route-test-app.js";
import { createIssueFixture } from "./helpers/issue-fixture.js";

test("GET /api/issues/:issueId returns the issue and its comments", async () => {
  const fixture = await createIssueFixture();
  const app = buildAuthenticatedTestApplication(fixture.ownerId);

  try {
    const comment = await db
      .insertInto("comment")
      .values({
        issue_id: fixture.issue.id,
        author_id: fixture.ownerId,
        body: "Test comment",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const response = await app.inject({
      method: "GET",
      url: `/api/issues/${fixture.issue.id}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      id: fixture.issue.id,
      project_id: fixture.project.id,
      title: fixture.issue.title,
      description: fixture.issue.description,
      status: "open",
      comments: [
        {
          id: comment.id,
          issue_id: fixture.issue.id,
          author_id: fixture.ownerId,
          body: "Test comment",
        },
      ],
    });
  } finally {
    try {
      await app.close();
    } finally {
      await fixture.cleanup();
    }
  }
});

test("PATCH /api/issues/:issueId updates and returns the issue", async () => {
  const fixture = await createIssueFixture();
  const app = buildAuthenticatedTestApplication(fixture.ownerId);

  try {
    const response = await app.inject({
      method: "PATCH",
      url: `/api/issues/${fixture.issue.id}`,
      payload: {
        title: "Updated issue title",
        description: null,
        status: "closed",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      id: fixture.issue.id,
      title: "Updated issue title",
      description: null,
      status: "closed",
    });

    const persistedIssue = await db
      .selectFrom("issue")
      .selectAll()
      .where("id", "=", fixture.issue.id)
      .executeTakeFirstOrThrow();

    expect(persistedIssue).toMatchObject({
      title: "Updated issue title",
      description: null,
      status: "closed",
    });
  } finally {
    try {
      await app.close();
    } finally {
      await fixture.cleanup();
    }
  }
});
