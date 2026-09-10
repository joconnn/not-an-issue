import Type from "typebox";

export const CreateProjectBody = Type.Object(
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

export const ProjectParams = Type.Object({
  workspaceId: Type.String({
    format: "uuid",
  }),
});
