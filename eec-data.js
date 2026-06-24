// eec-org.js — EEC organizational chart roster (Executive Education Committee)
// Standalone data layer for the Org Chart section. No dependency on window.EEC.
// Photo files live in assets/people/<slug>.jpg (512x512). TBA seats show initials.
(function () {
  const email = (name) => {
    if (name === "TBA") return null;
    const parts = name.replace(/,.*$/, "").replace(/\(.*?\)/g, "").trim().toLowerCase()
      .split(/\s+/).filter((p) => p && !/^[a-z]\.?$/.test(p)); // drop middle initials
    if (!parts.length) return null;
    const first = parts[0], last = parts.slice(1).join("");
    return (last ? first + "." + last : first) + "@mssm.edu";
  };

  const TIERS = [
    { key: "cochair",  label: "Co-Chairs",                         sub: null,             voting: true,  color: "#221F72", deep: "#1A1857" },
    { key: "faculty",  label: "Faculty-at-Large",                  sub: "8 voting seats", voting: true,  color: "#00AEEF", deep: "#008CC0" },
    { key: "student",  label: "Student Representatives",           sub: "4 voting seats", voting: true,  color: "#D80B8C", deep: "#B0086F" },
    { key: "subchair", label: "Subcommittee Faculty Co-Chairs",    sub: "Non-voting",     voting: false, color: "#58595B", deep: "#3F4042" },
    { key: "rep",      label: "Director & Mentor Representatives", sub: "Non-voting",     voting: false, color: "#58595B", deep: "#3F4042" },
  ];

  const M = [
    // Co-Chairs (voting)
    { id: "francis",   name: "Michelle Y. Francis, MD",     role: "Faculty Co-Chair",        tier: "cochair", photo: "assets/people/michelle-francis.jpg" },
    { id: "soriano",   name: "Rainier Soriano, MD",         role: "Administrative Co-Chair",  tier: "cochair", photo: "assets/people/rainier-soriano.jpg", email: "rainier.soriano@mssm.edu" },
    // Faculty-at-Large (8 voting)
    { id: "tripathi",     name: "Ankita Tripathi, MD",      role: "General Faculty",   tier: "faculty", photo: "assets/people/ankita-tripathi.jpg" },
    { id: "gupta",        name: "Rohit R. Gupta, MD",       role: "Faculty-at-Large",  tier: "faculty", photo: "assets/people/rohit-gupta.jpg" },
    { id: "gunasekaran",  name: "Ganesh Gunasekaran, MD",   role: "Faculty-at-Large",  tier: "faculty", photo: "assets/people/ganesh-gunasekaran.jpg" },
    { id: "kamthan",      name: "Arvind Kamthan, MD",       role: "Faculty-at-Large",  tier: "faculty", photo: "assets/people/arvind-kamthan.jpg" },
    { id: "rice",         name: "Brian Rice, MD",           role: "Faculty-at-Large",  tier: "faculty", photo: "assets/people/brian-rice.jpg" },
    { id: "lee",          name: "Kyunghyun Lee, MD",        role: "Faculty-at-Large",  tier: "faculty", photo: "assets/people/kyunghyun-lee.jpg" },
    { id: "stern",        name: "Richard H. Stern, MD",     role: "Faculty-at-Large",  tier: "faculty", photo: "assets/people/richard-stern.jpg" },
    { id: "raghavan",     name: "Sreekala Raghavan, MD",    role: "Faculty-at-Large",  tier: "faculty", photo: "assets/people/sreekala-raghavan.jpg" },
    // Student Representatives (4 voting)
    { id: "tripp",   name: "Maggie Tripp",      role: "Phase 1 Student", tier: "student", photo: "assets/people/maggie-tripp.jpg" },
    { id: "zhang",   name: "Alan Zhang",        role: "Phase 2 Student", tier: "student", photo: "assets/people/alan-zhang.jpg" },
    { id: "frost",   name: "Jamie Frost",       role: "Phase 3 Student", tier: "student", photo: "assets/people/jamie-frost.jpg" },
    { id: "porras",  name: "Christian Porras",  role: "MSTP Student",    tier: "student", photo: "assets/people/christian-porras.jpg" },
    // Subcommittee Faculty Co-Chairs (non-voting)
    { id: "toniakim", name: "Tonia Kim, MD",    role: "PCCS Faculty Co-Chair", tier: "subchair", photo: "assets/people/tonia-kim.jpg" },
    { id: "chieco",   name: "Deanna Chieco, MD", role: "CCS Faculty Co-Chair", tier: "subchair", photo: "assets/people/deanna-chieco.jpg" },
    { id: "hess",     name: "Leona Hess, PhD",  role: "CIS Faculty Co-Chair",  tier: "subchair", photo: "assets/people/leona-hess.jpg" },
    { id: "aes-tba",  name: "TBA",              role: "AES Faculty Co-Chair",  tier: "subchair", photo: "" },
    // Director & Mentor Representatives (non-voting)
    { id: "abraham",   name: "Cynthia Abraham, MD",        role: "Module Director Representative",                 tier: "rep", photo: "assets/people/cynthia-abraham.jpg" },
    { id: "merrill",   name: "Eve Merrill, MD",            role: "Clerkship Director Representative",              tier: "rep", photo: "assets/people/eve-merrill.jpg" },
    { id: "kutscher",  name: "Eric Kutscher, MD",          role: "Clinical Competency Mentor",                     tier: "rep", photo: "assets/people/eric-kutscher.jpg" },
    { id: "rosenberg", name: "Brad R. Rosenberg, MD, PhD", role: "MSTP Program Representative",                     tier: "rep", photo: "assets/people/brad-rosenberg.jpg" },
    { id: "katz",      name: "Craig Katz, MD",             role: "Career and Professional Development Advisor",    tier: "rep", photo: "assets/people/craig-katz.jpg" },
    { id: "simma",     name: "Vannita Simma-Chiang, MD",   role: "Specialty Advisor",                              tier: "rep", photo: "assets/people/vannita-simma-chiang.jpg" },
  ];

  const tierByKey = {};
  TIERS.forEach((t) => { tierByKey[t.key] = t; });
  const members = M.map((m) => {
    const t = tierByKey[m.tier];
    return Object.assign({}, m, {
      voting: t.voting,
      email: m.email || email(m.name),
      isTBA: m.name === "TBA",
    });
  });
  const byId = {};
  members.forEach((m) => { byId[m.id] = m; });

  window.EEC_ORG = {
    tiers: TIERS,
    tierByKey,
    members,
    byId,
    votingCount: members.filter((m) => m.voting && !m.isTBA).length,
    nonVotingCount: members.filter((m) => !m.voting && !m.isTBA).length,
    namedCount: members.filter((m) => !m.isTBA).length,
  };
})();
