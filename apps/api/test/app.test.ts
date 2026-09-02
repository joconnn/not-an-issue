import { test, expect } from "vitest";
import { buildApplication } from "../src/app";

test("Http GET '/' route", async () => {
  const app = buildApplication();

  try {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      hello: "world",
    });
  } finally {
    await app.close();
  }
});
