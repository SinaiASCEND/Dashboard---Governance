// eec-org.js — EEC organizational chart roster (Executive Education Committee)
// Source of truth: EEC Membership Roster, AY 2026-27 (Bylaws v2.3, Article III).
// Jared Kutzin (Faculty Co-Chair elect) intentionally excluded per current instruction.
// Photo files live in assets/people/<slug>.jpg (512x512). TBA seats show initials.
(function () {
  const TIERS = [
    { key: "cochair",  label: "Co-Chairs",                         sub: null,             voting: true,  color: "#221F72", deep: "#1A1857" },
    { key: "faculty",  label: "Faculty-at-Large",                  sub: "8 voting seats", voting: true,  color: "#00AEEF", deep: "#008CC0" },
    { key: "student",  label: "Student Representatives",           sub: "4 voting seats", voting: true,  color: "#D80B8C", deep: "#B0086F" },
    { key: "subchair", label: "Subcommittee Faculty Co-Chairs",    sub: "Non-voting",     voting: false, color: "#58595B", deep: "#3F4042" },
    { key: "rep",      label: "Director & Mentor Representatives", sub: "Non-voting",     voting: false, color: "#58595B", deep: "#3F4042" },
  ];

  // voting: omitted = inherit tier default; set explicitly only to override (e.g., Soriano).
  const M = [
    // -- Co-Chairs --
    { id: "francis", name: "Michelle Francis, MD", role: "Faculty Co-Chair", tier: "cochair",
      proTitle: "Assistant Professor — OB/GYN", email: "michelle.francis@mountsinai.org",
      start: "Jul 2023", renew: "Oct 2026", photo: "assets/people/michelle-francis.jpg" },
    { id: "soriano", name: "Rainier Soriano, MD", role: "Administrative Co-Chair", tier: "cochair", voting: false,
      proTitle: "Senior Associate Dean for Curricular Affairs", email: "rainier.soriano@mssm.edu",
      start: "Jul 2026", renew: "N/A", photo: "assets/people/rainier-soriano.jpg" },

    // -- Faculty-at-Large (8, voting) --
    { id: "tripathi", name: "Ankita Tripathi, MD", role: "General Faculty", tier: "faculty",
      proTitle: "Associate Program Director, MSW Residency Program, Neurology", email: "ankita.tripathi@mountsinai.org",
      start: "Jul 2025", renew: "Jul 2028", photo: "assets/people/ankita-tripathi.jpg" },
    { id: "gupta", name: "Rohit R. Gupta, MD", role: "General Faculty", tier: "faculty",
      proTitle: "Director, Surgical ICU, Mount Sinai Hospital", email: "rohit.gupta@mountsinai.org",
      start: "Jul 2025", renew: "Jul 2028", photo: "assets/people/rohit-gupta.jpg" },
    { id: "gunasekaran", name: "Ganesh Gunasekaran, MD", role: "General Faculty", tier: "faculty",
      proTitle: "Section Chief of Hepatobiliary Surgery", email: "ganesh.gunasekaran@mountsinai.org",
      start: "Jul 2025", renew: "Jul 2028", photo: "assets/people/ganesh-gunasekaran.jpg" },
    { id: "kamthan", name: "Arvind Kamthan, MD", role: "General Faculty", tier: "faculty",
      proTitle: "Associate Professor — Hematology and Medical Oncology", email: "arvind.kamthan@mountsinai.org",
      start: "Jul 2025", renew: "Jul 2028", photo: "assets/people/arvind-kamthan.jpg" },
    { id: "rice", name: "Brian Rice, MD", role: "General Faculty", tier: "faculty",
      proTitle: "Assistant Professor — Hospital Medicine", email: "brian.rice@mountsinai.org",
      start: "Jul 2025", renew: "Jul 2028", photo: "assets/people/brian-rice.jpg" },
    { id: "lee", name: "Kyunghyun Lee, MD", role: "General Faculty", tier: "faculty",
      proTitle: "Assistant Professor — Hospital Medicine", email: "kyunghyun.lee@mountsinai.org",
      start: "Jul 2024", renew: "Jul 2027", photo: "assets/people/kyunghyun-lee.jpg" },
    { id: "stern", name: "Richard Stern, MD", role: "General Faculty", tier: "faculty",
      proTitle: "Associate Professor — Radiology, Medical Education", email: "richard.stern@mountsinai.org",
      start: "Jul 2024", renew: "Jul 2027", photo: "assets/people/richard-stern.jpg" },
    { id: "raghavan", name: "Sreekala Raghavan, MD", role: "General Faculty", tier: "faculty",
      proTitle: "Associate Professor — General Internal Medicine, Medical Education", email: "sreekala.raghavan@mssm.edu",
      start: "Jul 2024", renew: "Jul 2027", photo: "assets/people/sreekala-raghavan.jpg" },

    // -- Student Representatives (4, voting) --
    { id: "tripp", name: "Maggie Tripp", role: "Phase 1 Student Representative", tier: "student",
      proTitle: "Student Representative, Phase 1", email: "maggie.tripp@icahn.mssm.edu",
      start: "Jul 2026", renew: "", photo: "assets/people/maggie-tripp.jpg" },
    { id: "zhang", name: "Alan Zhang", role: "Phase 2 Student Representative", tier: "student",
      proTitle: "Student Representative, Phase 2", email: "alan.zhang@icahn.mssm.edu",
      start: "Jan 2025", renew: "", note: "Automatic continuation from Phase 1 seat per Article VII.", photo: "assets/people/alan-zhang.jpg" },
    { id: "frost", name: "Jamie Frost", role: "Phase 3 Student Representative", tier: "student",
      proTitle: "Student Representative, Phase 3", email: "jamie.frost@icahn.mssm.edu",
      start: "Jul 2024", renew: "", photo: "assets/people/jamie-frost.jpg" },
    { id: "porras", name: "Christian Porras", role: "MSTP Student Representative", tier: "student",
      proTitle: "Student Representative, MSTP", email: "christian.porras@icahn.mssm.edu",
      start: "Jul 2026", renew: "", photo: "assets/people/christian-porras.jpg" },

    // -- Subcommittee Faculty Co-Chairs (non-voting) --
    { id: "toniakim", name: "Tonia Kim, MD", role: "PCCS Faculty Co-Chair", tier: "subchair",
      proTitle: "Pre-Clerkship Curriculum Subcommittee Faculty Co-Chair", email: "tonia.kim@mountsinai.org",
      start: "Jul 2026", renew: "Jul 2029", photo: "assets/people/tonia-kim.jpg" },
    { id: "chieco", name: "Deanna Chieco, MD", role: "CCS Faculty Co-Chair", tier: "subchair",
      proTitle: "Clinical Curriculum Subcommittee Faculty Co-Chair", email: "deanna.chieco@mountsinai.org",
      start: "Jul 2026", renew: "Jul 2029", photo: "assets/people/deanna-chieco.jpg" },
    { id: "hess", name: "Leona Hess, PhD", role: "CIS Faculty Co-Chair", tier: "subchair",
      proTitle: "Curriculum Integration Subcommittee Faculty Co-Chair", email: "leona.hess@mssm.edu",
      start: "Jul 2026", renew: "Jul 2029", photo: "assets/people/leona-hess.jpg" },
    { id: "aes-tba", name: "TBA", role: "AES Faculty Co-Chair", tier: "subchair",
      proTitle: "", email: "", start: "TBD", renew: "TBD", note: "Open seat.", photo: "" },

    // -- Director & Mentor Representatives (non-voting) --
    { id: "abraham", name: "Cynthia Abraham, MD", role: "Module Director Representative", tier: "rep",
      proTitle: "Module Director (Pre-clerkship)", email: "cynthia.abraham@mountsinai.org",
      start: "Dec 2025", renew: "Dec 2028", photo: "assets/people/cynthia-abraham.jpg" },
    { id: "merrill", name: "Eve Merrill, MD", role: "Clerkship Director Representative", tier: "rep",
      proTitle: "Clerkship Director (Inpatient Medicine)", email: "eve.merrill@mountsinai.org",
      start: "Jul 2025", renew: "Jul 2028", photo: "assets/people/eve-merrill.jpg" },
    { id: "kutscher", name: "Eric Kutscher, MD", role: "Clinical Competency Mentor Representative", tier: "rep",
      proTitle: "Assistant Professor — General Internal Medicine", email: "eric.kutscher@mountsinai.org",
      start: "Jul 2025", renew: "Jul 2028", photo: "assets/people/eric-kutscher.jpg" },
    { id: "rosenberg", name: "Brad Rosenberg, MD, PhD", role: "MSTP Program Representative", tier: "rep",
      proTitle: "Associate Professor, Microbiology; MSTP Program Director", email: "brad.rosenberg@mssm.edu",
      start: "Jul 2026", renew: "Jul 2029", photo: "assets/people/brad-rosenberg.jpg" },
    { id: "katz", name: "Craig Katz, MD", role: "Career and Professional Development Advisor Representative", tier: "rep",
      proTitle: "Clinical Professor, Psychiatry, Medical Education, and Health System Design & Global Health", email: "craig.katz@mssm.edu",
      start: "Dec 2025", renew: "Dec 2028", photo: "assets/people/craig-katz.jpg" },
    { id: "simma", name: "Vannita Simma-Chiang, MD", role: "Specialty Advisor Representative", tier: "rep",
      proTitle: "Director of Specialty Advising", email: "vannita.simma-chiang@mountsinai.org",
      start: "Mar 2026", renew: "Mar 2029", photo: "assets/people/vannita-simma-chiang.jpg" },
  ];

  const tierByKey = {};
  TIERS.forEach((t) => { tierByKey[t.key] = t; });
  const members = M.map((m) => {
    const t = tierByKey[m.tier];
    return Object.assign({}, m, {
      voting: (m.voting !== undefined) ? m.voting : t.voting,
      email: m.email || null,
      isTBA: m.name === "TBA",
    });
  });
  const byId = {};
  members.forEach((m) => { byId[m.id] = m; });

  const votingCount = members.filter((m) => m.voting && !m.isTBA).length;
  window.EEC_ORG = {
    tiers: TIERS,
    tierByKey,
    members,
    byId,
    votingCount: votingCount,
    nonVotingCount: members.filter((m) => !m.voting && !m.isTBA).length,
    namedCount: members.filter((m) => !m.isTBA).length,
    totalSeats: members.length,
    votingSeats: votingCount,                // 13 per Bylaws v2.3, Art. III
    quorum: Math.floor(votingCount / 2) + 1, // >50% of voting members = 7
  };
})();
