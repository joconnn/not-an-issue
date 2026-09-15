// Dashboard Page
// Shows the workspace form and cards
// react router action - in here or inside form?
import {
  parseCreateWorkspaceResponse,
  parseWorkspaceListResponse,
  type CreateWorkspaceRequest,
  type WorkspaceListResponse,
} from "@not-an-issue/contracts/workspaces";
import { redirect, useLoaderData, type ActionFunctionArgs } from "react-router";
//
//
import { CreateWorkspaceForm } from "../ui/create-workspace";
import type { CreateWorkspaceActionData } from "../types";
import { WorkspaceCard } from "../ui/workspace-card";

export async function workspaceLoader(): Promise<WorkspaceListResponse> {
  // api endpoint - get workspaces
  const response = await fetch("/api/workspaces");

  if (!response.ok) {
    throw response;
  }

  const body: unknown = await response.json();

  return parseWorkspaceListResponse(body);
}

export async function createWorkspaceAction({
  request,
}: ActionFunctionArgs): Promise<CreateWorkspaceActionData | Response> {
  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string" || !name.trim()) {
    return {
      errors: {
        name: "Workspace name is required",
      },
    };
  }

  const payload: CreateWorkspaceRequest = {
    name: name.trim(),
  };

  const response = await fetch("/api/workspaces", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  // Throw response so error boundary will catch
  if (!response.ok) {
    throw response;
  }

  const body: unknown = await response.json();
  const workspace = parseCreateWorkspaceResponse(body);

  return redirect(`/workspaces/${workspace.id}`);
}

export function Dashboard() {
  const workspaces = useLoaderData<typeof workspaceLoader>();

  return (
    <main>
      <CreateWorkspaceForm />
      <section aria-labelledby="workspaces-heading">
        <h2 id="workspaces-heading">Your workspaces</h2>

        {workspaces.length === 0 ? (
          <p>You do not have any workspaces yet.</p>
        ) : (
          workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              id={workspace.id}
              name={workspace.name}
            />
          ))
        )}
      </section>
    </main>
  );
}
