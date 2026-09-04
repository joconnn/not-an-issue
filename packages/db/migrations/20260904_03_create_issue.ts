import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("issue_status")
    .asEnum(["open", "closed"])
    .execute();

  await db.schema
    .createTable("issue")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("project_id", "uuid", (col) =>
      col.notNull().references("project.id").onDelete("cascade"),
    )
    .addColumn("created_by", "text", (col) =>
      col.references("user.id").onDelete("set null"),
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("status", sql`issue_status`, (col) =>
      col.notNull().defaultTo("open"),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // TODO: Create issue_project_id_idx on project_id
  // TODO: Create issue_created_by_idx on created_by
  await db.schema
    .createIndex("issue_project_id_idx")
    .on("issue")
    .column("project_id")
    .execute();
  await db.schema
    .createIndex("issue_created_by_idx")
    .on("issue")
    .column("created_by")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // TODO: Drop issue first
  // TODO: Drop issue_status second
  await db.schema.dropTable("issue").execute();
  await db.schema.dropType("issue_status").execute();
}
