import { createBrowserRouter, Outlet } from "react-router";
import { Marketing } from "./Marketing";
import { SignIn, SignUp } from "./features/auth";
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
    Component: () => (
      <div>
        <h1>Protected layout</h1>
        <Outlet />
      </div>
    ),
    children: [
      { path: "dashboard", Component: () => <h2>dashboard</h2> },
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
