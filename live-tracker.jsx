// live-tracker.jsx — Live EEC attendance tracker (checkboxes + quorum flag).
// Loads AFTER membership-attendance.jsx. Attaches LiveAttendanceTracker to
// window.MobileSections.

const { useState: useStateLT, useMemo: useMemoLT, useEffect: useEffectLT } = React;

const LT_CSS = `
.lt-header {
  background: var(--paper);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
  border-top: 3px solid var(--brand-magenta);
}
.lt-header .eyebrow {
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--brand-magenta-deep); font-weight: 600;
}
.lt-header h2 {
  font-family: var(--serif); font-size: 18px; font-weight: 600;
  letter-spacing: -0.01em; margin: 4px 0 0;
}
.lt-date {
  margin-top: 10px;
  display: flex; align-items: center; gap: 8px;
}
.lt-date input {
  -webkit-appearance: none; appearance: none;
  background: var(--grey-1); border: 1px solid var(--grey-2);
  border-radius: 8px; padding: 7px 10px;
  font-family: var(--sans); font-size: 12.5px; color: var(--ink);
  font-weight: 500;
}

/* Quorum banner */
.lt-quorum {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px; align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04);
}
.lt-quorum.met     { background: var(--good-tint);  color: var(--good);  border: 1px solid var(--good); }
.lt-quorum.not-met { background: var(--warn-tint);  color: var(--warn);  border: 1px solid var(--warn); }
.lt-quorum .icon {
  width: 36px; height: 36px; border-radius: 50%;
  background: currentColor;
  color: var(--paper);
  display: grid; place-items: center;
}
.lt-quorum .icon svg { color: var(--paper); }
.lt-quorum .lbl {
  font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase;
  font-weight: 700; opacity: 0.85;
}
.lt-quorum .val {
  font-family: var(--serif); font-size: 17px; font-weight: 600;
  letter-spacing: -0.01em; margin-top: 1px;
}
.lt-quorum .ratio {
  font-family: var(--mono); font-size: 13px; font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* Counts row under quorum */
.lt-counts {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 8px; margin-bottom: 12px;
}
.lt-count-cell {
  background: var(--paper);
  border-radius: 10px;
  padding: 8px 10px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.lt-count-cell .lbl {
  font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--grey-7); font-weight: 700;
}
.lt-count-cell .val {
  font-family: var(--serif); font-size: 19px; font-weight: 600;
  margin-top: 1px;
  font-variant-numeric: tabular-nums;
}

/* Group header inside roster list */
.lt-group {
  font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 700;
  display: flex; align-items: center; gap: 8px;
  padding: 18px 4px 6px;
}
.lt-group .pill {
  font-family: var(--mono); font-size: 10px;
  padding: 1px 6px; border-radius: 999px;
  background: var(--grey-2); color: var(--grey-11); font-weight: 700;
  letter-spacing: 0;
}
.lt-group .toggle-all {
  margin-left: auto;
  font-size: 10.5px; font-weight: 600; color: var(--brand-cyan-deep);
  background: transparent; border: 0; cursor: pointer;
  letter-spacing: 0; text-transform: none;
}

/* Member checkbox row */
.lt-row {
  background: var(--paper);
  border-bottom: 1px solid var(--grey-2);
  padding: 10px 12px;
  display: grid; grid-template-columns: 36px 1fr auto; gap: 10px;
  align-items: center;
  cursor: pointer;
  border-left: 0; border-right: 0; border-top: 0;
  width: 100%; text-align: left;
}
.lt-row:active { background: var(--grey-1); }
.lt-row.checked { background: var(--good-tint); }
.lt-row.checked .name { color: var(--good); }
.lt-card { background: var(--paper); border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06); margin-bottom: 8px; }
.lt-row .check {
  width: 26px; height: 26px; border-radius: 7px;
  border: 2px solid var(--grey-5);
  background: var(--paper);
  display: grid; place-items: center;
  flex: 0 0 26px;
}
.lt-row.checked .check {
  background: var(--good); border-color: var(--good); color: #fff;
}
.lt-row .name {
  font-family: var(--serif); font-size: 14px; font-weight: 600;
  color: var(--ink); letter-spacing: -0.005em;
  line-height: 1.25;
}
.lt-row .sub {
  font-size: 11px; color: var(--grey-11);
  margin-top: 2px; line-height: 1.35;
}
.lt-row .marker {
  font-size: 9.5px; letter-spacing: 0.06em; text-transform: uppercase;
  font-weight: 700;
  padding: 2px 7px; border-radius: 4px;
}
.lt-row .marker.v  { background: var(--brand-magenta); color: #fff; }
.lt-row .marker.nv { background: var(--grey-2); color: var(--grey-11); }

/* Guests + notes */
.lt-textfield {
  background: var(--paper);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.lt-textfield .lbl {
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 700;
  margin-bottom: 8px;
}
.lt-guests {
  display: flex; flex-direction: column; gap: 6px;
  margin-bottom: 8px;
}
.lt-guest-row {
  display: grid; grid-template-columns: 1fr auto;
  gap: 6px; align-items: center;
}
.lt-guest-row input {
  -webkit-appearance: none; appearance: none;
  background: var(--grey-1); border: 1px solid var(--grey-2);
  border-radius: 8px; padding: 8px 11px;
  font-family: var(--sans); font-size: 13px; color: var(--ink);
}
.lt-guest-row .del {
  background: transparent; border: 0; color: var(--grey-7);
  width: 28px; height: 28px; border-radius: 6px;
  display: grid; place-items: center; cursor: pointer;
}
.lt-add-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; color: var(--brand-cyan-deep); font-weight: 600;
  background: transparent; border: 0; cursor: pointer;
  padding: 4px 0;
}
.lt-notes textarea {
  width: 100%; box-sizing: border-box; resize: vertical;
  min-height: 70px;
  background: var(--grey-1); border: 1px solid var(--grey-2);
  border-radius: 8px; padding: 10px 11px;
  font-family: var(--sans); font-size: 12.5px; color: var(--ink);
  line-height: 1.5;
}

/* Footer actions */
.lt-footer {
  position: sticky; bottom: 0;
  background: linear-gradient(180deg, rgba(245,246,247,0) 0%, rgba(245,246,247,0.96) 30%);
  padding: 16px 0 6px;
  display: flex; gap: 8px;
  z-index: 5;
}
.lt-footer button {
  flex: 1;
  border: 0; border-radius: 999px;
  font-family: var(--sans); font-size: 13px; font-weight: 600;
  padding: 12px 18px; cursor: pointer;
}
.lt-footer .secondary {
  background: var(--paper); color: var(--ink);
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.lt-footer .primary {
  background: var(--brand-magenta); color: #fff;
  box-shadow: 0 4px 12px -6px rgba(216,11,140,0.45);
}

/* Output (review) screen */
.lt-out-card {
  background: var(--paper); border-radius: 12px;
  padding: 12px 14px; margin-bottom: 10px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.lt-out-card .head {
  display: flex; align-items: center; gap: 8px;
  font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--grey-11); font-weight: 700;
  margin-bottom: 8px;
}
.lt-out-card .head .stripe { width: 6px; height: 14px; border-radius: 2px; }
.lt-out-card .head .count {
  margin-left: auto;
  font-family: var(--mono); font-weight: 700;
  color: var(--ink); font-size: 12px;
}
.lt-out-card ul {
  margin: 0; padding: 0; list-style: none;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
  font-size: 12.5px; color: var(--ink-2);
  line-height: 1.45;
}
.lt-out-card ul li {
  padding: 2px 0;
}
.lt-out-card.empty {
  text-align: center; color: var(--grey-7);
  font-style: italic; font-size: 11.5px;
  padding: 14px;
}
`;

