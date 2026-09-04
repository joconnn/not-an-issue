import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // SchemaModule - building database schema
  await db.schema
    // CreateTypeBuilder
    .createType("workspace_role")
    .asEnum(["owner", "member", "viewer"])
    .execute();

  await db.schema
    // CreateTableBuilder
    .createTable("workspace_member")
    // ColumnBuilderCallback - (col) =>
    .addColumn("workspace_id", "uuid", (col) => {
      // ColumnDefinitionBuilder
      // adds not null constraint, on delete and fk constraint with workspace.id
      return col.notNull().references("workspace.id").onDelete("cascade");
    })
    .addColumn("user_id", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    // sql - raw sql snippets
    .addColumn("role", sql`workspace_role`, (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      // call postgres function CURRENT_TIMESTAMP
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    // Key to our junction table, creates many-to-many relationship
    .addPrimaryKeyConstraint("workspace_member_pkey", [
      "workspace_id",
      "user_id",
    ])
    .execute();

  // CreateIndexBuilder
  await db.schema
    .createIndex("workspace_member_user_id_idx")
    .on("workspace_member")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("workspace_member").execute();
  await db.schema.dropType("workspace_role").execute();
}
