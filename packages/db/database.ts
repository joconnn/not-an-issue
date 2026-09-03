import "dotenv/config";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./types";

const dbConnectionString = process.env.DATABASE_URL!;

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: dbConnectionString,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
