import { test, expect } from "vitest";
import { buildApplication } from "../src/app";

// Our test case
test("GET request to '/' route", async () => {
  // create our fastify app
  const app = buildApplication();

  try {
    // Use fastify inject to mock the http server
    const response = await app.inject({
      method: "GET",
      url: "/",
    });
    // Access reponse values
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      hello: "world",
    });
  } finally {
    // close down fastify server
    await app.close();
  }
});

test("GET request to an unknown route", async () => {
  const app = buildApplication();

  try {
    const response = await app.inject({
      method: "GET",
      url: "/unknown-route",
    });
    expect(response.statusCode).toBe(404);
  } finally {
    await app.close();
  }
});
