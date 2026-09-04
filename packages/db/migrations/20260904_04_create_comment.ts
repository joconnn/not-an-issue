import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("comment")
    // TODO: id
    // - uuid
    // - primary key
    // - gen_random_uuid() default

    // TODO: issue_id
    // - uuid
    // - not null
    // - references issue.id
    // - cascade on delete

    // TODO: author_id
    // - text
    // - nullable
    // - references user.id
    // - set null on delete

    // TODO: body
    // - text
    // - not null

    // TODO: created_at
    // - timestamptz
    // - not null
    // - CURRENT_TIMESTAMP default

    // TODO: updated_at
    // - timestamptz
    // - not null
    // - CURRENT_TIMESTAMP default
    .execute();

  // TODO: Create comment_issue_id_idx on issue_id
  // TODO: Create comment_author_id_idx on author_id
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // TODO: Drop comment
}
