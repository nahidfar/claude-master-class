"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message = typeof data === "object" && data !== null && "error" in data && typeof data.error === "string" ? data.error : `Login failed (${response.status}).`;
        setError(message);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login request failed:", error);
      setError("Could not reach the login service. Check the server and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="password">Workspace password
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}
