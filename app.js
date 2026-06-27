const STORAGE_KEY = "nexus-ai-state-v1";

const starterState = {
  profile: {
    targetRole: "Data Analyst Intern",
    major: "Information Systems",
    graduation: "May 2029",
    weeklyHours: 8
  },
  applications: [
    {
      id: createId(),
      company: "UMBC DoIT",
      role: "Student IT Assistant",
      status: "Applied",
      deadline: "2026-07-12",
      link: "",
      notes: "Follow up with a concise email after one week."
    },
    {
      id: createId(),
      company: "Handshake",
      role: "AI Data Trainer",
      status: "Interview",
      deadline: "2026-07-03",
      link: "",
      notes: "Prepare one AI evaluation example and one data quality story."
    }
  ],
  certifications: [
    {
      id: createId(),
      name: "PL-300 Power BI Data Analyst",
      provider: "Microsoft",
      progress: 28,
      target: "2026-08-15",
      link: ""
    },
    {
      id: createId(),
      name: "Google Advanced Data Analytics",
      provider: "Google",
      progress: 12,
      target: "2026-09-01",
      link: ""
    }
  ],
  projects: [
    {
      id: createId(),
      name: "CareerLens AI",
      stack: "HTML, CSS, JavaScript",
      stage: "Published",
      link: "https://jasonbinong.github.io/CareerLens-AI/",
      impact: "Analyzes career readiness signals and skill gaps for students."
    },
    {
      id: createId(),
      name: "15 Weeks at UMBC",
      stack: "HTML, CSS, JavaScript",
      stage: "Published",
      link: "https://jasonbinong.github.io/15-Weeks-At-UMBC/",
      impact: "Turns a semester experience into an interactive student game."
    }
  ],
  networking: [
    {
      id: createId(),
      name: "Color Stack mentor",
      organization: "Color Stack",
      status: "Follow up",
      next: "2026-07-01",
      notes: "Ask for feedback on portfolio project positioning."
    }
  ],
  interviews: [
    {
      id: createId(),
      role: "Data Analyst Intern",
      company: "Campus employer",
      type: "Behavioral",
      date: "2026-07-10",
      notes: "Practice STAR stories about learning JavaScript and SQL."
    }
  ],
  goals: [
    {
      id: createId(),
      goal: "Publish three portfolio projects",
      category: "Portfolio",
      progress: 67,
      due: "2026-08-01",
      nextStep: "Improve README screenshots and add LinkedIn descriptions."
    },
    {
      id: createId(),
      goal: "Apply to 20 internships",
      category: "Internships",
      progress: 25,
      due: "2026-09-15",
      nextStep: "Add five target roles by Sunday."
    }
  ],
  resume: "Information Systems student focused on data analytics, AI evaluation, Power BI, JavaScript, SQL, and portfolio projects.",
  activity: []
};

const schemas = {
  applications: [
    ["company", "Company", "text"],
    ["role", "Role", "text"],
    ["status", "Status", "select", ["Wishlist", "Applied", "Interview", "Offer", "Rejected"]],
    ["deadline", "Deadline", "date"],
    ["link", "Posting link", "url"],
    ["notes", "Notes / next action", "text"]
  ],
  certifications: [
    ["name", "Certification", "text"],
    ["provider", "Provider", "text"],
    ["progress", "Progress %", "number"],
    ["target", "Target date", "date"],
    ["link", "Course / credential link", "url"]
  ],
  projects: [
    ["name", "Project name", "text"],
    ["stack", "Tech stack", "text"],
    ["stage", "Stage", "select", ["Planning", "Building", "Published", "Improving"]],
    ["link", "GitHub or demo link", "url"],
    ["impact", "Impact / result", "text"]
  ],
  networking: [
    ["name", "Person", "text"],
    ["organization", "Company / community", "text"],
    ["status", "Status", "select", ["To contact", "Messaged", "Met", "Follow up"]],
    ["next", "Next follow-up", "date"],
    ["notes", "Context / message idea", "text"]
  ],
  interviews: [
    ["role", "Target role", "text"],
    ["company", "Company", "text"],
    ["type", "Type", "select", ["Behavioral", "Technical", "Case", "Portfolio review"]],
    ["date", "Date", "date"],
    ["notes", "Practice focus", "text"]
  ],
  goals: [
    ["goal", "Goal", "text"],
    ["category", "Category", "text"],
    ["progress", "Progress %", "number"],
    ["due", "Due date", "date"],
    ["nextStep", "Next step", "text"]
  ]
};

