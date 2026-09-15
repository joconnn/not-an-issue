// Form to create a workspace
import { Form, useActionData, useNavigation } from "react-router";

import type { CreateWorkspaceActionData } from "../types";

export function CreateWorkspaceForm() {
  const actionData = useActionData<CreateWorkspaceActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post">
      <label htmlFor="name">Name</label>

      <input
        id="name"
        name="name"
        type="text"
        maxLength={100}
        required
        aria-invalid={actionData?.errors?.name ? true : undefined}
        aria-describedby={
          actionData?.errors?.name ? "workspace-name-error" : undefined
        }
      />

      {actionData?.errors?.name && (
        <p id="workspace-name-error" role="alert" className="text-red-400">
          {actionData.errors.name}
        </p>
      )}

      {actionData?.errors?.form && <p role="alert">{actionData.errors.form}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create workspace"}
      </button>
    </Form>
  );
}
