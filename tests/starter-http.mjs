import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import path from "node:path";

let server;
let base;

before(async () => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  server = spawn(process.execPath, [
    path.join(root, "node_modules", "next", "dist", "bin", "next"),
    "start", "--port", "0", "--hostname", "127.0.0.1",
  ], {
    cwd: root,
    env: {
      ...process.env,
      SITE_PASSWORD: "workshop-test-password",
      SESSION_SECRET: "workshop-test-secret-more-than-32-characters",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  let timer;
  try {
    await new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error(`Server readiness timed out:\n${output}`)), 30000);
      const read = (chunk) => {
        output += chunk.toString();
        const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
        if (match && output.includes("Ready")) {
          base = match[0];
          resolve();
        }
      };
      server.stdout.on("data", read);
      server.stderr.on("data", read);
      server.once("error", reject);
      server.once("exit", (code) => reject(new Error(`Server exited (${code}):\n${output}`)));
    });
  } finally {
    clearTimeout(timer);
  }
});

after(async () => {
  if (!server || server.exitCode !== null) return;
  const exited = once(server, "exit");
  server.kill();
  await exited;
});

function request(route, options = {}) {
  return fetch(`${base}${route}`, { ...options, signal: AbortSignal.timeout(30000) });
}

test("public portfolio works but private HTML and RSC never contain page children", async () => {
  assert.equal((await request("/")).status, 200);
  for (const cookie of ["", "portfolio-session=forged-token"]) {
    for (const route of ["/dashboard", "/dashboard/fit-analyzer", "/dashboard/cover-letter", "/dashboard/career-plan"]) {
      for (const rsc of [false, true]) {
        const response = await request(route, { headers: { cookie, ...(rsc ? { RSC: "1" } : {}) } });
        assert.equal(response.status, 200, route);
        const content = await response.text();
        assert.match(content, /Build authentication first/, route);
        assert.ok(!content.includes("Your next three builds."), route);
        assert.ok(!content.includes("Back to workspace"), route);
        assert.ok(!content.includes('id="jobDescription"'), route);
      }
    }
  }
});

test("each private API denies access even with configured credentials and forged cookies", async () => {
  for (const cookie of ["", "portfolio-session=forged-token"]) {
    for (const route of ["/api/fit-analyzer", "/api/cover-letter", "/api/career-plan"]) {
      const response = await request(route, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: base, cookie },
        body: JSON.stringify({ jobDescription: "Example role" }),
      });
      assert.equal(response.status, 501, route);
      assert.match((await response.json()).error, /Authentication is not implemented/);
      assert.equal(response.headers.get("set-cookie"), null);
    }
  }
});

test("auth mutations report 501 without issuing cookies and retain origin enforcement", async () => {
  for (const method of ["POST", "DELETE"]) {
    const options = {
      method,
      headers: { "Content-Type": "application/json", Origin: base },
      ...(method === "POST" ? { body: JSON.stringify({ password: "workshop-test-password" }) } : {}),
    };
    const response = await request("/api/auth", options);
    assert.equal(response.status, 501);
    assert.match((await response.json()).error, /Authentication is not implemented/);
    assert.equal(response.headers.get("set-cookie"), null);
    const crossOrigin = await request("/api/auth", {
      ...options,
      headers: { ...options.headers, Origin: "https://untrusted.example" },
    });
    assert.equal(crossOrigin.status, 403);
    assert.equal(crossOrigin.headers.get("set-cookie"), null);
  }
});
