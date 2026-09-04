import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("comment")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("issue_id", "uuid", (col) =>
      col.notNull().references("issue.id").onDelete("cascade"),
    )
    .addColumn("author_id", "text", (col) =>
      col.references("user.id").onDelete("set null"),
    )
    .addColumn("body", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema
    .createIndex("comment_issue_id_idx")
    .on("comment")
    .column("issue_id")
    .execute();
  await db.schema
    .createIndex("comment_author_id_idx")
    .on("comment")
    .column("author_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("comment").execute();
}
