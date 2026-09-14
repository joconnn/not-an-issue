import { type MiddlewareFunction, redirect } from "react-router";
import { authClient } from "./features/auth/auth-client";
import { authContext } from "./router-context";

export const protectedRouteMiddleware: MiddlewareFunction = async ({
  context,
}) => {
  const { data: session } = await authClient.getSession();

  if (!session) {
    throw redirect("/");
  }

  context.set(authContext, session);
};
