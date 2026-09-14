import { createContext } from "react-router";
import type { authClient } from "./features/auth/auth-client";

export type AuthData = typeof authClient.$Infer.Session;

export const authContext = createContext<AuthData>();
