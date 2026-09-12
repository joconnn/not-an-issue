import Type from "typebox";

export const CreateProjectIssueBody = Type.Object(
  {
    description: Type.Optional(
      Type.Union([
        Type.Null(),
        Type.String({
          minLength: 1,
          maxLength: 2000,
        }),
      ]),
    ),
    title: Type.String({
      minLength: 1,
      maxLength: 100,
    }),
  },
  {
    additionalProperties: false,
  },
);

export const CreateProjectIssueParams = Type.Object({
  projectId: Type.String({
    format: "uuid",
  }),
});
