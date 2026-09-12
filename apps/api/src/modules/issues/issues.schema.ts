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

export const IssueParams = Type.Object({
  issueId: Type.String({
    format: "uuid",
  }),
});

export const UpdateIssueBody = Type.Object(
  {
    title: Type.Optional(
      Type.String({
        minLength: 1,
        maxLength: 100,
      }),
    ),
    description: Type.Optional(
      Type.Union([
        Type.Null(),
        Type.String({
          minLength: 1,
          maxLength: 2000,
        }),
      ]),
    ),
    status: Type.Optional(
      Type.Union([Type.Literal("open"), Type.Literal("closed")]),
    ),
  },
  {
    additionalProperties: false,
    minProperties: 1,
  },
);
