import assert from "node:assert/strict";
import test from "node:test";

import {
  parseCreateWorkspaceResponse,
  parseWorkspaceListResponse,
} from "../dist/workspaces.js";

test("parses valid workspace responses", () => {
  assert.deepEqual(
    parseCreateWorkspaceResponse({ id: "workspace-1", name: "Example" }),
    { id: "workspace-1", name: "Example" },
  );

  assert.deepEqual(
    parseWorkspaceListResponse([
      { id: "workspace-1", name: "Example" },
      { id: "workspace-2", name: "Another workspace" },
    ]),
    [
      { id: "workspace-1", name: "Example" },
      { id: "workspace-2", name: "Another workspace" },
    ],
  );
});

test("rejects invalid workspace responses", () => {
  assert.throws(() =>
    parseWorkspaceListResponse([{ id: 123, name: "Example" }]),
  );

  assert.throws(() =>
    parseWorkspaceListResponse([{ id: "workspace-1" }]),
  );
});
