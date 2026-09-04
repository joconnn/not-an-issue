import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  // TODO: Create issue_status enum
  // Start with: open, closed

  await db.schema
    .createTable("issue")
    // TODO: id
    // - uuid
    // - primary key
    // - gen_random_uuid() default

    // TODO: project_id
    // - uuid
    // - not null
    // - references project.id
    // - cascade on delete

    // TODO: created_by
    // - text
    // - nullable
    // - references user.id
    // - set null on delete

    // TODO: title
    // - text
    // - not null

    // TODO: Decide whether description is nullable

    // TODO: status using sql`issue_status`
    // - not null
    // - decide whether it defaults to open

    // TODO: created_at
    // - timestamptz
    // - not null
    // - CURRENT_TIMESTAMP default

    // TODO: updated_at
    // - timestamptz
    // - not null
    // - CURRENT_TIMESTAMP default
    .execute();

  // TODO: Create issue_project_id_idx on project_id
  // TODO: Create issue_created_by_idx on created_by
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // TODO: Drop issue first
  // TODO: Drop issue_status second
}
