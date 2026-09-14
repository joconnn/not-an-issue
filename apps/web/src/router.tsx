import { createBrowserRouter } from "react-router";
import { Marketing } from "./Marketing";
import { SignUp } from "./features/auth";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Marketing,
  },
  {
    path: "/auth",
    children: [
      { path: "sign-in", Component: () => <h1>sign-in</h1> },
      { path: "sign-up", Component: SignUp },
    ],
  },
]);
