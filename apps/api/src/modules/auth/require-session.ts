import { fromNodeHeaders } from "better-auth/node";
import type { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "../../lib/auth.js";

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export async function requireSession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
  // Assign the extended authSession key to our session value
  request.authSession = session;
}
