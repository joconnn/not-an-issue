import Type, { type Static } from "typebox";
import { Parse } from "typebox/value";

export const CreateWorkspaceRequestSchema = Type.Object(
  {
    name: Type.String({
      minLength: 1,
      maxLength: 100,
    }),
  },
  {
    additionalProperties: false,
  },
);

export type CreateWorkspaceRequest = Static<
  typeof CreateWorkspaceRequestSchema
>;

export const WorkspaceSummarySchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
  },
  {
    additionalProperties: false,
  },
);

export type WorkspaceSummary = Static<typeof WorkspaceSummarySchema>;

export const CreateWorkspaceResponseSchema = WorkspaceSummarySchema;
export type CreateWorkspaceResponse = Static<
  typeof CreateWorkspaceResponseSchema
>;

export const WorkspaceListResponseSchema = Type.Array(WorkspaceSummarySchema);
export type WorkspaceListResponse = Static<typeof WorkspaceListResponseSchema>;

export function parseCreateWorkspaceResponse(
  value: unknown,
): CreateWorkspaceResponse {
  return Parse(CreateWorkspaceResponseSchema, value);
}

export function parseWorkspaceListResponse(
  value: unknown,
): WorkspaceListResponse {
  return Parse(WorkspaceListResponseSchema, value);
}
