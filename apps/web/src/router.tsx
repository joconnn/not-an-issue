import { createBrowserRouter, Link, Outlet } from "react-router";
import { Marketing } from "./Marketing";
import { SignIn, SignUp } from "./features/auth";
import {
  createWorkspaceAction,
  Dashboard,
  workspaceLoader,
} from "./features/dashboard/routes/dashboard";
import { protectedRouteMiddleware } from "./middleware";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Marketing,
  },
  {
    path: "/auth",
    children: [
      { path: "sign-in", Component: SignIn },
      { path: "sign-up", Component: SignUp },
    ],
  },
  {
    middleware: [protectedRouteMiddleware],
    Component: () => (
      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Outlet />
      </div>
    ),
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
        loader: workspaceLoader,
        action: createWorkspaceAction,
      },
      {
        path: "workspaces/:workspaceId",
        children: [
          { index: true, Component: () => <h2>workspaces</h2> },
          { path: "projects/:projectId", Component: () => <h2>project</h2> },
          {
            path: "projects/:projectId/issues/:issueId",
            Component: () => <h2>project issues</h2>,
          },
        ],
      },
    ],
  },
]);