let state = loadState();
let currentView = "dashboard";
let editing = null;

const els = {
  navItems: [...document.querySelectorAll(".nav-item")],
  views: [...document.querySelectorAll(".view")],
  viewTitle: document.querySelector("#viewTitle"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  clearButton: document.querySelector("#clearButton"),
  profileForm: document.querySelector("#profileForm"),
  careerScore: document.querySelector("#careerScore"),
  readinessTitle: document.querySelector("#readinessTitle"),
  readinessSummary: document.querySelector("#readinessSummary"),
  activeApps: document.querySelector("#activeApps"),
  activeCerts: document.querySelector("#activeCerts"),
  projectCount: document.querySelector("#projectCount"),
  networkCount: document.querySelector("#networkCount"),
  coachList: document.querySelector("#coachList"),
  weeklyPlan: document.querySelector("#weeklyPlan"),
  deadlineList: document.querySelector("#deadlineList"),
  analyticsList: document.querySelector("#analyticsList"),
  applicationsList: document.querySelector("#applicationsList"),
  applicationStats: document.querySelector("#applicationStats"),
  applicationSearch: document.querySelector("#applicationSearch"),
  applicationFilter: document.querySelector("#applicationFilter"),
  certificationsList: document.querySelector("#certificationsList"),
  projectsList: document.querySelector("#projectsList"),
  networkingList: document.querySelector("#networkingList"),
  interviewsList: document.querySelector("#interviewsList"),
  goalsList: document.querySelector("#goalsList"),
  resumeDraft: document.querySelector("#resumeDraft"),
  resumeCoach: document.querySelector("#resumeCoach"),
  editDialog: document.querySelector("#editDialog"),
  editForm: document.querySelector("#editForm"),
  editTitle: document.querySelector("#editTitle"),
  editFields: document.querySelector("#editFields"),
  downloadResumeButton: document.querySelector("#downloadResumeButton")
};

document.querySelector("#applicationForm").addEventListener("submit", event => addFromForm(event, "applications"));
document.querySelector("#certificationForm").addEventListener("submit", event => addFromForm(event, "certifications"));
document.querySelector("#projectForm").addEventListener("submit", event => addFromForm(event, "projects"));
document.querySelector("#networkForm").addEventListener("submit", event => addFromForm(event, "networking"));
document.querySelector("#interviewForm").addEventListener("submit", event => addFromForm(event, "interviews"));
document.querySelector("#goalForm").addEventListener("submit", event => addFromForm(event, "goals"));
document.querySelector("#saveResumeButton").addEventListener("click", saveResume);
els.downloadResumeButton.addEventListener("click", downloadResume);
els.exportButton.addEventListener("click", exportSnapshot);
els.importButton.addEventListener("click", () => els.importFile.click());
els.importFile.addEventListener("change", importSnapshot);
els.clearButton.addEventListener("click", clearWorkspace);
els.profileForm.addEventListener("submit", saveProfile);
els.applicationSearch.addEventListener("input", renderApplications);
els.applicationFilter.addEventListener("change", renderApplications);
els.editForm.addEventListener("submit", saveEdit);
els.navItems.forEach(item => item.addEventListener("click", () => switchView(item.dataset.view)));

render();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeState(structuredClone(starterState));

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return normalizeState(structuredClone(starterState));
  }
}

