# Workspace HTTP contracts

Status: ready

## Scope

The dashboard creates a workspace and lists workspace links through the Fastify API. The browser must not import database-generated types or API implementation modules.

## Dependency direction

```text
packages/db          packages/contracts
    |                     |       |
    v                     v       v
 apps/api  ---------- HTTP ----> apps/web
```

`packages/contracts` owns JSON request and response shapes. `apps/api` owns authentication, database access, and mapping query results to those shapes. `apps/web` owns form state, route state, and component props.

## Usage

The API validates and serializes its route with shared schemas:

```ts
schema: {
  body: CreateWorkspaceRequestSchema,
  response: {
    201: CreateWorkspaceResponseSchema,
  },
}
```

The browser treats decoded JSON as unknown and validates it:

```ts
const body: unknown = await response.json();
return parseWorkspaceListResponse(body);
```

## Public contracts

- C-001 `CreateWorkspaceRequestSchema` accepts `{ name: string }`, with a name length of 1 to 100 characters and no additional properties.
- C-002 `CreateWorkspaceResponseSchema` returns `{ id: string, name: string }`.
- C-003 `WorkspaceListResponseSchema` returns an array of `{ id: string, name: string }`.
- C-004 The response parsers return the schema-derived type or throw when external JSON does not match the contract.

## Ownership rules

- Allowed: `apps/api` and `apps/web` import `@not-an-issue/contracts/workspaces`.
- Forbidden: `apps/web` imports `@not-an-issue/db` or any file under `apps/api`.
- API service input types stay inside `apps/api` because `userId` comes from the authenticated session, not the request body.
- React component props stay beside their components because they describe rendering needs, not HTTP messages.

## Test obligations

- T-001 A valid create request produces a response accepted by C-002. This detects route and contract drift and belongs in an API integration test.
- T-002 The list endpoint returns only `id` and `name`, and C-003 accepts the response. This belongs in an API integration test.
- T-003 C-004 rejects a list item with a missing or non-string `id` or `name`. This belongs in a contracts unit test.
- T-004 The dashboard renders one link per C-003 item. This belongs in a frontend route test.

## Tradeoff

The browser includes the TypeBox parsing runtime. In the current build, this adds about 33 kB gzip. The same definition controls server validation, server serialization, TypeScript inference, and browser response validation. If bundle size becomes a constraint, keep the schemas and types here but expose a smaller client validator entry point.
