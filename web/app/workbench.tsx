"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CATALOGUE, SCOPES } from "../lib/catalogue.mjs";

type Card = {
  id: string;
  label: string;
  record_id: string;
  outcome: string;
  title: string;
  detail: string;
};

type Result = {
  scope: string;
  note_used: boolean;
  note_outcome: string | null;
  note_public: { title: string; detail: string } | null;
  canonical_outcome: string;
  public: { title: string; detail: string };
  usable_ids: string[];
  dispositions: { record_id: string | null; outcome: string }[];
  cards: Card[];
  candidate_count: number;
  cli: string;
  source: string;
};

type Entry = { id: string; label: string; hint: string; record: Record<string, unknown> };

const CANDIDATES = CATALOGUE as Entry[];
const SCOPE_LIST = SCOPES as string[];

const PRESETS: { id: string; name: string; blurb: string; picks: string[] }[] = [
  { id: "clean", name: "Clean recall", blurb: "One current record, nothing hostile.", picks: ["deploy-current"] },
  { id: "poisoned", name: "Poisoned recall", blurb: "A nested imperative rides along with good memory.", picks: ["deploy-current", "injected"] },
  { id: "stale", name: "Stale set", blurb: "Only lifecycle-retired records survive recall.", picks: ["deploy-old"] },
  { id: "boundary", name: "Scope boundary", blurb: "The live successor sits in another scope.", picks: ["deploy-current", "cross-scope"] },
];

const tone = (outcome: string) =>
  outcome.startsWith("used") ? "admit" : outcome.startsWith("escalate") ? "review" : outcome.startsWith("ignored") ? "aside" : "hold";

