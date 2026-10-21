import { test } from "node:test";
import assert from "node:assert/strict";
import { AuthenticationNotImplementedError, authConfiguration, isAuthenticated } from "../src/lib/auth.ts";

test("starter configuration explicitly blocks unimplemented authentication", () => {
  assert.throws(() => authConfiguration(), AuthenticationNotImplementedError);
});

test("starter session check cannot grant private access", async () => {
  await assert.rejects(isAuthenticated(), AuthenticationNotImplementedError);
});
