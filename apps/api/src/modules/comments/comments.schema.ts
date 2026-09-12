import Type from "typebox";

export const IssueCommentParams = Type.Object({
  issueId: Type.String({
    format: "uuid",
  }),
});

export const CreateIssueCommentBody = Type.Object(
  {
    body: Type.String({
      minLength: 1,
      maxLength: 2000,
    }),
  },
  {
    additionalProperties: false,
  },
);
