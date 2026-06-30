const STORAGE_KEY = "nexus-ai-state-v2";
const API_BASE = getApiBase();

const starterState = {
  profile: {
    targetRole: "",
    major: "",
    graduation: "",
    weeklyHours: 0
  },
  applications: [],
  certifications: [],
  projects: [],
  skills: [],
  networking: [],
  interviews: [],
  goals: [],
  resume: "",
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
  skills: [
    ["name", "Skill", "text"],
    ["category", "Category", "select", ["Data", "AI", "Software", "Cloud", "Business"]],
    ["level", "Confidence %", "number"],
    ["evidence", "Project, cert, or coursework proof", "text"]
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
let backendOnline = false;

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
  skillCoverage: document.querySelector("#skillCoverage"),
  coachList: document.querySelector("#coachList"),
  weeklyPlan: document.querySelector("#weeklyPlan"),
  deadlineList: document.querySelector("#deadlineList"),
  analyticsList: document.querySelector("#analyticsList"),
  dashboardSkillGaps: document.querySelector("#dashboardSkillGaps"),
  schemaPreview: document.querySelector("#schemaPreview"),
  applicationsList: document.querySelector("#applicationsList"),
  applicationStats: document.querySelector("#applicationStats"),
  applicationSearch: document.querySelector("#applicationSearch"),
  applicationFilter: document.querySelector("#applicationFilter"),
  certificationsList: document.querySelector("#certificationsList"),
  projectsList: document.querySelector("#projectsList"),
  skillsList: document.querySelector("#skillsList"),
  skillsGapList: document.querySelector("#skillsGapList"),
  roleFitLabel: document.querySelector("#roleFitLabel"),
  networkingList: document.querySelector("#networkingList"),
  interviewsList: document.querySelector("#interviewsList"),
  goalsList: document.querySelector("#goalsList"),
  resumeDraft: document.querySelector("#resumeDraft"),
  resumeCoach: document.querySelector("#resumeCoach"),
  editDialog: document.querySelector("#editDialog"),
  editForm: document.querySelector("#editForm"),
  editTitle: document.querySelector("#editTitle"),
  editFields: document.querySelector("#editFields"),
  downloadResumeButton: document.querySelector("#downloadResumeButton"),
  downloadSqlButton: document.querySelector("#downloadSqlButton"),
  downloadPlanButton: document.querySelector("#downloadPlanButton"),
  syncStatus: document.querySelector("#syncStatus")
};

document.querySelector("#applicationForm").addEventListener("submit", event => addFromForm(event, "applications"));
document.querySelector("#certificationForm").addEventListener("submit", event => addFromForm(event, "certifications"));
document.querySelector("#projectForm").addEventListener("submit", event => addFromForm(event, "projects"));
document.querySelector("#skillForm").addEventListener("submit", event => addFromForm(event, "skills"));
document.querySelector("#networkForm").addEventListener("submit", event => addFromForm(event, "networking"));
document.querySelector("#interviewForm").addEventListener("submit", event => addFromForm(event, "interviews"));
document.querySelector("#goalForm").addEventListener("submit", event => addFromForm(event, "goals"));
document.querySelector("#saveResumeButton").addEventListener("click", saveResume);
els.downloadResumeButton.addEventListener("click", downloadResume);
els.downloadSqlButton.addEventListener("click", downloadSqlSchema);
els.downloadPlanButton.addEventListener("click", downloadCareerPlan);
els.exportButton.addEventListener("click", exportSnapshot);
els.importButton.addEventListener("click", () => els.importFile.click());
els.importFile.addEventListener("change", importSnapshot);
els.clearButton.addEventListener("click", clearWorkspace);
els.profileForm.addEventListener("submit", saveProfile);
els.applicationSearch.addEventListener("input", renderApplications);
els.applicationFilter.addEventListener("change", renderApplications);
els.editForm.addEventListener("submit", saveEdit);
els.navItems.forEach(item => item.addEventListener("click", () => switchView(item.dataset.view)));

const roleRequirements = {
  "data analyst": ["SQL", "Excel", "Power BI", "Data Analysis", "Statistics", "Communication"],
  "business intelligence": ["SQL", "Power BI", "Data Visualization", "Business Analysis", "Excel", "Communication"],
  "ai data": ["AI Model Evaluation", "Prompt Engineering", "Data Quality", "Generative AI", "Communication"],
  "machine learning": ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
  "business analyst": ["Business Analysis", "Systems Analysis", "SQL", "Agile", "Communication"],
  "systems analyst": ["Systems Analysis", "Database Management", "Business Analysis", "Agile", "Documentation"],
  "software": ["JavaScript", "Object-Oriented Programming", "GitHub", "Testing", "APIs"],
  "cloud": ["Cloud Computing", "Troubleshooting", "Networking", "Documentation", "Security"],
  "default": ["SQL", "JavaScript", "Data Analysis", "Generative AI", "GitHub", "Communication"]
};

initApp();

async function initApp() {
  backendOnline = await detectBackend();
  updateSyncStatus();
  if (backendOnline) await refreshFromBackend();
  render();
}

function getApiBase() {
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get("api") || localStorage.getItem("nexus-ai-api-base");
  if (explicit) return explicit.replace(/\/$/, "");
  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) return "http://127.0.0.1:8000";
  return "";
}