function normalizeState(raw) {
  const next = structuredClone(starterState);
  Object.keys(next).forEach(key => {
    if (Array.isArray(next[key])) next[key] = Array.isArray(raw[key]) ? raw[key] : [];
  });
  next.profile = { ...starterState.profile, ...(raw.profile || {}) };
  next.resume = typeof raw.resume === "string" ? raw.resume : starterState.resume;
  next.activity = Array.isArray(raw.activity) ? raw.activity.slice(0, 50) : [];

  Object.keys(schemas).forEach(collection => {
    next[collection] = next[collection].map(item => ({ id: item.id || createId(), ...item }));
  });

  return next;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addFromForm(event, collection) {
  event.preventDefault();
  const form = event.currentTarget;
  const item = parseFormData(form, collection);
  state[collection].push({ id: createId(), ...item });
  addActivity(`Added ${singular(collection)}: ${displayName(collection, item)}`);
  form.reset();
  persistAndRender();
}

function parseFormData(form, collection) {
  const data = Object.fromEntries(new FormData(form).entries());
  schemas[collection].forEach(([key, , type]) => {
    if (type === "number") data[key] = clamp(Number(data[key] || 0), 0, 100);
  });
  return data;
}

function saveProfile(event) {
  event.preventDefault();
  state.profile = {
    targetRole: els.profileForm.targetRole.value.trim(),
    major: els.profileForm.major.value.trim(),
    graduation: els.profileForm.graduation.value.trim(),
    weeklyHours: clamp(Number(els.profileForm.weeklyHours.value || 0), 0, 80)
  };
  addActivity("Updated career profile");
  persistAndRender();
}

function openEdit(collection, id) {
  const item = state[collection].find(entry => entry.id === id);
  if (!item) return;

  editing = { collection, id };
  els.editTitle.textContent = `Edit ${singular(collection)}`;
  els.editFields.innerHTML = schemas[collection].map(([key, label, type, options]) => {
    const value = item[key] ?? "";
    if (type === "select") {
      return `
        <label>${label}
          <select name="${key}">
            ${options.map(option => `<option ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>
        </label>
      `;
    }
    return `
      <label>${label}
        <input name="${key}" type="${type}" value="${escapeAttribute(value)}">
      </label>
    `;
  }).join("");
  els.editDialog.showModal();
}

function saveEdit(event) {
  event.preventDefault();
  if (event.submitter && event.submitter.value === "cancel") {
    els.editDialog.close();
    return;
  }
  if (!editing) return;

  const { collection, id } = editing;
  const index = state[collection].findIndex(item => item.id === id);
  if (index === -1) return;

  const data = parseFormData(els.editForm, collection);
  state[collection][index] = { ...state[collection][index], ...data };
  addActivity(`Edited ${singular(collection)}: ${displayName(collection, state[collection][index])}`);
  editing = null;
  els.editDialog.close();
  persistAndRender();
}

function deleteItem(collection, id) {
  const item = state[collection].find(entry => entry.id === id);
  state[collection] = state[collection].filter(entry => entry.id !== id);
  addActivity(`Removed ${singular(collection)}${item ? `: ${displayName(collection, item)}` : ""}`);
  persistAndRender();
}

function saveResume() {
  state.resume = els.resumeDraft.value.trim();
  addActivity("Saved resume notes");
  persistAndRender();
}

function downloadResume() {
  downloadFile("nexus-ai-resume-notes.txt", state.resume || "", "text/plain");
}

function clearWorkspace() {
  const confirmed = window.confirm("Start a new blank workspace? This clears the current browser data after exporting is recommended.");
  if (!confirmed) return;

  state = normalizeState({
    profile: { targetRole: "", major: "", graduation: "", weeklyHours: 0 },
    applications: [],
    certifications: [],
    projects: [],
    networking: [],
    interviews: [],
    goals: [],
    resume: "",
    activity: []
  });
  addActivity("Started a new workspace");
  currentView = "dashboard";
  saveState();
  switchView("dashboard");
  render();
}

function persistAndRender() {
  saveState();
  render();
}

function render() {
  renderProfile();
  renderDashboard();
  renderApplications();
  renderCertifications();
  renderProjects();
  renderNetworking();
  renderInterviews();
  renderGoals();
  renderResume();
}

function renderProfile() {
  els.profileForm.targetRole.value = state.profile.targetRole || "";
  els.profileForm.major.value = state.profile.major || "";
  els.profileForm.graduation.value = state.profile.graduation || "";
  els.profileForm.weeklyHours.value = state.profile.weeklyHours || "";
}

function renderDashboard() {
  const score = calculateCareerScore();
  els.careerScore.textContent = score;
  document.querySelector(".score-ring").style.setProperty("--score", score);
  els.readinessTitle.textContent = getReadinessTitle(score);
  els.readinessSummary.textContent = getReadinessSummary(score);
  els.activeApps.textContent = state.applications.filter(app => !["Rejected", "Offer"].includes(app.status)).length;
  els.activeCerts.textContent = state.certifications.filter(cert => Number(cert.progress) < 100).length;
  els.projectCount.textContent = state.projects.length;
  els.networkCount.textContent = state.networking.length;

  els.coachList.innerHTML = generateCoachCards().map(card => `
    <div class="coach-card">
      <h4>${escapeHtml(card.title)}</h4>
      <p>${escapeHtml(card.body)}</p>
    </div>
  `).join("");

  els.weeklyPlan.innerHTML = generateWeeklyPlan().map(task => `<li>${escapeHtml(task)}</li>`).join("");
  els.deadlineList.innerHTML = getUpcomingDeadlines().map(item => `
    <div class="timeline-item">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.type)} | ${formatDate(item.date)}</span>
    </div>
  `).join("") || emptyState("No deadlines in the next 30 days.");

  els.analyticsList.innerHTML = generateAnalytics().map(item => `
    <div class="analytics-item">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </div>
  `).join("");
}

function renderApplications() {
  const search = els.applicationSearch.value.trim().toLowerCase();
  const filter = els.applicationFilter.value;
  const items = state.applications.filter(item => {
    const searchable = `${item.company} ${item.role} ${item.status} ${item.notes}`.toLowerCase();
    return (!search || searchable.includes(search)) && (filter === "all" || item.status === filter);
  });

  els.applicationStats.textContent = `${items.length} of ${state.applications.length} applications`;
  els.applicationsList.innerHTML = items.map(item => tableRow("applications", item, [
    item.company,
    item.role,
    `<span class="pill">${escapeHtml(item.status)}</span>`,
    `Due ${formatDate(item.deadline)}`,
    item.notes || "No next action"
  ])).join("") || emptyState("No applications match this view.");
}

function renderCertifications() {
  els.certificationsList.innerHTML = state.certifications.map(item => `
    <div class="data-card">
      <h4>${escapeHtml(item.name)}</h4>
      <p>${escapeHtml(item.provider)} | Target ${formatDate(item.target)}</p>
      <div class="progress-track"><div class="progress-fill" style="width: ${clamp(Number(item.progress || 0), 0, 100)}%"></div></div>
      <p>${Number(item.progress || 0)}% complete ${linkText(item.link)}</p>
      ${rowActions("certifications", item.id)}
    </div>
  `).join("") || emptyState("Add the certifications you are working toward.");
}

function renderProjects() {
  els.projectsList.innerHTML = state.projects.map(item => `
    <div class="data-card">
      <h4>${escapeHtml(item.name)}</h4>
      <p>${escapeHtml(item.stack)}</p>
      <p><span class="pill">${escapeHtml(item.stage)}</span> ${linkText(item.link)}</p>
      <p>${escapeHtml(item.impact || "Add the measurable outcome this project proves.")}</p>
      ${rowActions("projects", item.id)}
    </div>
  `).join("") || emptyState("Add projects with public links and measurable outcomes.");
}

function renderNetworking() {
  els.networkingList.innerHTML = state.networking.map(item => tableRow("networking", item, [
    item.name,
    item.organization,
    `<span class="pill">${escapeHtml(item.status)}</span>`,
    `Next ${formatDate(item.next)}`,
    item.notes || "No context saved"
  ])).join("") || emptyState("Add mentors, recruiters, classmates, and alumni you want to follow up with.");
}

function renderInterviews() {
  els.interviewsList.innerHTML = state.interviews.map(item => `
    <div class="data-card">
      <h4>${escapeHtml(item.role)}</h4>
      <p>${escapeHtml(item.company)} | ${escapeHtml(item.type)} | ${formatDate(item.date)}</p>
      <p>${escapeHtml(item.notes || generateInterviewPrompt(item))}</p>
      <p>${escapeHtml(generateInterviewPrompt(item))}</p>
      ${rowActions("interviews", item.id)}
    </div>
  `).join("") || emptyState("Add upcoming interviews or practice sessions.");
}

function renderGoals() {
  els.goalsList.innerHTML = state.goals.map(item => `
    <div class="data-card">
      <h4>${escapeHtml(item.goal)}</h4>
      <p>${escapeHtml(item.category)} | Due ${formatDate(item.due)}</p>
      <div class="progress-track"><div class="progress-fill" style="width: ${clamp(Number(item.progress || 0), 0, 100)}%"></div></div>
      <p>${Number(item.progress || 0)}% complete</p>
      <p>${escapeHtml(item.nextStep || "Add a next step to make this goal actionable.")}</p>
      ${rowActions("goals", item.id)}
    </div>
  `).join("") || emptyState("Add career goals for the semester.");
}

function renderResume() {
  els.resumeDraft.value = state.resume;
  els.resumeCoach.innerHTML = generateResumeCoach().map(card => `
    <div class="coach-card">
      <h4>${escapeHtml(card.title)}</h4>
      <p>${escapeHtml(card.body)}</p>
    </div>
  `).join("");
}

function tableRow(collection, item, cells) {
  return `
    <div class="table-row">
      ${cells.map(cell => `<div>${cell}</div>`).join("")}
      ${rowActions(collection, item.id)}
    </div>
  `;
}

function rowActions(collection, id) {
  return `
    <div class="row-actions">
      <button class="delete-button" type="button" onclick="openEdit('${collection}', '${id}')">Edit</button>
      <button class="delete-button" type="button" onclick="deleteItem('${collection}', '${id}')">Remove</button>
    </div>
  `;
}

function calculateCareerScore() {
  const profile = state.profile.targetRole && state.profile.major ? 10 : 0;
  const apps = Math.min(state.applications.length * 4, 20);
  const interviews = Math.min(state.applications.filter(app => ["Interview", "Offer"].includes(app.status)).length * 6, 12);
  const projects = Math.min(state.projects.filter(project => project.stage === "Published").length * 10, 22);
  const certs = Math.min(state.certifications.reduce((sum, cert) => sum + Number(cert.progress || 0), 0) / 10, 16);
  const network = Math.min(state.networking.length * 4, 12);
  const goals = Math.min(state.goals.reduce((sum, goal) => sum + Number(goal.progress || 0), 0) / 18, 8);
  return Math.round(profile + apps + interviews + projects + certs + network + goals);
}

function getReadinessTitle(score) {
  if (score >= 82) return "Recruiter-ready system";
  if (score >= 62) return "Strong momentum";
  if (score >= 36) return "Building momentum";
  return "Set up your operating system";
}

function getReadinessSummary(score) {
  const role = state.profile.targetRole || "your target role";
  if (score >= 82) return `Your proof, pipeline, and follow-up system are strong enough for serious ${role} outreach.`;
  if (score >= 62) return `You are close. Add measurable project outcomes and keep moving applications toward interviews.`;
  if (score >= 36) return `Your foundation is forming. Turn each project, certification, and application into a tracked next action.`;
  return "Add your profile, first applications, projects, goals, and certification plan to activate your workspace.";
}

function generateCoachCards() {
  const cards = [];
  const activeApps = state.applications.filter(app => !["Rejected", "Offer"].includes(app.status));
  const interviews = state.applications.filter(app => app.status === "Interview");
  const publishedProjects = state.projects.filter(project => project.stage === "Published");
  const role = state.profile.targetRole || "your target role";
  const lowCert = state.certifications.find(item => Number(item.progress || 0) < 50);

  cards.push({
    title: "Pipeline move",
    body: activeApps.length < 8
      ? `Build a stronger ${role} pipeline by adding at least three specific roles with deadlines and next actions.`
      : "Your application volume is healthy. Shift energy toward follow-ups, referrals, and interview prep."
  });
  cards.push({
    title: "Portfolio proof",
    body: publishedProjects.length < 3
      ? "Publish or polish one more project with a live link, GitHub README, screenshots, and a clear result statement."
      : "Your project proof is credible. Add short case-study summaries so recruiters can scan the value faster."
  });
  cards.push({
    title: "Interview readiness",
    body: interviews.length
      ? `You have ${interviews.length} interview-stage item${interviews.length === 1 ? "" : "s"}. Practice one STAR story and one technical project walkthrough.`
      : "No interview-stage applications yet. Prepare anyway by linking each resume bullet to a project story."
  });
  cards.push({
    title: "Learning focus",
    body: lowCert
      ? `${lowCert.name} is at ${lowCert.progress}%. Schedule focused study blocks before ${formatDate(lowCert.target)}.`
      : "Your certification pipeline is either complete or empty. Keep only credentials that match your target role."
  });

  return cards;
}

function generateWeeklyPlan() {
  const plan = [];
  const overdue = getAllDeadlines().filter(item => daysUntil(item.date) < 0);
  if (overdue.length) plan.push(`Resolve ${overdue.length} overdue item${overdue.length === 1 ? "" : "s"} or update their dates.`);
  if (state.applications.length < 10) plan.push("Add three internship applications with posting links and next actions.");
  if (state.projects.filter(project => project.stage === "Published").length < 3) plan.push("Publish or improve one portfolio project and write a result-focused description.");
  if (state.networking.length < 5) plan.push("Add two networking contacts and set follow-up dates.");
  if (state.interviews.length < 2) plan.push("Create one behavioral and one technical interview practice session.");
  if (state.goals.some(goal => Number(goal.progress || 0) < 50)) plan.push("Advance the lowest-progress goal with one concrete next step.");
  return plan.slice(0, 5);
}

function generateResumeCoach() {
  const text = state.resume.toLowerCase();
  const publicProjects = state.projects.filter(project => project.link);
  return [
    {
      title: "Public proof",
      body: publicProjects.length
        ? `${publicProjects.length} project link${publicProjects.length === 1 ? "" : "s"} are tracked. Make sure the resume names the strongest one.`
        : "Add GitHub or live demo links to your projects, then reference the best one in your resume notes."
    },
    {
      title: "Skill alignment",
      body: state.profile.targetRole
        ? `Aim your skills and bullets at ${state.profile.targetRole}. Remove tools that are not backed by projects or coursework.`
        : "Save a target role in your profile so the coach can judge your resume direction."
    },
    {
      title: "Impact language",
      body: text.includes("%") || text.includes("built") || text.includes("created")
        ? "You have some action language. Add numbers, users, scope, or outcomes where truthful."
        : "Rewrite bullets as action + tool + result, such as built a JavaScript tracker that organizes applications and deadlines."
    }
  ];
}

function generateAnalytics() {
  const appsByStatus = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"]
    .map(status => `${status}: ${state.applications.filter(app => app.status === status).length}`)
    .join(" | ");
  const avgCert = state.certifications.length
    ? `${Math.round(state.certifications.reduce((sum, cert) => sum + Number(cert.progress || 0), 0) / state.certifications.length)}%`
    : "0%";
  const published = state.projects.filter(project => project.stage === "Published").length;
  const nextDeadline = getAllDeadlines().filter(item => daysUntil(item.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];

  return [
    { label: "Application stages", value: appsByStatus },
    { label: "Average certification progress", value: avgCert },
    { label: "Published projects", value: `${published}/${state.projects.length}` },
    { label: "Next critical date", value: nextDeadline ? `${nextDeadline.title} on ${formatDate(nextDeadline.date)}` : "Nothing scheduled" },
    { label: "Recent activity", value: state.activity[0]?.message || "No recent activity yet" }
  ];
}

function getUpcomingDeadlines() {
  return getAllDeadlines()
    .filter(item => {
      const days = daysUntil(item.date);
      return days >= 0 && days <= 30;
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);
}

function getAllDeadlines() {
  return [
    ...state.applications.map(item => ({ type: "Application", title: `${item.company} - ${item.role}`, date: item.deadline })),
    ...state.certifications.map(item => ({ type: "Certification", title: item.name, date: item.target })),
    ...state.networking.map(item => ({ type: "Networking", title: item.name, date: item.next })),
    ...state.interviews.map(item => ({ type: "Interview", title: `${item.company} - ${item.role}`, date: item.date })),
    ...state.goals.map(item => ({ type: "Goal", title: item.goal, date: item.due }))
  ].filter(item => item.date);
}

function generateInterviewPrompt(item) {
  if (item.type === "Technical") return `Practice: Explain one project that proves you can do ${item.role} work.`;
  if (item.type === "Portfolio review") return "Practice: Walk through the problem, your design choices, tradeoffs, and what you would improve next.";
  if (item.type === "Case") return "Practice: Clarify the problem, define success metrics, compare options, and explain your recommendation.";
  return "Practice: Tell me about a time you learned a technical skill quickly and applied it to a project.";
}

function exportSnapshot() {
  const snapshot = {
    exportedAt: new Date().toISOString(),
    product: "Nexus AI",
    careerScore: calculateCareerScore(),
    ...state
  };
  downloadFile("nexus-ai-snapshot.json", JSON.stringify(snapshot, null, 2), "application/json");
}

function importSnapshot(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = normalizeState(JSON.parse(reader.result));
      addActivity(`Imported snapshot: ${file.name}`);
      persistAndRender();
    } catch {
      window.alert("That file could not be imported. Use a Nexus AI JSON snapshot.");
    } finally {
      els.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

function switchView(view) {
  const titles = {
    dashboard: "Nexus AI",
    applications: "Applications",
    certifications: "Certifications",
    projects: "Projects",
    networking: "Networking",
    interviews: "Interview Prep",
    resume: "Resume Builder",
    goals: "Career Goals"
  };

  currentView = view;
  els.navItems.forEach(item => item.classList.toggle("active", item.dataset.view === view));
  els.views.forEach(section => section.classList.toggle("active", section.id === `${view}View`));
  els.viewTitle.textContent = titles[view];
}

function addActivity(message) {
  state.activity = [{ id: createId(), at: new Date().toISOString(), message }, ...(state.activity || [])].slice(0, 50);
}

function displayName(collection, item) {
  if (collection === "applications") return `${item.company} ${item.role}`;
  if (collection === "certifications") return item.name;
  if (collection === "projects") return item.name;
  if (collection === "networking") return item.name;
  if (collection === "interviews") return `${item.company} ${item.role}`;
  if (collection === "goals") return item.goal;
  return "item";
}

function singular(collection) {
  return {
    applications: "application",
    certifications: "certification",
    projects: "project",
    networking: "contact",
    interviews: "interview",
    goals: "goal"
  }[collection] || "item";
}

function emptyState(message) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function linkText(link) {
  if (!link) return "";
  return `<a href="${escapeAttribute(link)}" target="_blank" rel="noreferrer">Open link</a>`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function daysUntil(value) {
  const target = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

function formatDate(value) {
  if (!value) return "No date";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
