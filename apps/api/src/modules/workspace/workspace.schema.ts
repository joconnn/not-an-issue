import Type from "typebox";

export const CreateWorkspaceBody = Type.Object(
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
