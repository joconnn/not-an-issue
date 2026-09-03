import { betterAuth } from "better-auth";
import { pool } from "../../../packages/db";

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
});
