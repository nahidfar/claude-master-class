import { test } from "node:test";
import assert from "node:assert/strict";
import { isSameOrigin } from "../src/lib/origin.ts";

test("local dev compares the browser origin with the actual host header", () => {
  assert.equal(isSameOrigin(new Request("http://localhost:3107/api/auth", {
    headers: { host: "127.0.0.1:3107", origin: "http://127.0.0.1:3107" },
  })), true);
});

test("proxy scheme is checked and cross-origin or mismatched schemes fail", () => {
  const make = (origin: string) => new Request("http://internal/api/auth", {
    headers: { host: "portfolio.example", "x-forwarded-proto": "https", origin },
  });
  assert.equal(isSameOrigin(make("https://portfolio.example")), true);
  assert.equal(isSameOrigin(make("https://unrelated.example")), false);
  assert.equal(isSameOrigin(make("http://portfolio.example")), false);
  assert.equal(isSameOrigin(make("null")), false);
});
