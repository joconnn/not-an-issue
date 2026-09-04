import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createType("workspace_role")
    .asEnum(["owner", "member", "viewer"])
    .execute();

  await db.schema
    .createTable("workspace_member")
    .addColumn("workspace_id", "uuid", (col) =>
      col.notNull().references("workspace.id").onDelete("cascade"),
    )
    .addColumn("user_id", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("role", sql`workspace_role`, (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addPrimaryKeyConstraint("workspace_member_pk", ["workspace_id", "user_id"])
    .execute();

  await db.schema
    .createIndex("workspace_member_user_id_idx")
    .on("workspace_member")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropType("workspace_enum").ifExists().execute();
  await db.schema.dropTable("workspace_member").execute();
}