function ensureLTCss() {
  if (document.getElementById("__lt_css")) return;
  const s = document.createElement("style");
  s.id = "__lt_css";
  s.textContent = LT_CSS;
  document.head.appendChild(s);
}

// ─── Persistence keys ─────────────────────────────────────────────────────
function trackerKey(date) { return `eec-att:${date}`; }
function loadTracker(date) {
  try { return JSON.parse(localStorage.getItem(trackerKey(date)) || "null"); }
  catch { return null; }
}
function saveTracker(date, state) {
  try { localStorage.setItem(trackerKey(date), JSON.stringify(state)); } catch {}
}

function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

// ─── Tracker screen ────────────────────────────────────────────────────────
function LiveAttendanceTracker({ ay, onDone }) {
  ensureLTCss();
  const R = window.ROSTERS;
  const roster = useMemoLT(() => R ? R.rosterFor("EEC", { date }) : [], [date]);

  // Default to today, unless today is far outside the chosen AY — then use the
  // first day of that AY.
  const initialDate = useMemoLT(() => {
    const t = todayLocal();
    if (!R || !ay) return t;
    const r = R.AY_RANGES[ay];
    if (t >= r.start && t <= r.end) return t;
    return r.start;
  }, [ay]);

  const [date, setDate] = useStateLT(initialDate);
  const [present, setPresent] = useStateLT({});      // memberId -> true
  const [guests, setGuests] = useStateLT([""]);
  const [notes, setNotes]   = useStateLT("");
  const [view,  setView]    = useStateLT("take");    // "take" | "review"

  // Load saved state for the chosen date.
  useEffectLT(() => {
    const saved = loadTracker(date);
    if (saved) {
      setPresent(saved.present || {});
      setGuests(saved.guests && saved.guests.length ? saved.guests : [""]);
      setNotes(saved.notes || "");
    } else {
      setPresent({});
      setGuests([""]);
      setNotes("");
    }
  }, [date]);

  // Auto-persist.
  useEffectLT(() => {
    saveTracker(date, { present, guests, notes });
  }, [date, present, guests, notes]);

  // Partition roster.
  const voting    = useMemoLT(() => roster.filter(r => r.voting),  [roster]);
  const nonVoting = useMemoLT(() => roster.filter(r => !r.voting), [roster]);

  // Live counts.
  const counts = useMemoLT(() => {
    let vp=0, va=0, np=0, na=0;
    for (const r of voting)    { if (present[r.id]) vp++; else va++; }
    for (const r of nonVoting) { if (present[r.id]) np++; else na++; }
    const cleanGuests = guests.map(g => g.trim()).filter(Boolean);
    return { vp, va, np, na, guests: cleanGuests.length, total: vp + np };
  }, [voting, nonVoting, present, guests]);

  const QUORUM = 7;
  const VOTE_TOTAL = voting.length;
  const quorumMet = counts.vp >= QUORUM;

  function toggle(id) {
    setPresent(p => ({ ...p, [id]: !p[id] }));
  }
  function markAll(rows, value) {
    setPresent(p => {
      const next = { ...p };
      for (const r of rows) next[r.id] = value;
      return next;
    });
  }
  function updateGuest(i, val) {
    setGuests(g => { const out = [...g]; out[i] = val; return out; });
  }
  function addGuest()    { setGuests(g => [...g, ""]); }
  function removeGuest(i){ setGuests(g => g.length === 1 ? [""] : g.filter((_, j) => j !== i)); }

  if (view === "review") {
    return <TrackerReview
              date={date} ay={ay}
              voting={voting} nonVoting={nonVoting}
              present={present}
              guests={guests.map(g => g.trim()).filter(Boolean)}
              notes={notes}
              counts={counts}
              quorumMet={quorumMet} quorum={QUORUM} voteTotal={VOTE_TOTAL}
              onEdit={() => setView("take")}
              onDone={onDone} />;
  }

  return (
    <div className="m-body">
      <div className="lt-header">
        <div className="eyebrow">EEC · {R ? R.AY_RANGES[ay].label : ""}</div>
        <h2>Take attendance</h2>
        <div className="lt-date">
          <span style={{ fontSize: 11, color: "var(--grey-11)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Meeting date</span>
          <input type="date" value={date}
                 min={R ? R.AY_RANGES[ay].start : undefined}
                 max={R ? R.AY_RANGES[ay].end   : undefined}
                 onChange={e => setDate(e.target.value)} />
        </div>
      </div>

      {/* Quorum banner */}
      <div className={"lt-quorum " + (quorumMet ? "met" : "not-met")}>
        <div className="icon">
          {quorumMet ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16.5" r="0.5" fill="currentColor"/></svg>
          )}
        </div>
        <div>
          <div className="lbl">{quorumMet ? "Quorum met" : "Quorum not met"}</div>
          <div className="val">{counts.vp} voting present</div>
        </div>
        <div className="ratio">
          {counts.vp}/{QUORUM}
          <div style={{ fontSize: 9.5, fontFamily: "var(--sans)", fontWeight: 600, opacity: 0.7, marginTop: 2, letterSpacing: "0.04em" }}>
            of {VOTE_TOTAL} voting
          </div>
        </div>
      </div>

      {/* Live counts */}
      <div className="lt-counts">
        <div className="lt-count-cell"><div className="lbl">Present</div><div className="val" style={{ color: "var(--good)" }}>{counts.total}</div></div>
        <div className="lt-count-cell"><div className="lbl">Absent</div><div className="val" style={{ color: "var(--bad)" }}>{counts.va + counts.na}</div></div>
        <div className="lt-count-cell"><div className="lbl">Guests</div><div className="val" style={{ color: "var(--brand-cyan-deep)" }}>{counts.guests}</div></div>
      </div>

      {/* Voting members */}
      <RosterGroup label="Voting members" badge="V"
                   rows={voting} present={present} onToggle={toggle}
                   onAll={(v) => markAll(voting, v)} />

      {/* Non-voting members */}
      <RosterGroup label="Non-voting members" badge="NV"
                   rows={nonVoting} present={present} onToggle={toggle}
                   onAll={(v) => markAll(nonVoting, v)} />

      {/* Guests */}
      <div className="lt-textfield">
        <div className="lbl">Guests</div>
        <div className="lt-guests">
          {guests.map((g, i) => (
            <div key={i} className="lt-guest-row">
              <input value={g} onChange={e => updateGuest(i, e.target.value)}
                     placeholder="Name · role / affiliation (optional)" />
              <button className="del" title="Remove" onClick={() => removeGuest(i)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>
          ))}
        </div>
        <button className="lt-add-btn" onClick={addGuest}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>
          Add guest
        </button>
      </div>

      {/* Notes */}
      <div className="lt-textfield lt-notes">
        <div className="lbl">Additional notes</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Anything else for the record — late arrivals, partial attendance, recusals, etc." />
      </div>

      {/* Footer */}
      <div className="lt-footer">
        <button className="secondary" onClick={onDone}>Cancel</button>
        <button className="primary" onClick={() => setView("review")}>
          Generate output
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6, verticalAlign: "middle" }}>
            <polyline points="9 6 15 12 9 18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function RosterGroup({ label, badge, rows, present, onToggle, onAll }) {
  const presentCount = rows.filter(r => present[r.id]).length;
  const allChecked = presentCount === rows.length && rows.length > 0;
  return (
    <>
      <div className="lt-group">
        <span>{label}</span>
        <span className="pill">{presentCount} / {rows.length}</span>
        <button className="toggle-all" onClick={() => onAll(!allChecked)}>
          {allChecked ? "Clear all" : "Mark all present"}
        </button>
      </div>
      <div className="lt-card">
        {rows.map(r => {
          const isOn = !!present[r.id];
          return (
            <button key={r.id} className={"lt-row" + (isOn ? " checked" : "")}
                    onClick={() => onToggle(r.id)}>
              <div className="check">
                {isOn && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="name">{r.name.split(",")[0].trim()}</div>
                {r.title && <div className="sub">{r.title}</div>}
              </div>
              <span className={"marker " + (r.voting ? "v" : "nv")}>{badge}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─── Review (output) screen ────────────────────────────────────────────────
function TrackerReview({ date, ay, voting, nonVoting, present, guests, notes, counts, quorumMet, quorum, voteTotal, onEdit, onDone }) {
  const R = window.ROSTERS;

  const votingPresent    = voting.filter(r =>  present[r.id]);
  const votingAbsent     = voting.filter(r => !present[r.id]);
  const nonVotingPresent = nonVoting.filter(r =>  present[r.id]);
  const nonVotingAbsent  = nonVoting.filter(r => !present[r.id]);

  const fmtDate = (d) => {
    const dt = window.MS_DATE ? window.MS_DATE.parseLocal(d) : new Date(d);
    return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  function buildPrintable() {
    const ayLbl = R ? R.AY_RANGES[ay].label : "";
    const list = (rows) => rows.length
      ? `<ul>${rows.map(r => `<li>${r.name.split(",")[0].trim()}${r.title ? ` — <span style="color:#5a6373">${r.title}</span>` : ""}</li>`).join("")}</ul>`
      : `<p style="color:#9aa0a8;font-style:italic">None</p>`;
    const guestList = guests.length
      ? `<ul>${guests.map(g => `<li>${g}</li>`).join("")}</ul>`
      : `<p style="color:#9aa0a8;font-style:italic">None</p>`;
    return `
      <h1>EEC Attendance — ${fmtDate(date)}</h1>
      <div class="meta">${ayLbl} · Quorum ${quorum} of ${voteTotal} voting · ${quorumMet ? "QUORUM MET" : "QUORUM NOT MET"}</div>

      <h2>Voting members present (${votingPresent.length})</h2>${list(votingPresent)}
      <h2>Voting members absent (${votingAbsent.length})</h2>${list(votingAbsent)}
      <h2>Non-voting members present (${nonVotingPresent.length})</h2>${list(nonVotingPresent)}
      <h2>Non-voting members absent (${nonVotingAbsent.length})</h2>${list(nonVotingAbsent)}
      <h2>Guests (${guests.length})</h2>${guestList}
      <h2>Additional notes</h2>${notes ? `<p style="white-space:pre-wrap">${notes.replace(/</g,"&lt;")}</p>` : `<p style="color:#9aa0a8;font-style:italic">None recorded</p>`}
    `;
  }

  function handlePrint() {
    if (window.MobileSections && window.MobileSections._openPrintWindow) {
      window.MobileSections._openPrintWindow(`EEC Attendance — ${date}`, buildPrintable());
      return;
    }
    // Fallback: inline popup.
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) { alert("Pop-up blocked"); return; }
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>EEC Attendance — ${date}</title>
      <style>body{font-family:system-ui;margin:0;padding:32px;font-size:13px;line-height:1.5}
      h1{font-size:22px;margin:0 0 4px}.meta{color:#5a6373;font-size:11px;margin-bottom:18px}
      h2{font-size:13px;margin:18px 0 6px}ul{margin:0;padding-left:18px}
      @media print{body{padding:18px}}</style></head>
      <body>${buildPrintable()}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 250);
  }

  function handleCsv() {
    const lines = [
      ["Category","Name","Role/Title"],
      ...votingPresent.map(r => ["Voting present", r.name.split(",")[0].trim(), r.title || ""]),
      ...votingAbsent.map(r => ["Voting absent",  r.name.split(",")[0].trim(), r.title || ""]),
      ...nonVotingPresent.map(r => ["Non-voting present", r.name.split(",")[0].trim(), r.title || ""]),
      ...nonVotingAbsent.map(r => ["Non-voting absent",  r.name.split(",")[0].trim(), r.title || ""]),
      ...guests.map(g => ["Guest", g, ""]),
    ];
    if (notes) lines.push(["Note", notes, ""]);
    const csv = lines.map(row => row.map(v => /[",\n]/.test(v) ? `"${v.replace(/"/g,'""')}"` : v).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `eec-attendance-${date}.csv`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }

  function copySummary() {
    const text =
      `EEC ATTENDANCE — ${fmtDate(date)}\n` +
      `${R.AY_RANGES[ay].label} · Quorum ${quorum} of ${voteTotal} voting · ${quorumMet ? "QUORUM MET" : "QUORUM NOT MET"}\n\n` +
      `VOTING MEMBERS PRESENT (${votingPresent.length}):\n${votingPresent.map(r => "  • " + r.name.split(",")[0].trim()).join("\n") || "  (none)"}\n\n` +
      `VOTING MEMBERS ABSENT (${votingAbsent.length}):\n${votingAbsent.map(r => "  • " + r.name.split(",")[0].trim()).join("\n") || "  (none)"}\n\n` +
      `NON-VOTING MEMBERS PRESENT (${nonVotingPresent.length}):\n${nonVotingPresent.map(r => "  • " + r.name.split(",")[0].trim()).join("\n") || "  (none)"}\n\n` +
      `NON-VOTING MEMBERS ABSENT (${nonVotingAbsent.length}):\n${nonVotingAbsent.map(r => "  • " + r.name.split(",")[0].trim()).join("\n") || "  (none)"}\n\n` +
      `GUESTS (${guests.length}):\n${guests.map(g => "  • " + g).join("\n") || "  (none)"}\n\n` +
      `ADDITIONAL NOTES:\n${notes || "(none)"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => alert("Summary copied to clipboard."),
        () => alert("Could not copy to clipboard."));
    }
  }

  const Section = ({ title, stripe, rows, isGuests }) => (
    <div className={"lt-out-card" + (rows.length === 0 ? "" : "")}>
      <div className="head">
        <span className="stripe" style={{ background: stripe }}></span>
        {title}
        <span className="count">{rows.length}</span>
      </div>
      {rows.length === 0 ? (
        <div style={{ fontStyle: "italic", color: "var(--grey-7)", fontSize: 11.5 }}>None</div>
      ) : (
        <ul>
          {rows.map((r, i) => (
            <li key={i}>{isGuests ? r : r.name.split(",")[0].trim()}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="m-body">
      <div className="lt-header">
        <div className="eyebrow">EEC · {R ? R.AY_RANGES[ay].label : ""}</div>
        <h2>{fmtDate(date)}</h2>
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--grey-11)" }}>
          Output below. Quorum: {quorum} of {voteTotal} voting · counted {counts.vp}.
        </div>
      </div>

      <div className={"lt-quorum " + (quorumMet ? "met" : "not-met")}>
        <div className="icon">
          {quorumMet
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16.5" r="0.5" fill="currentColor"/></svg>}
        </div>
        <div>
          <div className="lbl">{quorumMet ? "Quorum met" : "Quorum NOT met"}</div>
          <div className="val">{counts.vp} voting present</div>
        </div>
        <div className="ratio">{counts.vp}/{quorum}</div>
      </div>

      <div className="m-toolbar">
        <button className="m-tool-btn" onClick={handlePrint}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / PDF
        </button>
        <button className="m-tool-btn" onClick={handleCsv}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          CSV
        </button>
        <button className="m-tool-btn" onClick={copySummary}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy
        </button>
      </div>

      <Section title="Voting members present"    stripe="var(--good)"          rows={votingPresent} />
      <Section title="Voting members absent"     stripe="var(--bad)"           rows={votingAbsent} />
      <Section title="Non-voting members present" stripe="var(--brand-cyan)"   rows={nonVotingPresent} />
      <Section title="Non-voting members absent"  stripe="var(--grey-7)"       rows={nonVotingAbsent} />
      <Section title="Guests"                     stripe="var(--brand-violet)" rows={guests} isGuests />

      <div className="lt-out-card">
        <div className="head">
          <span className="stripe" style={{ background: "var(--brand-magenta)" }}></span>
          Additional notes
        </div>
        {notes ? (
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{notes}</div>
        ) : (
          <div style={{ fontStyle: "italic", color: "var(--grey-7)", fontSize: 11.5 }}>None recorded</div>
        )}
      </div>

      <div className="lt-footer">
        <button className="secondary" onClick={onEdit}>Edit</button>
        <button className="primary" onClick={onDone}>Done</button>
      </div>
    </div>
  );
}

// ─── Attach ────────────────────────────────────────────────────────────────
(function attach() {
  if (!window.MobileSections) { requestAnimationFrame(attach); return; }
  window.MobileSections.LiveAttendanceTracker = LiveAttendanceTracker;
})();
