/* ============================================================================
 * planned-agenda.js  —  ASCEND Curriculum Governance Dashboard
 * ----------------------------------------------------------------------------
 * Supplies UPCOMING (pre-meeting) agendas for any committee + date, without
 * having to add a meeting record to eec-data.js. The dashboard apps call
 * window.PLANNED_AGENDA.itemsFor(committee, date); for a "Scheduled" meeting
 * those items are folded into the meeting's agenda and shown as the planned
 * agenda. Once real minutes are filed for that date, the meeting record in
 * eec-data.js takes over and this planned agenda is no longer used.
 *
 * LOAD ORDER: include this file AFTER eec-data.js / mobile-schedules.js and
 * BEFORE desktop-app.jsx / mobile-app.jsx, e.g.:
 *     <script src="eec-data.js"></script>
 *     <script src="mobile-schedules.js"></script>
 *     <script src="planned-agenda.js"></script>     <-- add this line
 *     <script type="text/babel" src="mobile-app.jsx"></script>
 *
 * ----------------------------------------------------------------------------
 * AGENDA ITEM SHAPE (every field optional except `title`):
 *   {
 *     n:        "6.1",                 // section/agenda number (shown as §6.1)
 *     category: "VOTING ITEM",         // drives the pill color/label. Use one of:
 *                                      //   "VOTING ITEM"  -> violet pill
 *                                      //   "FOR DISCUSSION" -> cyan pill
 *                                      //   "FOR REVIEW"   -> muted pill
 *                                      //   (anything else) -> muted pill
 *     ready:    "YES",                 // if it contains "YES", shows a READY badge
 *     title:    "Module Review — Renal",        // REQUIRED
 *     subitems: ["Background", "Action plan"],  // optional bullet list
 *     owner:    "PCCS",                // "Subcommittee owner:" line
 *     presenter:"Staci Leisman, MD",   // "Presenter:" line
 *     guests:   "Dr. Jane Doe",        // "Guests:" line
 *     goesToEEC:"2026-07-10",          // date this item feeds up to the EEC
 *   }
 *
 * KEY FORMAT: "COMMITTEE|YYYY-MM-DD"  (committee must match an id in
 * eec-data.js COMMITTEES: EEC, PCCS, CCS, CIS, AES — and the date must match a
 * scheduled meeting date for that committee in mobile-schedules.js, otherwise
 * there is no scheduled meeting for the agenda to attach to.)
 * ==========================================================================*/

(function () {
  "use strict";

  // ── Planned agendas, keyed "COMMITTEE|YYYY-MM-DD" ─────────────────────────
  // Add entries here. To remove one, delete its key. Editing is safe at any
  // time — nothing else in the dashboard needs to change.
  const AGENDAS = {

    // ---- EXAMPLE (commented out) -------------------------------------------
    // Uncomment, change the committee/date to a real scheduled meeting date,
    // reload the dashboard, and open that meeting on the desktop view to see
    // the planned agenda render. Delete once you've confirmed it works.
    //
    // "PCCS|2026-06-09": [
    //   {
    //     n: "1",
    //     category: "FOR REVIEW",
    //     title: "Approval of Prior Meeting Minutes",
    //     presenter: "Staci Leisman, MD",
    //   },
    //   {
    //     n: "2",
    //     category: "VOTING ITEM",
    //     ready: "YES",
    //     title: "Phase 1 Module Review — Renal",
    //     subitems: [
    //       "Annual module review and student feedback",
    //       "Proposed action plan for AY 2026–27",
    //     ],
    //     owner: "PCCS",
    //     presenter: "Tonia Kim, MD",
    //     goesToEEC: "2026-07-10",
    //   },
    // ],

  };

  // ── Public interface ──────────────────────────────────────────────────────
  function key(committee, date) {
    return String(committee) + "|" + String(date);
  }

  window.PLANNED_AGENDA = {
    // Raw table, exposed for inspection/debugging.
    AGENDAS,

    // Primary interface the dashboard calls. Returns [] when nothing is planned
    // (callers already treat an empty array as "no planned agenda").
    itemsFor(committee, date) {
      const items = AGENDAS[key(committee, date)];
      return Array.isArray(items) ? items : [];
    },

    // Convenience: list the dates that have a planned agenda for a committee.
    datesFor(committee) {
      const prefix = String(committee) + "|";
      return Object.keys(AGENDAS)
        .filter((k) => k.indexOf(prefix) === 0)
        .map((k) => k.slice(prefix.length))
        .sort();
    },

    // Convenience: add/replace a planned agenda at runtime (handy for testing
    // from the console). Persisting still means editing the AGENDAS table above.
    set(committee, date, items) {
      AGENDAS[key(committee, date)] = Array.isArray(items) ? items : [];
      return AGENDAS[key(committee, date)];
    },
  };
})();
