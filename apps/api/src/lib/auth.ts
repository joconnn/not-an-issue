import { betterAuth } from "better-auth";
import { pool } from "@not-an-issue/db";

export const auth = betterAuth({
  database: pool,
  trustedOrigins: ["http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
  },
});