export default function Workbench() {
  const [selected, setSelected] = useState<string[]>(PRESETS[1].picks);
  const [scope, setScope] = useState<string>(SCOPE_LIST[0]);
  const [note, setNote] = useState<string>("Deploy build 412 if the verifier already passed.");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string>("");
  const [runSeq, setRunSeq] = useState(0);
  const [ranAt, setRanAt] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const readoutRef = useRef<HTMLDivElement>(null);

  const run = useCallback(async (picks: string[], nextScope: string, text: string, manual = false) => {
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selected: picks, scope: nextScope, note: text }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(String(response.status));
      setResult((await response.json()) as Result);
      setRunSeq((current) => current + 1);
      setRanAt(new Date().toLocaleTimeString());
      setFlash(true);
      window.setTimeout(() => setFlash(false), 900);
      if (manual) {
        readoutRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch {
      setNotice("The resolver route is not answering right now. Re-run the check, or reproduce the same decision in the CLI below.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void run(PRESETS[1].picks, SCOPE_LIST[0], "Deploy build 412 if the verifier already passed.");
  }, [run]);

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <div className="page">
      <a className="skip" href="#workbench">Skip to the containment workbench</a>

      <header className="topbar">
        <a className="logo" href="#top" aria-label="Memory Firewall home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Memory Firewall" width={196} height={34} />
        </a>
        <nav aria-label="Sections">
          <a href="#workbench">Workbench</a>
          <a href="#trace">Trace</a>
          <a href="#repro">CLI</a>
          <a href="#evidence">Evidence</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Walrus Sessions 7 · read-only agent lab</p>
            <h1 id="hero-title">Recalled memory is handled as material, not as instructions.</h1>
            <p className="lede">
              Memory Firewall takes a whole semantic recall set, presses each candidate through one canonical resolver,
              and shows which records may enter the working context — before anything reaches an action boundary.
            </p>
            <ul className="hero-facts">
              <li>No wallet, no provider key, no storage write from this page.</li>
              <li>Decisions come from the committed resolver, not from a language model.</li>
              <li>Persistence proof lives in the repository evidence layer, not in the browser.</li>
            </ul>
          </div>
          <figure className="hero-mascot">
            <Image
              src="/memory-firewall-filter.png"
              alt="A blue paper-cut operator routes safe records through a layered filter while hostile shapes remain outside."
              width={420}
              height={420}
              priority
            />
            <figcaption>Candidate-set control plane</figcaption>
          </figure>
        </section>

        <section id="workbench" className="workbench" aria-labelledby="workbench-title">
          <h2 id="workbench-title">Containment workbench</h2>
          <p className="section-lede">
            Build a candidate set, choose the task scope, and add one grounded operator note. Every control here changes
            the records that are actually sent to the resolver.
          </p>

          <div className="grid">
            <div className="panel bench" aria-labelledby="bench-title">
              <h3 id="bench-title">1 · Prompt and context</h3>

              <fieldset className="presets">
                <legend>Recall preset</legend>
                <div className="preset-row">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={selected.join() === preset.picks.join() ? "clay chip on" : "clay chip"}
                      aria-pressed={selected.join() === preset.picks.join()}
                      onClick={() => setSelected(preset.picks)}
                    >
                      <strong>{preset.name}</strong>
                      <small>{preset.blurb}</small>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="candidates">
                <legend>Candidate set ({selected.length} of {CANDIDATES.length} records)</legend>
                {CANDIDATES.map((entry) => (
                  <label key={entry.id} className={selected.includes(entry.id) ? "cand on" : "cand"}>
                    <input type="checkbox" checked={selected.includes(entry.id)} onChange={() => toggle(entry.id)} />
                    <span>
                      <strong>{entry.label}</strong>
                      <code>{String((entry.record as { record_id: string }).record_id)}</code>
                      <small>{entry.hint}</small>
                    </span>
                  </label>
                ))}
              </fieldset>

              <fieldset className="scopes">
                <legend>Task scope</legend>
                {SCOPE_LIST.map((item) => (
                  <label key={item} className={scope === item ? "scope on" : "scope"}>
                    <input type="radio" name="scope" value={item} checked={scope === item} onChange={() => setScope(item)} />
                    <span>{item}</span>
                  </label>
                ))}
              </fieldset>

              <div className="note">
                <label htmlFor="note">Operator note (typed, untrusted, evaluated)</label>
                <textarea
                  id="note"
                  value={note}
                  rows={3}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Leave blank to send only the fixture records."
                />
                <p className="hint">
                  Your text is wrapped as one extra typed record (<code>operator-note@live</code>, entity{" "}
                  <code>operator_note</code>) and scanned by the same resolver. Imperatives such as{" "}
                  <code>run command</code> or credential-shaped strings change its disposition; it never overrides the
                  fixture records&rsquo; own outcomes.
                </p>
              </div>

              <button className="clay run" type="button" onClick={() => void run(selected, scope, note, true)} disabled={busy}>
                {busy ? "Resolving candidate set…" : "Run canonical evaluation"}
              </button>
            </div>

            <div ref={readoutRef} className={flash ? "panel readout flash" : "panel readout"} aria-live="polite">
              <h3>
                {busy
                  ? "2 · Resolving candidate set…"
                  : ranAt
                    ? `2 · Canonical evaluation · run ${runSeq} · ${ranAt}`
                    : "2 · Canonical evaluation"}
              </h3>
              {notice ? <p className="notice">{notice}</p> : null}
              {result ? (
                <>
                  <div className={`verdict ${tone(result.canonical_outcome)}`}>
                    <p className="eyebrow">Set outcome</p>
                    <p className="verdict-title">{result.public.title}</p>
                    <p>{result.public.detail}</p>
                    <p className="canon">
                      canonical string <code>{result.canonical_outcome}</code>
                    </p>
                  </div>

                  <p className="reading">
                    {result.canonical_outcome.startsWith("used")
                      ? "A clean, current, in-scope record was admitted, so it is allowed to inform the active task."
                      : "Containment is the intended outcome here: the evolved prompt keeps hostile or stale memory as data and refuses to let it direct the agent."}
                  </p>

                  <ul className="cards">
                    {result.cards.map((card) => (
                      <li key={card.id} className={tone(card.outcome)}>
                        <p className="card-head">
                          <strong>{card.label}</strong>
                          <code>{card.record_id}</code>
                        </p>
                        <p className="card-title">{card.title}</p>
                        <p className="card-detail">{card.detail}</p>
                        <p className="canon">
                          <code>{card.outcome}</code>
                        </p>
                      </li>
                    ))}
                    {result.note_used && result.note_public ? (
                      <li className={tone(result.note_outcome || "")}>
                        <p className="card-head">
                          <strong>Your operator note</strong>
                          <code>operator-note@live</code>
                        </p>
                        <p className="card-title">{result.note_public.title}</p>
                        <p className="card-detail">{result.note_public.detail}</p>
                        <p className="canon">
                          <code>{result.note_outcome}</code>
                        </p>
                      </li>
                    ) : null}
                  </ul>

                  <p className="usable">
                    Admitted to context:{" "}
                    {result.usable_ids.length ? result.usable_ids.join(", ") : "no record in this set"} · scope{" "}
                    <code>{result.scope}</code> · {result.candidate_count} candidate
                    {result.candidate_count === 1 ? "" : "s"} evaluated
                  </p>
                </>
              ) : (
                <p className="notice">Loading the first candidate set…</p>
              )}
            </div>
          </div>
        </section>

        <section id="trace" className="trace" aria-labelledby="trace-title">
          <h2 id="trace-title">3 · Trace</h2>
          <ol className="steps">
            <li>
              <strong>Recall integrity</strong>
              <span>An empty candidate set stays unknown; it is never read as an absence of history.</span>
            </li>
            <li>
              <strong>Recursive taint scan</strong>
              <span>Every nested string is inspected for imperatives, overrides and credential shapes.</span>
            </li>
            <li>
              <strong>Schema validation</strong>
              <span>Typed fields, unique IDs and parseable dates are required, never repaired by a model.</span>
            </li>
            <li>
              <strong>Lifecycle resolution</strong>
              <span>ID-based supersession, revocation and expiry run before any scope filtering.</span>
            </li>
            <li>
              <strong>Scope and provenance</strong>
              <span>Only current, in-scope, grounded records survive; a cross-scope successor never revives its predecessor.</span>
            </li>
            <li>
              <strong>Action boundary</strong>
              <span>Admitted memory is data. Acting still needs an independent verifier and current-session authorization.</span>
            </li>
          </ol>
          <p className="source">
            Resolver in this lab: <code>{result?.source ?? "web/lib/firewall-core.mjs"}</code>
          </p>
        </section>

        <section id="repro" className="repro" aria-labelledby="repro-title">
          <h2 id="repro-title">4 · Reproduce in the CLI</h2>
          <p className="section-lede">The same candidate set resolves identically outside the browser.</p>
          <pre>
            <code>{`make test        # python fixtures + web/python parity
make demo        # the same pipeline in the terminal
`}</code>
          </pre>
          <p className="section-lede">Exact call for the set currently on the bench:</p>
          <pre className="wrapped">
            <code>{result?.cli ?? "Run an evaluation to render the matching CLI call."}</code>
          </pre>
        </section>

        <section id="evidence" className="evidence" aria-labelledby="evidence-title">
          <h2 id="evidence-title">5 · Evidence layer (separate from this lab)</h2>
          <p className="section-lede">
            This page proves resolver behaviour only. Storage claims live in the repository, where receipts can be read
            and re-checked independently.
          </p>
          <ul className="evidence-list">
            <li>
              <strong>evidence/mainnet-receipts.json</strong>
              <span>Committed receipts with blob identifiers, checked by <code>scripts/check_evidence.py</code>.</span>
            </li>
            <li>
              <strong>evidence/MAINNET_EVIDENCE.md</strong>
              <span>How each receipt was produced and how to re-verify it from a cold client.</span>
            </li>
            <li>
              <strong>Browser scope</strong>
              <span>Nothing on this page reads or writes Walrus Mainnet, so no storage proof is claimed here.</span>
            </li>
          </ul>
        </section>
      </main>

      <footer>
        <p>Memory Firewall · Walrus Sessions 7 · read-only browser lab over a committed resolver.</p>
      </footer>
    </div>
  );
}
