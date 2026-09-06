import { test, expect } from "vitest";
import { buildApplication } from "../src/app";
test("unauthenticated user GET /api/me returns status code '404", async () => {
  const app = buildApplication();

  try {
    const response = await app.inject({
      method: "GET",
      url: "/api/me",
    });

    expect(response.statusCode).toBe(401);
    expect(response.json).toBe({
      error: "Unauthorized",
    });
  } catch {
    await app.close();
  }
});
