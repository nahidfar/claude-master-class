"use client";

import { useState, type FormEvent } from "react";
import { type CareerMode, type Tone, type ToolId } from "@/lib/tools";

export default function ToolWorkbench({ id }: { id: ToolId }) {
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [mode, setMode] = useState<CareerMode>("interview");
  const [hours, setHours] = useState(5);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult("");
    setBusy(true);
    try {
      const response = await fetch(`/api/${id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd, tone, mode, weeklyHours: hours }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setError(typeof data === "object" && data !== null && "error" in data && typeof data.error === "string" ? data.error : `Request failed (${response.status}).`);
        return;
      }
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Tool request failed:", error);
      setError("The request failed. Check the server logs and your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <form onSubmit={submit}>
        <label htmlFor="jd">Target job description (include the role and company)
          <textarea id="jd" rows={8} required maxLength={5000} value={jd} onChange={(event) => setJd(event.target.value)} />
        </label>
        <p className="muted">{jd.length} / 5,000 characters. Do not paste confidential information.</p>
        {id === "cover-letter" && <label htmlFor="tone">Tone
          <select id="tone" value={tone} onChange={(event) => {
            const value = event.target.value;
            if (value === "formal" || value === "conversational" || value === "technical") setTone(value);
          }}>
            <option value="formal">Formal</option><option value="conversational">Conversational</option><option value="technical">Technical</option>
          </select>
        </label>}
        {id === "career-plan" && <>
          <label htmlFor="mode">Preparation mode
            <select id="mode" value={mode} onChange={(event) => {
              const value = event.target.value;
              if (value === "interview" || value === "study") setMode(value);
            }}>
              <option value="interview">Interview preparation</option><option value="study">New-role study plan</option>
            </select>
          </label>
          {mode === "study" && <label htmlFor="hours">Learning hours per week
            <input id="hours" type="number" min={1} max={40} required value={hours} onChange={(event) => setHours(Number(event.target.value))} />
          </label>}
        </>}
        <button type="submit" disabled={busy}>{busy ? "Working..." : "Run tool"}</button>
      </form>
      <div aria-live="polite">
        {error && <p className="error" role="alert">{error}</p>}
        {result && <section><h2>Result</h2><pre>{result}</pre></section>}
      </div>
    </div>
  );
}
