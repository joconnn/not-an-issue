import { pool } from "@not-an-issue/db";

export async function createTestUser(
  userId: string,
  name = "Test User",
): Promise<void> {
  await pool.query(
    `
      insert into "user" ("id", "name", "email", "emailVerified")
      values ($1, $2, $3, $4)
    `,
    [userId, name, `${userId}@example.test`, false],
  );
}

export async function deleteTestUsers(userIds: string[]): Promise<void> {
  if (userIds.length === 0) {
    return;
  }

  await pool.query(`delete from "user" where "id" = any($1::text[])`, [
    userIds,
  ]);
}