async function detectBackend() {
  if (!API_BASE) return false;
  try {
    const response = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

function updateSyncStatus(message) {
  if (!els.syncStatus) return;
  els.syncStatus.textContent = message || (backendOnline ? "API connected" : "Local mode");
  els.syncStatus.classList.toggle("online", backendOnline);
}

async function refreshFromBackend() {
  const snapshot = await apiRequest("/snapshot");
  state = normalizeState(fromBackendSnapshot(snapshot));
  saveState();
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function toBackendPayload(collection, item) {
  if (collection === "goals") {
    const { nextStep, ...rest } = item;
    return { ...rest, next_step: nextStep || rest.next_step || "" };
  }
  return item;
}

function fromBackendSnapshot(snapshot) {
  return {
    profile: {
      targetRole: snapshot.profile?.target_role || "",
      major: snapshot.profile?.major || "",
      graduation: snapshot.profile?.graduation || "",
      weeklyHours: snapshot.profile?.weekly_hours || 0
    },
    applications: snapshot.applications || [],
    certifications: snapshot.certifications || [],
    projects: snapshot.projects || [],
    skills: snapshot.skills || [],
    networking: snapshot.networking || [],
    interviews: snapshot.interviews || [],
    goals: (snapshot.goals || []).map(goal => ({ ...goal, nextStep: goal.next_step || "" })),
    resume: snapshot.resume || "",
    activity: (snapshot.activity || []).map((item, index) => ({
      id: `${item.created_at || "activity"}-${index}`,
      at: item.created_at || "",
      message: item.message || ""
    }))
  };
}

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

async function addFromForm(event, collection) {
  event.preventDefault();
  const form = event.currentTarget;
  const item = parseFormData(form, collection);
  try {
    if (backendOnline) {
      await apiRequest(`/${collection}`, {
        method: "POST",
        body: JSON.stringify(toBackendPayload(collection, item))
      });
      await refreshFromBackend();
    } else {
      state[collection].push({ id: createId(), ...item });
      addActivity(`Added ${singular(collection)}: ${displayName(collection, item)}`);
      saveState();
    }
    form.reset();
    render();
  } catch (error) {
    showError(error);
  }
}

function parseFormData(form, collection) {
  const data = Object.fromEntries(new FormData(form).entries());
  schemas[collection].forEach(([key, , type]) => {
    if (type === "number") data[key] = clamp(Number(data[key] || 0), 0, 100);
  });
  return data;
}

async function saveProfile(event) {
  event.preventDefault();
  const profile = {
    targetRole: els.profileForm.targetRole.value.trim(),
    major: els.profileForm.major.value.trim(),
    graduation: els.profileForm.graduation.value.trim(),
    weeklyHours: clamp(Number(els.profileForm.weeklyHours.value || 0), 0, 80)
  };
  try {
    if (backendOnline) {
      await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({
          target_role: profile.targetRole,
          major: profile.major,
          graduation: profile.graduation,
          weekly_hours: profile.weeklyHours
        })
      });
      await refreshFromBackend();
    } else {
      state.profile = profile;
      addActivity("Updated career profile");
      saveState();
    }
    render();
  } catch (error) {
    showError(error);
  }
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

async function saveEdit(event) {
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
  try {
    if (backendOnline) {
      await apiRequest(`/${collection}/${id}`, {
        method: "PUT",
        body: JSON.stringify(toBackendPayload(collection, data))
      });
      await refreshFromBackend();
    } else {
      state[collection][index] = { ...state[collection][index], ...data };
      addActivity(`Edited ${singular(collection)}: ${displayName(collection, state[collection][index])}`);
      saveState();
    }
    editing = null;
    els.editDialog.close();
    render();
  } catch (error) {
    showError(error);
  }
}

async function deleteItem(collection, id) {
  const item = state[collection].find(entry => entry.id === id);
  try {
    if (backendOnline) {
      await apiRequest(`/${collection}/${id}`, { method: "DELETE" });
      await refreshFromBackend();
    } else {
      state[collection] = state[collection].filter(entry => entry.id !== id);
      addActivity(`Removed ${singular(collection)}${item ? `: ${displayName(collection, item)}` : ""}`);
      saveState();
    }
    render();
  } catch (error) {
    showError(error);
  }
}

async function saveResume() {
  try {
    if (backendOnline) {
      await apiRequest("/resume", {
        method: "PUT",
        body: JSON.stringify({ body: els.resumeDraft.value.trim() })
      });
      await refreshFromBackend();
    } else {
      state.resume = els.resumeDraft.value.trim();
      addActivity("Saved resume notes");
      saveState();
    }
    render();
  } catch (error) {
    showError(error);
  }
}

function downloadResume() {
  downloadFile("nexus-ai-resume-notes.txt", state.resume || "", "text/plain");
}

async function clearWorkspace() {
  const confirmed = window.confirm("Start a new blank workspace? This clears the current browser data after exporting is recommended.");
  if (!confirmed) return;

  try {
    if (backendOnline) {
      await apiRequest("/workspace/reset", { method: "DELETE" });
      await refreshFromBackend();
    } else {
      state = normalizeState(structuredClone(starterState));
      addActivity("Started a new workspace");
      saveState();
    }
    currentView = "dashboard";
    switchView("dashboard");
    render();
  } catch (error) {
    showError(error);
  }
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
  renderSkills();
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
  els.skillCoverage.textContent = `${calculateSkillFit().coverage}%`;

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

  const fit = calculateSkillFit();
  els.dashboardSkillGaps.innerHTML = renderSkillGapCards(fit.gaps.slice(0, 5), fit.matched);
  els.schemaPreview.innerHTML = renderSchemaPreview();
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

function renderSkills() {
  const fit = calculateSkillFit();
  els.roleFitLabel.textContent = `${fit.coverage}% aligned`;
  els.skillsList.innerHTML = state.skills.map(item => `
    <div class="data-card">
      <h4>${escapeHtml(item.name)}</h4>
      <p><span class="pill">${escapeHtml(item.category)}</span> ${Number(item.level || 0)}% confidence</p>
      <div class="progress-track"><div class="progress-fill" style="width: ${clamp(Number(item.level || 0), 0, 100)}%"></div></div>
      <p>${escapeHtml(item.evidence || "Add project, certification, coursework, or work proof for this skill.")}</p>
      ${rowActions("skills", item.id)}
    </div>
  `).join("") || emptyState("Add skills that are backed by visible proof.");
  els.skillsGapList.innerHTML = renderSkillGapCards(fit.gaps, fit.matched);
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
  const skills = Math.min(calculateSkillFit().coverage / 10, 10);
  return Math.round(profile + apps + interviews + projects + certs + network + goals + skills);
}

function calculateSkillFit() {
  const role = String(state.profile.targetRole || "").toLowerCase();
  const key = Object.keys(roleRequirements).find(item => item !== "default" && role.includes(item)) || "default";
  const required = roleRequirements[key];
  const skillMap = new Map(state.skills.map(skill => [normalizeSkill(skill.name), skill]));
  const matched = required
    .map(name => ({ name, skill: skillMap.get(normalizeSkill(name)) }))
    .filter(item => item.skill);
  const gaps = required
    .filter(name => !skillMap.has(normalizeSkill(name)))
    .map(name => ({ name, action: getSkillGapAction(name) }));
  const levelScore = matched.reduce((sum, item) => sum + Number(item.skill.level || 0), 0);
  const coverage = required.length ? Math.round(levelScore / (required.length * 100) * 100) : 0;
  return { required, matched, gaps, coverage };
}

function normalizeSkill(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getSkillGapAction(skill) {
  const actions = {
    "SQL": "Add a project with joins, grouped metrics, and a short insight summary.",
    "Power BI": "Build one dashboard and include screenshots plus the business question it answers.",
    "Data Analysis": "Show a dataset, the cleaning steps, and the decision your analysis supports.",
    "Communication": "Write a short case study for one project using problem, action, and result.",
    "AI Model Evaluation": "Create a rubric and score sample AI responses for accuracy, usefulness, and safety.",
    "Prompt Engineering": "Document prompt versions and explain why one output improved.",
    "Business Analysis": "Add user stories, requirements, and acceptance criteria for Nexus AI.",
    "Systems Analysis": "Document the entities, workflows, and data model behind this app.",
    "Testing": "Add a QA checklist or bug report table for one project.",
    "Cloud Computing": "Document deployment choices and compare GitHub Pages, Vercel, Render, and OCI."
  };
  return actions[skill] || "Add public proof through a project, certification, coursework artifact, or case study.";
}

function renderSkillGapCards(gaps, matched) {
  const cards = [
    ...gaps.map(item => `
      <div class="skill-gap-card missing">
        <h4>${escapeHtml(item.name)}</h4>
        <p>${escapeHtml(item.action)}</p>
      </div>
    `),
    ...matched.map(item => `
      <div class="skill-gap-card matched">
        <h4>${escapeHtml(item.name)}</h4>
        <p>${escapeHtml(item.skill.evidence || "Evidence saved in skill inventory.")}</p>
      </div>
    `)
  ];
  return cards.join("") || emptyState("Your tracked skills cover the current role requirements.");
}

function renderSchemaPreview() {
  const tables = [
    ["students", "profile_id, target_role, major, graduation, weekly_hours"],
    ["applications", "company, role, status, deadline, link, notes"],
    ["skills", "name, category, confidence_level, evidence"],
    ["projects", "name, tech_stack, stage, link, impact"],
    ["networking", "contact_name, organization, status, next_follow_up"],
    ["goals", "goal, category, progress, due_date, next_step"]
  ];
  return tables.map(([name, fields]) => `
    <div class="schema-row">
      <strong>${escapeHtml(name)}</strong>
      <span>${escapeHtml(fields)}</span>
    </div>
  `).join("");
}

function getReadinessTitle(score) {
  if (score >= 82) return "Recruiter-ready system";
  if (score >= 62) return "Strong momentum";
  if (score >= 36) return "Building momentum";
  return "Set up your operating system";
}

function getReadinessSummary(score) {
  const role = state.profile.targetRole || "your target role";
  if (!state.profile.targetRole) return "Choose a target role and add your first applications, skills, projects, and goals to activate the workspace.";
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
    body: !state.profile.targetRole
      ? "Start by saving a target role. The workspace will use that role to judge your pipeline, skills, and project proof."
      : activeApps.length < 8
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
    { label: "Skill coverage", value: `${calculateSkillFit().coverage}% target-role fit` },
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

function downloadSqlSchema() {
  const sql = `-- Nexus AI portfolio schema
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY,
  target_role TEXT NOT NULL,
  major TEXT,
  graduation TEXT,
  weekly_hours INTEGER
);

CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  deadline DATE,
  link TEXT,
  notes TEXT
);

CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  confidence_level INTEGER,
  evidence TEXT
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tech_stack TEXT,
  stage TEXT,
  link TEXT,
  impact TEXT
);

CREATE TABLE networking (
  id TEXT PRIMARY KEY,
  contact_name TEXT NOT NULL,
  organization TEXT,
  status TEXT,
  next_follow_up DATE,
  notes TEXT
);

CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  goal TEXT NOT NULL,
  category TEXT,
  progress INTEGER,
  due_date DATE,
  next_step TEXT
);`;
  downloadFile("nexus-ai-schema.sql", sql, "text/sql");
}

function downloadCareerPlan() {
  const fit = calculateSkillFit();
  const lines = [
    "Nexus AI Career Plan",
    `Target role: ${state.profile.targetRole || "Not set"}`,
    `Career readiness score: ${calculateCareerScore()}/100`,
    `Skill coverage: ${fit.coverage}%`,
    "",
    "Priority skill gaps:",
    ...(fit.gaps.length ? fit.gaps.map(item => `- ${item.name}: ${item.action}`) : ["- No major gaps detected."]),
    "",
    "This week's plan:",
    ...generateWeeklyPlan().map(item => `- ${item}`)
  ];
  downloadFile("nexus-ai-career-plan.txt", lines.join("\n"), "text/plain");
}

function importSnapshot(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      importSnapshotData(JSON.parse(reader.result), file.name);
    } catch {
      window.alert("That file could not be imported. Use a Nexus AI JSON snapshot.");
    } finally {
      els.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

async function importSnapshotData(snapshot, filename) {
  try {
    if (backendOnline) {
      await apiRequest("/workspace/import", {
        method: "POST",
        body: JSON.stringify(snapshot)
      });
      await refreshFromBackend();
    } else {
      state = normalizeState(snapshot);
      addActivity(`Imported snapshot: ${filename}`);
      saveState();
    }
    render();
  } catch (error) {
    showError(error);
  }
}

function switchView(view) {
  const titles = {
    dashboard: "Nexus AI",
    applications: "Applications",
    certifications: "Certifications",
    projects: "Projects",
    networking: "Networking",
    interviews: "Interview Prep",
    skills: "Skills Lab",
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
  if (collection === "skills") return item.name;
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
    skills: "skill",
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

function showError(error) {
  console.error(error);
  updateSyncStatus("Action failed");
  window.alert("Nexus AI could not complete that action. Check that the backend is running, then try again.");
}
