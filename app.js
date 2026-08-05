const STORAGE_KEY = "nexus-ai-state-v3";
const PRODUCTION_API_BASE = "https://nexus-ai-api-upkl.onrender.com";
const API_BASE = getApiBase();

const starterState = {
  profile: {
    displayName: "",
    email: "",
    targetRole: "",
    major: "",
    graduation: "",
    weeklyHours: 0
  },
  account: {
    workspaceName: "",
    email: "",
    mode: "Private",
    lastSaved: ""
  },
  applications: [],
  opportunities: [],
  savedRoles: [],
  jobAnalyses: [],
  chat: [],
  certifications: [],
  projects: [],
  skills: [],
  networking: [],
  interviews: [],
  goals: [],
  onboarding: {
    primaryGoal: ""
  },
  resume: "",
  activity: []
};

const sampleWorkspace = {
  profile: {
    displayName: "Sample Student",
    email: "student@example.edu",
    targetRole: "Data Analyst Intern",
    major: "Business Analytics",
    graduation: "2028",
    weeklyHours: 12
  },
  account: {
    workspaceName: "Sample Student Career Workspace",
    email: "student@example.edu",
    mode: "Private",
    lastSaved: "2026-07-02T19:54:39.000Z"
  },
  applications: [
    {
      id: "sample-app-1",
      company: "Capital One",
      role: "Technology Internship Program - Data Analyst",
      status: "Interviewing",
      deadline: "2026-07-18",
      link: "https://www.capitalonecareers.com/",
      notes: "Prepare STAR story for Nexus AI backend and CareerLens market analysis."
    },
    {
      id: "sample-app-2",
      company: "Campus Career Center",
      role: "Student Technology Assistant",
      status: "Applied",
      deadline: "2026-07-24",
      link: "",
      notes: "Follow up with portfolio link and ask about dashboard/reporting work."
    },
    {
      id: "sample-app-3",
      company: "Handshake",
      role: "Product Data Intern",
      status: "Saved",
      deadline: "2026-08-02",
      link: "https://joinhandshake.com/careers/",
      notes: "Tailor resume bullets around career workflow data and student UX."
    },
    {
      id: "sample-app-4",
      company: "DoorDash",
      role: "AI Research Fellowship",
      status: "Saved",
      deadline: "2026-08-15",
      link: "https://careers.doordash.com/",
      notes: "Draft proposal on AI coaching systems for local commerce learning loops."
    }
  ],
  opportunities: [
    {
      id: "sample-opp-1",
      name: "MLH Fellowship",
      type: "Fellowship",
      organization: "Major League Hacking",
      deadline: "2026-07-31",
      link: "https://fellowship.mlh.io/",
      notes: "Use Nexus AI as the code sample and explain full-stack architecture."
    },
    {
      id: "sample-opp-2",
      name: "AI Builders Challenge",
      type: "Career Program",
      organization: "IBM SkillsBuild",
      deadline: "2026-07-31",
      link: "",
      notes: "Submit Nexus as a student career operating system."
    }
  ],
  certifications: [
    {
      id: "sample-cert-1",
      name: "Google Data Analytics Professional Certificate",
      provider: "Google",
      progress: 100,
      target: "2026-06-28",
      link: "https://www.coursera.org/professional-certificates/google-data-analytics"
    },
    {
      id: "sample-cert-2",
      name: "Oracle Cloud Infrastructure Foundations Associate",
      provider: "Oracle",
      progress: 100,
      target: "2026-07-01",
      link: "https://education.oracle.com/"
    },
    {
      id: "sample-cert-3",
      name: "Power BI Data Analyst Learning Path",
      provider: "Microsoft Learn",
      progress: 45,
      target: "2026-08-10",
      link: "https://learn.microsoft.com/training/powerplatform/power-bi"
    }
  ],
  projects: [
    {
      id: "sample-project-1",
      name: "Nexus AI",
      stack: "JavaScript, FastAPI, SQLite, Render, GitHub Pages",
      stage: "Published",
      link: "https://jasonbinong.github.io/Nexus-AI/",
      impact: "Centralized 8 career workflows into one dashboard with live backend sync and readiness scoring."
    },
    {
      id: "sample-project-2",
      name: "CareerLens",
      stack: "JavaScript, HTML/CSS, labor-market analytics, LLM workflow design",
      stage: "Published",
      link: "https://jasonbinong.github.io/CareerLens-AI/",
      impact: "Turns job-posting patterns into skill, certification, and resume recommendations."
    },
    {
      id: "sample-project-3",
      name: "LearnWise",
      stack: "JavaScript, decision logic, academic planning dashboard",
      stage: "Improving",
      link: "https://example.com/learnwise",
      impact: "Ranks study resources by urgency, weak topics, and expected ROI for students."
    },
    {
      id: "sample-project-4",
      name: "15 Weeks at UMBC",
      stack: "Java, Processing, game design",
      stage: "Published",
      link: "https://jasonbinong.github.io/15-Weeks-At-UMBC/",
      impact: "Built a choice-based campus life game that models health, grades, food, and money tradeoffs."
    }
  ],
  skills: [
    {
      id: "sample-skill-1",
      name: "SQL",
      category: "Data",
      level: 72,
      evidence: "Nexus AI SQLite schema and backend endpoints"
    },
    {
      id: "sample-skill-2",
      name: "JavaScript",
      category: "Software",
      level: 82,
      evidence: "Nexus AI, CareerLens, and LearnWise frontends"
    },
    {
      id: "sample-skill-3",
      name: "Data Analysis",
      category: "Data",
      level: 78,
      evidence: "Google Data Analytics certificate and CareerLens market analysis"
    },
    {
      id: "sample-skill-4",
      name: "Generative AI",
      category: "AI",
      level: 74,
      evidence: "Career coaching workflows and AI prompt design across projects"
    },
    {
      id: "sample-skill-5",
      name: "GitHub",
      category: "Software",
      level: 80,
      evidence: "Public project repos with READMEs, thumbnails, and GitHub Pages deployments"
    },
    {
      id: "sample-skill-6",
      name: "FastAPI",
      category: "Software",
      level: 58,
      evidence: "Nexus AI backend API deployed on Render"
    }
  ],
  networking: [
    {
      id: "sample-network-1",
      name: "Campus Career Advisor",
      organization: "Career Center",
      status: "Follow up",
      next: "2026-07-09",
      notes: "Ask for feedback on Nexus AI as a student career tool."
    },
    {
      id: "sample-network-2",
      name: "LinkedIn Alumni Contact",
      organization: "Data Analytics",
      status: "Messaged",
      next: "2026-07-12",
      notes: "Send concise note about analytics projects and internship search."
    },
    {
      id: "sample-network-3",
      name: "MLH Fellowship Reviewer",
      organization: "Major League Hacking",
      status: "To contact",
      next: "2026-07-20",
      notes: "Prepare code sample explanation for Nexus AI backend and frontend state management."
    }
  ],
  interviews: [
    {
      id: "sample-interview-1",
      role: "Data Analyst Intern",
      company: "Capital One",
      type: "Behavioral",
      date: "2026-07-16",
      notes: "Practice STAR story: built Nexus AI from static app into deployed full-stack product."
    },
    {
      id: "sample-interview-2",
      role: "Product Data Intern",
      company: "Handshake",
      type: "Portfolio review",
      date: "2026-07-22",
      notes: "Walk through dashboard problem, data model, user workflow, and next product decisions."
    }
  ],
  onboarding: {
    primaryGoal: "Land an internship"
  },
  goals: [
    {
      id: "sample-goal-1",
      goal: "Ship PostgreSQL-backed Nexus AI prototype",
      category: "Backend",
      progress: 35,
      due: "2026-08-01",
      nextStep: "Design user table and migrate workspace collections from SQLite."
    },
    {
      id: "sample-goal-2",
      goal: "Apply to 12 internships or fellowships",
      category: "Career",
      progress: 42,
      due: "2026-08-15",
      nextStep: "Add five new roles and tailor resume bullets for AI/data analyst keywords."
    },
    {
      id: "sample-goal-3",
      goal: "Publish one technical case study",
      category: "Portfolio",
      progress: 70,
      due: "2026-07-25",
      nextStep: "Add screenshots, architecture diagram, and before-after product decisions."
    }
  ],
  resume: "Nexus AI | JavaScript, Python, FastAPI, SQLite, Render, GitHub Pages\n- Built a full-stack student career operating system that tracks applications, certifications, projects, networking, interviews, skills, resume notes, and goals in one workspace.\n- Designed readiness scoring, skill-gap analysis, weekly action planning, and portfolio proof tracking from live workspace data.\n- Deployed a FastAPI + SQLite backend on Render and connected the GitHub Pages frontend through production CORS configuration.",
  activity: [
    {
      id: "sample-activity-1",
      at: "2026-07-02T19:54:39.000Z",
      message: "Deployed Nexus AI backend to Render"
    },
    {
      id: "sample-activity-2",
      at: "2026-07-02T18:30:00.000Z",
      message: "Added optional starter workspace"
    },
    {
      id: "sample-activity-3",
      at: "2026-07-01T21:15:00.000Z",
      message: "Updated project links and resume notes"
    }
  ]
};

const schemas = {
  applications: [
    ["company", "Company", "text"],
    ["role", "Role", "text"],
    ["status", "Status", "select", ["Saved", "Applied", "Interviewing", "Offer", "Rejected", "Follow-up needed", "Deadline approaching"]],
    ["deadline", "Deadline", "date"],
    ["link", "Posting link", "url"],
    ["notes", "Notes / next action", "text"]
  ],
  opportunities: [
    ["name", "Opportunity name", "text"],
    ["type", "Type", "select", ["Internship", "Fellowship", "Hackathon", "Scholarship", "Career Program"]],
    ["organization", "Organization", "text"],
    ["deadline", "Deadline", "date"],
    ["link", "Application link", "url"],
    ["notes", "Why it matters / next step", "text"]
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
    ["link", "GitHub, live site, or project link", "url"],
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
let currentRecommendations = [];
let selectedApplicationId = "";
let latestJobAnalysis = null;
let latestGeneratedBullet = "";
let latestResumePageImages = [];

const els = {
  navItems: [...document.querySelectorAll(".nav-item")],
  navGroups: [...document.querySelectorAll(".nav-group")],
  views: [...document.querySelectorAll(".view")],
  viewTitle: document.querySelector("#viewTitle"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  sampleButton: document.querySelector("#sampleButton"),
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
  priorityAlerts: document.querySelector("#priorityAlerts"),
  recentActivity: document.querySelector("#recentActivity"),
  deadlineList: document.querySelector("#deadlineList"),
  analyticsList: document.querySelector("#analyticsList"),
  dashboardSkillGaps: document.querySelector("#dashboardSkillGaps"),
  schemaPreview: document.querySelector("#schemaPreview"),
  readinessTimeline: document.querySelector("#readinessTimeline"),
  applicationsList: document.querySelector("#applicationsList"),
  applicationStats: document.querySelector("#applicationStats"),
  applicationSearch: document.querySelector("#applicationSearch"),
  applicationFilter: document.querySelector("#applicationFilter"),
  applicationDetail: document.querySelector("#applicationDetail"),
  applicationDetailLabel: document.querySelector("#applicationDetailLabel"),
  roleSearch: document.querySelector("#roleSearch"),
  roleClusterFilter: document.querySelector("#roleClusterFilter"),
  roleExplorer: document.querySelector("#roleExplorer"),
  opportunityList: document.querySelector("#opportunityList"),
  pathBuilder: document.querySelector("#pathBuilder"),
  jobBoardSearch: document.querySelector("#jobBoardSearch"),
  jobBoardCluster: document.querySelector("#jobBoardCluster"),
  jobBoardList: document.querySelector("#jobBoardList"),
  opportunityTypeFilter: document.querySelector("#opportunityTypeFilter"),
  opportunitiesList: document.querySelector("#opportunitiesList"),
  opportunityStats: document.querySelector("#opportunityStats"),
  opportunityStrategy: document.querySelector("#opportunityStrategy"),
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
  resumePdfInput: document.querySelector("#resumePdfInput"),
  resumeUploadStatus: document.querySelector("#resumeUploadStatus"),
  reviewResumeButton: document.querySelector("#reviewResumeButton"),
  bulletBuilderForm: document.querySelector("#bulletBuilderForm"),
  bulletOutput: document.querySelector("#bulletOutput"),
  aiToolSelect: document.querySelector("#aiToolSelect"),
  aiApplicationSelect: document.querySelector("#aiApplicationSelect"),
  aiPromptInput: document.querySelector("#aiPromptInput"),
  aiOutput: document.querySelector("#aiOutput"),
  aiProviderLabel: document.querySelector("#aiProviderLabel"),
  runAiToolButton: document.querySelector("#runAiToolButton"),
  copyAiOutputButton: document.querySelector("#copyAiOutputButton"),
  jobSourceSelect: document.querySelector("#jobSourceSelect"),
  jobUrlInput: document.querySelector("#jobUrlInput"),
  jobCompanyInput: document.querySelector("#jobCompanyInput"),
  jobRoleInput: document.querySelector("#jobRoleInput"),
  jobDeadlineInput: document.querySelector("#jobDeadlineInput"),
  jobDescriptionInput: document.querySelector("#jobDescriptionInput"),
  analyzeJobButton: document.querySelector("#analyzeJobButton"),
  saveAnalyzedJobButton: document.querySelector("#saveAnalyzedJobButton"),
  jobAnalysisOutput: document.querySelector("#jobAnalysisOutput"),
  jdScoreLabel: document.querySelector("#jdScoreLabel"),
  chatThread: document.querySelector("#chatThread"),
  chatCoachForm: document.querySelector("#chatCoachForm"),
  profileNameHeading: document.querySelector("#profileNameHeading"),
  profileSummary: document.querySelector("#profileSummary"),
  profileScore: document.querySelector("#profileScore"),
  profileSnapshot: document.querySelector("#profileSnapshot"),
  profileProof: document.querySelector("#profileProof"),
  accountForm: document.querySelector("#accountForm"),
  accountStatus: document.querySelector("#accountStatus"),
  accountSummary: document.querySelector("#accountSummary"),
  accountControls: document.querySelector("#accountControls"),
  downloadAccountButton: document.querySelector("#downloadAccountButton"),
  resetAccountButton: document.querySelector("#resetAccountButton"),
  roleOptions: document.querySelector("#roleOptions"),
  onboardingForm: document.querySelector("#onboardingForm"),
  onboardingChecklist: document.querySelector("#onboardingChecklist"),
  onboardingProgress: document.querySelector("#onboardingProgress"),
  caseStudyScore: document.querySelector("#caseStudyScore"),
  caseStudyProblem: document.querySelector("#caseStudyProblem"),
  caseStudySystem: document.querySelector("#caseStudySystem"),
  caseStudyEvidence: document.querySelector("#caseStudyEvidence"),
  caseStudyRoadmap: document.querySelector("#caseStudyRoadmap"),
  editDialog: document.querySelector("#editDialog"),
  editForm: document.querySelector("#editForm"),
  editTitle: document.querySelector("#editTitle"),
  editFields: document.querySelector("#editFields"),
  downloadResumeButton: document.querySelector("#downloadResumeButton"),
  downloadSqlButton: document.querySelector("#downloadSqlButton"),
  downloadPlanButton: document.querySelector("#downloadPlanButton"),
  copyWeeklyPlanButton: document.querySelector("#copyWeeklyPlanButton"),
  syncStatus: document.querySelector("#syncStatus")
};

document.querySelector("#applicationForm").addEventListener("submit", event => addFromForm(event, "applications"));
document.querySelector("#opportunityForm").addEventListener("submit", event => addFromForm(event, "opportunities"));
document.querySelector("#certificationForm").addEventListener("submit", event => addFromForm(event, "certifications"));
document.querySelector("#projectForm").addEventListener("submit", event => addFromForm(event, "projects"));
document.querySelector("#skillForm").addEventListener("submit", event => addFromForm(event, "skills"));
document.querySelector("#networkForm").addEventListener("submit", event => addFromForm(event, "networking"));
document.querySelector("#interviewForm").addEventListener("submit", event => addFromForm(event, "interviews"));
document.querySelector("#goalForm").addEventListener("submit", event => addFromForm(event, "goals"));
document.querySelector("#saveResumeButton").addEventListener("click", saveResume);
els.resumePdfInput?.addEventListener("change", importResumePdf);
els.reviewResumeButton?.addEventListener("click", reviewResumeNow);
els.bulletBuilderForm.addEventListener("submit", buildResumeBullet);
els.bulletOutput.addEventListener("click", event => {
  if (event.target.matches("[data-add-bullet]")) appendBulletToResume();
});
els.runAiToolButton.addEventListener("click", runAiTool);
els.copyAiOutputButton.addEventListener("click", copyAiOutput);
els.analyzeJobButton.addEventListener("click", analyzeJobDescription);
els.saveAnalyzedJobButton.addEventListener("click", saveAnalyzedJob);
els.chatCoachForm.addEventListener("submit", sendChatMessage);
els.downloadResumeButton.addEventListener("click", downloadResume);
els.downloadSqlButton.addEventListener("click", downloadSqlSchema);
els.downloadPlanButton.addEventListener("click", downloadCareerPlan);
els.copyWeeklyPlanButton.addEventListener("click", copyWeeklyPlan);
els.exportButton.addEventListener("click", exportSnapshot);
els.importButton.addEventListener("click", () => els.importFile.click());
els.importFile.addEventListener("change", importSnapshot);
els.sampleButton?.addEventListener("click", loadSampleWorkspace);
els.clearButton.addEventListener("click", clearWorkspace);
els.profileForm.addEventListener("submit", saveProfile);
els.onboardingForm.addEventListener("submit", saveOnboarding);
els.applicationSearch.addEventListener("input", renderApplications);
els.applicationFilter.addEventListener("change", renderApplications);
els.roleSearch.addEventListener("input", renderExplore);
els.roleClusterFilter.addEventListener("change", renderExplore);
els.jobBoardSearch.addEventListener("input", renderJobBoard);
els.jobBoardCluster.addEventListener("change", renderJobBoard);
els.opportunityTypeFilter?.addEventListener("change", renderOpportunities);
els.accountForm?.addEventListener("submit", saveAccount);
els.downloadAccountButton?.addEventListener("click", exportSnapshot);
els.resetAccountButton?.addEventListener("click", clearWorkspace);
els.editForm.addEventListener("submit", saveEdit);
els.navItems.forEach(item => item.addEventListener("click", () => {
  switchView(item.dataset.view);
  item.closest(".nav-group")?.removeAttribute("open");
}));
document.addEventListener("click", event => {
  if (event.target.closest(".nav-group")) return;
  els.navGroups.forEach(group => group.removeAttribute("open"));
});

const roleRequirements = {
  "data analyst": ["SQL", "Excel", "Power BI", "Data Analysis", "Statistics", "Communication"],
  "business intelligence": ["SQL", "Power BI", "Data Visualization", "Business Analysis", "Excel", "Communication"],
  "ai data": ["AI Model Evaluation", "Prompt Engineering", "Data Quality", "Generative AI", "Communication"],
  "machine learning": ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
  "business analyst": ["Business Analysis", "Systems Analysis", "SQL", "Agile", "Communication"],
  "systems analyst": ["Systems Analysis", "Database Management", "Business Analysis", "Agile", "Documentation"],
  "software": ["JavaScript", "Object-Oriented Programming", "GitHub", "Testing", "APIs"],
  "cloud": ["Cloud Computing", "Troubleshooting", "Networking", "Documentation", "Security"],
  "cybersecurity": ["Security", "Networking", "Python", "Risk Analysis", "Documentation", "Troubleshooting"],
  "ux": ["User Research", "Wireframing", "Communication", "Product Thinking", "Accessibility", "Data Analysis"],
  "qa": ["Testing", "Documentation", "APIs", "Troubleshooting", "Communication", "JavaScript"],
  "database": ["SQL", "Database Management", "Data Modeling", "APIs", "Documentation", "Security"],
  "default": ["SQL", "JavaScript", "Data Analysis", "Generative AI", "GitHub", "Communication"]
};

const careerPaths = [
  {
    id: "ai-data-analyst",
    title: "AI Data Analyst Intern",
    cluster: "AI",
    matchTerms: ["ai data", "data analyst", "analytics", "llm"],
    summary: "Uses analytics, LLM evaluation, and dashboarding to turn messy AI or product data into decisions.",
    skills: ["SQL", "Data Analysis", "AI Model Evaluation", "Prompt Engineering", "Power BI", "Communication"],
    proof: ["LLM evaluation rubric", "dashboard case study", "SQL analysis project"],
    next: "Add one project that scores AI outputs or compares model responses with a clear rubric."
  },
  {
    id: "software-engineer",
    title: "Software Engineering Intern",
    cluster: "Software",
    matchTerms: ["software", "frontend", "backend", "full-stack", "developer"],
    summary: "Builds production features, APIs, tests, and user workflows in a codebase with other engineers.",
    skills: ["JavaScript", "APIs", "Testing", "GitHub", "Object-Oriented Programming", "Documentation"],
    proof: ["deployed web app", "API endpoints", "tests or QA checklist"],
    next: "Add tests and a short architecture note for one deployed project."
  },
  {
    id: "business-intelligence",
    title: "Business Intelligence Intern",
    cluster: "Data",
    matchTerms: ["business intelligence", "bi", "power bi", "reporting"],
    summary: "Builds dashboards, metrics, and reporting workflows that help teams understand performance.",
    skills: ["SQL", "Power BI", "Excel", "Data Visualization", "Business Analysis", "Communication"],
    proof: ["Power BI dashboard", "metric definitions", "business recommendation"],
    next: "Create one dashboard with a problem statement, metric logic, and recommendation."
  },
  {
    id: "product-analyst",
    title: "Product Analyst Intern",
    cluster: "Product",
    matchTerms: ["product", "analyst", "growth", "user"],
    summary: "Studies user behavior, product funnels, and feature outcomes to recommend better product decisions.",
    skills: ["Data Analysis", "SQL", "Product Thinking", "A/B Testing", "Communication", "User Research"],
    proof: ["funnel analysis", "feature metric plan", "user problem case study"],
    next: "Add product metrics to Nexus or CareerLens and explain what decision they support."
  },
  {
    id: "cloud-systems",
    title: "Cloud / Systems Intern",
    cluster: "Cloud",
    matchTerms: ["cloud", "systems", "infrastructure", "render", "oci"],
    summary: "Supports deployments, monitoring, troubleshooting, databases, APIs, and reliable system operations.",
    skills: ["Cloud Computing", "APIs", "Database Management", "Troubleshooting", "Security", "Documentation"],
    proof: ["deployment guide", "API health checks", "database schema"],
    next: "Document your Render backend, CORS setup, health endpoint, and database migration plan."
  },
  {
    id: "ai-product-builder",
    title: "AI Product Builder",
    cluster: "AI",
    matchTerms: ["ai", "product", "builder", "startup"],
    summary: "Turns AI workflows into useful products with strong UX, evaluation, and clear user outcomes.",
    skills: ["Generative AI", "Prompt Engineering", "JavaScript", "Systems Analysis", "User Research", "Data Analysis"],
    proof: ["AI feature workflow", "case study", "before-after product decision"],
    next: "Add one AI coaching workflow that explains why each recommendation was made."
  },
  {
    id: "llm-evaluation-specialist",
    title: "LLM Evaluation Specialist",
    cluster: "AI",
    matchTerms: ["llm", "evaluation", "ai data", "red team"],
    summary: "Designs rubrics, reviews model outputs, identifies failure patterns, and improves AI reliability.",
    skills: ["AI Model Evaluation", "Prompt Engineering", "Data Quality", "Communication", "Critical Thinking", "Documentation"],
    proof: ["evaluation rubric", "annotated examples", "quality improvement summary"],
    next: "Create a public rubric that scores AI responses for accuracy, helpfulness, safety, and evidence use."
  },
  {
    id: "prompt-engineering-analyst",
    title: "Prompt Engineering Analyst",
    cluster: "AI",
    matchTerms: ["prompt", "llm", "ai"],
    summary: "Improves AI workflows by testing prompts, measuring outputs, and documenting reusable patterns.",
    skills: ["Prompt Engineering", "Generative AI", "AI Model Evaluation", "Documentation", "Data Analysis", "Communication"],
    proof: ["prompt iteration log", "before-after outputs", "evaluation notes"],
    next: "Document one prompt workflow where a measurable output improved after iteration."
  },
  {
    id: "ai-red-teamer",
    title: "AI Red Teamer",
    cluster: "AI",
    matchTerms: ["red team", "safety", "ai", "llm"],
    summary: "Tests AI systems for unsafe, biased, hallucinated, or policy-breaking behavior.",
    skills: ["AI Model Evaluation", "Risk Analysis", "Prompt Engineering", "Security", "Documentation", "Communication"],
    proof: ["failure taxonomy", "test prompts", "mitigation recommendations"],
    next: "Build a small AI safety test suite with prompt categories and scored outcomes."
  },
  {
    id: "machine-learning-intern",
    title: "Machine Learning Intern",
    cluster: "AI",
    matchTerms: ["machine learning", "ml", "python"],
    summary: "Builds or evaluates predictive models, prepares datasets, and communicates model results.",
    skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization", "Communication"],
    proof: ["model notebook converted to app", "evaluation metrics", "data cleaning summary"],
    next: "Turn one ML experiment into a deployable app or API with clear evaluation metrics."
  },
  {
    id: "data-scientist-intern",
    title: "Data Scientist Intern",
    cluster: "Data",
    matchTerms: ["data scientist", "data science", "python"],
    summary: "Uses statistics, experiments, and modeling to answer product or business questions.",
    skills: ["Python", "SQL", "Statistics", "Data Analysis", "Machine Learning", "Communication"],
    proof: ["analysis project", "model evaluation", "business recommendation"],
    next: "Add one end-to-end data project with a question, method, result, and recommendation."
  },
  {
    id: "data-engineering-intern",
    title: "Data Engineering Intern",
    cluster: "Data",
    matchTerms: ["data engineering", "pipeline", "etl"],
    summary: "Builds data pipelines, schemas, and reliable workflows for analytics and product teams.",
    skills: ["SQL", "Python", "Database Management", "APIs", "Data Modeling", "Cloud Computing"],
    proof: ["ETL pipeline", "schema design", "data quality checks"],
    next: "Build a small pipeline that ingests, cleans, stores, and reports on application data."
  },
  {
    id: "database-analyst",
    title: "Database Analyst Intern",
    cluster: "Data",
    matchTerms: ["database", "sql", "data"],
    summary: "Designs tables, writes queries, validates records, and supports reporting systems.",
    skills: ["SQL", "Database Management", "Data Modeling", "Documentation", "Data Quality", "Business Analysis"],
    proof: ["relational schema", "query examples", "data validation checklist"],
    next: "Add a database case study explaining Nexus tables, relationships, and query use cases."
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineering Intern",
    cluster: "Software",
    matchTerms: ["frontend", "javascript", "react", "ui"],
    summary: "Builds user-facing interfaces with accessible components, clean state, and responsive layouts.",
    skills: ["JavaScript", "React", "HTML", "CSS", "Accessibility", "Testing"],
    proof: ["responsive UI", "component states", "accessibility notes"],
    next: "Add a React or component-based version of one Nexus workflow with documented states."
  },
  {
    id: "backend-engineer",
    title: "Backend Engineering Intern",
    cluster: "Software",
    matchTerms: ["backend", "api", "fastapi", "server"],
    summary: "Builds APIs, database workflows, validation, tests, and service documentation.",
    skills: ["Python", "FastAPI", "APIs", "SQLite", "Testing", "Documentation"],
    proof: ["API routes", "schema", "contract tests"],
    next: "Add endpoint tests and a clear API contract table to Nexus."
  },
  {
    id: "full-stack-engineer",
    title: "Full-Stack Engineering Intern",
    cluster: "Software",
    matchTerms: ["full-stack", "full stack", "software"],
    summary: "Connects frontend workflows, backend APIs, database logic, and deployment.",
    skills: ["JavaScript", "Python", "APIs", "Database Management", "GitHub", "Cloud Computing"],
    proof: ["deployed frontend", "backend API", "database-backed workflow"],
    next: "Record a walkthrough showing a frontend action updating backend data."
  },
  {
    id: "software-qa-engineer",
    title: "Software Quality Engineer Intern",
    cluster: "Software",
    matchTerms: ["qa", "quality", "testing", "software"],
    summary: "Tests software manually and automatically, writes bug reports, and protects product quality.",
    skills: ["Testing", "Documentation", "APIs", "Troubleshooting", "Communication", "JavaScript"],
    proof: ["test plan", "bug reports", "QA checklist"],
    next: "Create a QA test plan for Nexus with expected results, edge cases, and bug severity."
  },
  {
    id: "devops-intern",
    title: "DevOps Intern",
    cluster: "Cloud",
    matchTerms: ["devops", "deployment", "cloud"],
    summary: "Improves deployments, environment setup, monitoring, automation, and reliability.",
    skills: ["Cloud Computing", "GitHub", "APIs", "Docker", "Troubleshooting", "Documentation"],
    proof: ["deployment guide", "environment variables", "health checks"],
    next: "Add a deployment diagram and environment variable guide for Nexus."
  },
  {
    id: "cloud-engineer",
    title: "Cloud Engineering Intern",
    cluster: "Cloud",
    matchTerms: ["cloud", "oci", "aws", "azure"],
    summary: "Supports cloud-hosted apps, security basics, databases, and service configuration.",
    skills: ["Cloud Computing", "Security", "Networking", "Database Management", "Troubleshooting", "Documentation"],
    proof: ["cloud deployment", "certification", "architecture notes"],
    next: "Compare Render, GitHub Pages, OCI, and PostgreSQL as a deployment decision record."
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst Intern",
    cluster: "Cybersecurity",
    matchTerms: ["cybersecurity", "security", "risk"],
    summary: "Identifies risks, reviews system behavior, documents findings, and supports safer operations.",
    skills: ["Security", "Networking", "Risk Analysis", "Python", "Documentation", "Troubleshooting"],
    proof: ["risk register", "security checklist", "incident-style analysis"],
    next: "Add a security checklist for Nexus covering auth, data privacy, CORS, and input validation."
  },
  {
    id: "security-engineer",
    title: "Security Engineering Intern",
    cluster: "Cybersecurity",
    matchTerms: ["security engineer", "security", "software"],
    summary: "Builds or tests secure systems, reviews code paths, and improves defensive controls.",
    skills: ["Security", "APIs", "Testing", "Python", "Cloud Computing", "Documentation"],
    proof: ["secure API review", "threat model", "validation tests"],
    next: "Create a threat model for Nexus with assets, risks, controls, and residual concerns."
  },
  {
    id: "product-manager",
    title: "Associate Product Manager Intern",
    cluster: "Product",
    matchTerms: ["product manager", "apm", "product"],
    summary: "Defines user problems, prioritizes features, coordinates execution, and measures outcomes.",
    skills: ["Product Thinking", "User Research", "Communication", "Data Analysis", "Agile", "Systems Analysis"],
    proof: ["product case study", "roadmap", "success metrics"],
    next: "Write a one-page product requirements doc for Nexus AI Tools."
  },
  {
    id: "technical-product-manager",
    title: "Technical Product Manager Intern",
    cluster: "Product",
    matchTerms: ["technical product", "product", "api"],
    summary: "Connects user needs to technical architecture, API decisions, and measurable product outcomes.",
    skills: ["Product Thinking", "Systems Analysis", "APIs", "Data Analysis", "Communication", "Agile"],
    proof: ["technical PRD", "architecture tradeoffs", "roadmap"],
    next: "Document why Nexus uses local fallback plus API-backed AI tools."
  },
  {
    id: "ux-researcher",
    title: "UX Research Intern",
    cluster: "UX",
    matchTerms: ["ux", "research", "user"],
    summary: "Studies user needs, tests product workflows, and turns feedback into product decisions.",
    skills: ["User Research", "Communication", "Data Analysis", "Product Thinking", "Accessibility", "Documentation"],
    proof: ["interview script", "research synthesis", "usability findings"],
    next: "Run a small usability test with classmates and summarize three product changes."
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Design Intern",
    cluster: "UX",
    matchTerms: ["ui", "ux", "design"],
    summary: "Designs interfaces, workflows, wireframes, and accessible user experiences.",
    skills: ["Wireframing", "Accessibility", "User Research", "Product Thinking", "Communication", "HTML"],
    proof: ["wireframes", "prototype", "design rationale"],
    next: "Create a before-after design case study for the Nexus modern platform refresh."
  },
  {
    id: "business-systems-analyst",
    title: "Business Systems Analyst Intern",
    cluster: "Business",
    matchTerms: ["business systems", "systems analyst", "business analyst"],
    summary: "Maps requirements, processes, data flows, and system changes for business teams.",
    skills: ["Systems Analysis", "Business Analysis", "SQL", "Documentation", "Agile", "Communication"],
    proof: ["requirements document", "workflow map", "data model"],
    next: "Add a workflow map showing how Nexus converts student inputs into recommendations."
  },
  {
    id: "it-support-analyst",
    title: "IT Support Analyst Intern",
    cluster: "IT",
    matchTerms: ["it support", "help desk", "systems"],
    summary: "Troubleshoots user issues, documents fixes, supports systems, and communicates clearly.",
    skills: ["Troubleshooting", "Documentation", "Communication", "Networking", "Security", "Systems Analysis"],
    proof: ["support playbook", "ticket examples", "knowledge base article"],
    next: "Create a support-style troubleshooting guide for Nexus setup and API connection issues."
  },
  {
    id: "crm-operations",
    title: "CRM / Operations Analyst Intern",
    cluster: "Business",
    matchTerms: ["operations", "crm", "business"],
    summary: "Manages operational workflows, reporting, customer data, and process improvements.",
    skills: ["Excel", "SQL", "Business Analysis", "Data Analysis", "Communication", "Systems Analysis"],
    proof: ["tracker workflow", "dashboard", "process improvement note"],
    next: "Frame Nexus as a CRM for student career prep and document the workflow metrics."
  }
];

careerPaths.push(
  ...[
    ["ai-ml-engineer", "AI / ML Engineering Intern", "AI", ["ai engineer", "ml engineer", "machine learning engineer"], "Builds AI-powered product features, prototypes model workflows, and connects AI outputs to user-facing applications.", ["Python", "Machine Learning", "APIs", "JavaScript", "Testing", "AI Model Evaluation"], ["AI feature prototype", "model evaluation notes", "API-backed app"], "Add one AI feature that accepts user input, returns a scored result, and explains the output."],
    ["generative-ai-engineer", "Generative AI Engineering Intern", "AI", ["generative ai", "rag", "llm app"], "Builds LLM-powered workflows with retrieval, prompt design, evaluation, and user experience safeguards.", ["Generative AI", "Prompt Engineering", "Python", "APIs", "AI Model Evaluation", "Documentation"], ["LLM workflow", "prompt test cases", "evaluation rubric"], "Add retrieval or source-grounded responses to one Nexus coaching workflow."],
    ["ai-solutions-engineer", "AI Solutions Engineer Intern", "AI", ["solutions engineer", "ai solutions", "technical customer"], "Translates user problems into AI workflows, demos, implementation plans, and technical recommendations.", ["Generative AI", "Systems Analysis", "APIs", "Communication", "Documentation", "Product Thinking"], ["implementation plan", "customer workflow map", "AI use case brief"], "Write a solution brief showing how Nexus supports a specific student career workflow."],
    ["ai-governance-analyst", "AI Governance Analyst Intern", "AI", ["ai governance", "responsible ai", "compliance"], "Evaluates AI risks, documentation, policies, privacy concerns, and responsible deployment practices.", ["AI Model Evaluation", "Risk Analysis", "Documentation", "Data Privacy", "Communication", "Systems Analysis"], ["risk register", "model card", "governance checklist"], "Create a responsible AI checklist for Nexus recommendations and user data handling."],
    ["ai-policy-analyst", "AI Policy Analyst Intern", "AI", ["ai policy", "governance", "policy"], "Researches AI regulation, social impact, governance practices, and organizational AI risk decisions.", ["AI Governance", "Research", "Writing", "Risk Analysis", "Communication", "Data Privacy"], ["policy memo", "regulation comparison", "ethics brief"], "Add a policy memo connecting Nexus to student privacy and AI coaching transparency."],
    ["ai-research-assistant", "AI Research Assistant", "AI", ["ai research", "research assistant", "llm"], "Supports experiments, literature reviews, evaluation design, and analysis of AI system behavior.", ["Research", "Python", "AI Model Evaluation", "Data Analysis", "Statistics", "Documentation"], ["research notes", "experiment log", "evaluation table"], "Create a small experiment comparing two AI coaching prompt strategies."],
    ["computer-vision-intern", "Computer Vision Intern", "AI", ["computer vision", "opencv", "image"], "Works on image/video understanding, labeling, model testing, and visual data workflows.", ["Python", "Machine Learning", "Data Annotation", "Model Evaluation", "Statistics", "Documentation"], ["labeled dataset", "model metrics", "annotation guide"], "Build a small visual classification project with labeled examples and error analysis."],
    ["nlp-intern", "NLP Intern", "AI", ["nlp", "language model", "text classification"], "Builds and evaluates text-processing workflows for classification, extraction, summarization, or search.", ["Python", "Natural Language Processing", "LLMs", "Data Analysis", "AI Model Evaluation", "Prompt Engineering"], ["text classifier", "extraction workflow", "evaluation notes"], "Turn job descriptions into structured fields and benchmark extraction quality."],
    ["data-analyst", "Data Analyst Intern", "Data", ["data analyst", "analytics", "excel"], "Uses SQL, spreadsheets, dashboards, and communication to answer business or product questions.", ["SQL", "Excel", "Data Analysis", "Data Visualization", "Communication", "Business Analysis"], ["analysis brief", "dashboard", "recommendation"], "Create one public analysis with a clear question, chart, insight, and recommendation."],
    ["analytics-engineer", "Analytics Engineering Intern", "Data", ["analytics engineer", "dbt", "metrics"], "Builds trusted data models, metric definitions, and reporting layers for analytics teams.", ["SQL", "Data Modeling", "Data Quality", "Documentation", "GitHub", "Business Analysis"], ["metric layer", "data model", "quality checks"], "Document a clean data model for Nexus applications, skills, and goals."],
    ["business-analytics", "Business Analytics Intern", "Data", ["business analytics", "business analyst", "reporting"], "Turns business data into insights, dashboards, and process recommendations.", ["SQL", "Excel", "Power BI", "Business Analysis", "Communication", "Data Visualization"], ["Power BI report", "business memo", "metric definitions"], "Build a business analytics view for application conversion and follow-up rates."],
    ["marketing-analyst", "Marketing Analyst Intern", "Marketing", ["marketing analyst", "campaign", "growth"], "Measures campaign performance, audience behavior, funnels, and marketing channel outcomes.", ["Data Analysis", "Excel", "SQL", "Data Visualization", "Communication", "A/B Testing"], ["campaign dashboard", "audience analysis", "funnel recommendation"], "Add a campaign-style analysis of how students discover and use Nexus."],
    ["growth-analyst", "Growth Analyst Intern", "Marketing", ["growth analyst", "retention", "activation"], "Analyzes activation, retention, engagement loops, and growth experiments.", ["SQL", "Data Analysis", "Product Thinking", "A/B Testing", "Data Visualization", "Communication"], ["growth experiment", "retention chart", "activation metric"], "Define activation and retention metrics for Nexus and show how they would be tracked."],
    ["financial-analyst", "Financial Analyst Intern", "Finance", ["financial analyst", "finance", "forecast"], "Builds financial models, analyzes performance, and communicates business implications.", ["Excel", "Data Analysis", "Financial Modeling", "Communication", "Business Analysis", "Power BI"], ["financial model", "variance analysis", "recommendation memo"], "Create a simple revenue or pricing model for Nexus as a startup concept."],
    ["quantitative-analyst", "Quantitative Analyst Intern", "Finance", ["quant", "quantitative", "statistics"], "Uses math, statistics, programming, and data analysis to model financial or operational behavior.", ["Python", "Statistics", "Data Analysis", "SQL", "Machine Learning", "Communication"], ["statistical model", "backtest summary", "risk analysis"], "Build a small scoring model and explain assumptions, limitations, and evaluation metrics."],
    ["risk-analyst", "Risk Analyst Intern", "Finance", ["risk analyst", "compliance", "controls"], "Identifies operational, financial, technology, or compliance risks and recommends controls.", ["Risk Analysis", "Excel", "Documentation", "Data Analysis", "Communication", "Systems Analysis"], ["risk register", "control matrix", "audit notes"], "Create a risk register for Nexus covering privacy, storage, AI advice, and security."],
    ["backend-api-engineer", "API Engineering Intern", "Software", ["api engineer", "rest api", "backend"], "Designs reliable API endpoints, validation, contracts, database access, and service documentation.", ["Python", "FastAPI", "APIs", "Testing", "Database Management", "Documentation"], ["API contract", "endpoint tests", "schema notes"], "Add examples for every Nexus API endpoint and document request/response fields."],
    ["web-developer", "Web Developer Intern", "Software", ["web developer", "html", "css", "javascript"], "Builds accessible, responsive web experiences with clean JavaScript behavior and polished UI.", ["HTML", "CSS", "JavaScript", "Accessibility", "Testing", "GitHub"], ["responsive site", "interaction states", "accessibility notes"], "Improve one Nexus workflow on mobile and document the before-after UX change."],
    ["react-developer", "React Developer Intern", "Software", ["react", "frontend", "component"], "Builds component-based interfaces, manages state, and connects UI workflows to APIs.", ["React", "JavaScript", "APIs", "CSS", "Testing", "Accessibility"], ["React component", "state flow", "API integration"], "Rebuild one Nexus module as reusable React components."],
    ["mobile-app-developer", "Mobile App Developer Intern", "Software", ["mobile", "ios", "android"], "Builds mobile app screens, state flows, APIs, and user-friendly interactions.", ["JavaScript", "APIs", "UI Design", "Testing", "Product Thinking", "GitHub"], ["mobile prototype", "screen flow", "API-backed feature"], "Design a mobile-first version of the Nexus application tracker."],
    ["game-developer", "Game Developer Intern", "Software", ["game developer", "game", "unity"], "Builds interactive gameplay systems, UI, state, feedback loops, and polished player experiences.", ["JavaScript", "Object-Oriented Programming", "Game Design", "Testing", "UI Design", "GitHub"], ["playable game", "mechanics", "state management"], "Document the decision engine and balancing logic behind 15 Weeks at UMBC."],
    ["automation-engineer", "Automation Engineering Intern", "Software", ["automation", "workflow", "scripting"], "Automates repeated workflows, testing, reporting, data movement, or operations tasks.", ["Python", "JavaScript", "APIs", "Testing", "Documentation", "Troubleshooting"], ["automation script", "time saved estimate", "error handling"], "Build a script that imports application data from CSV into Nexus."],
    ["sre-intern", "Site Reliability Engineering Intern", "Cloud", ["sre", "reliability", "monitoring"], "Improves reliability, monitoring, incident response, automation, and service health.", ["Cloud Computing", "APIs", "Monitoring", "Troubleshooting", "Python", "Documentation"], ["health checks", "runbook", "incident scenario"], "Add a reliability runbook for Nexus backend outages and fallback behavior."],
    ["platform-engineer", "Platform Engineering Intern", "Cloud", ["platform", "developer experience", "infra"], "Builds internal platforms, tooling, deployment workflows, and developer experience improvements.", ["Cloud Computing", "GitHub", "APIs", "Documentation", "Automation", "Troubleshooting"], ["deployment workflow", "environment guide", "developer docs"], "Create a one-command setup guide and environment checklist for Nexus."],
    ["cloud-support", "Cloud Support Intern", "Cloud", ["cloud support", "technical support", "support engineer"], "Troubleshoots cloud services, explains technical issues, and documents fixes for users.", ["Cloud Computing", "Networking", "Troubleshooting", "Communication", "Documentation", "Security"], ["support article", "incident notes", "configuration checklist"], "Write support docs for common Nexus backend, CORS, and environment variable issues."],
    ["network-engineer", "Network Engineering Intern", "IT", ["network", "networking", "infrastructure"], "Supports network systems, connectivity, monitoring, troubleshooting, and documentation.", ["Networking", "Security", "Troubleshooting", "Documentation", "Cloud Computing", "Communication"], ["network diagram", "troubleshooting guide", "security notes"], "Create a network-style architecture diagram for Nexus frontend, backend, and database."],
    ["systems-administrator", "Systems Administrator Intern", "IT", ["sysadmin", "systems administrator", "it systems"], "Maintains systems, access, troubleshooting, documentation, and operational reliability.", ["Systems Analysis", "Troubleshooting", "Security", "Documentation", "Cloud Computing", "Communication"], ["admin checklist", "access plan", "runbook"], "Create an admin runbook for managing a Nexus production environment."],
    ["information-security-analyst", "Information Security Analyst Intern", "Cybersecurity", ["information security", "security analyst", "soc"], "Monitors risks, reviews alerts, documents incidents, and supports security controls.", ["Security", "Risk Analysis", "Networking", "Documentation", "Troubleshooting", "Communication"], ["security checklist", "incident report", "risk matrix"], "Write a security review for Nexus data storage, auth roadmap, and API behavior."],
    ["soc-analyst", "SOC Analyst Intern", "Cybersecurity", ["soc analyst", "security operations", "incident"], "Reviews security events, triages incidents, escalates findings, and documents response steps.", ["Security", "Networking", "Troubleshooting", "Documentation", "Risk Analysis", "Communication"], ["alert triage", "incident timeline", "response notes"], "Build a mock incident response timeline for suspicious Nexus API activity."],
    ["privacy-analyst", "Privacy Analyst Intern", "Cybersecurity", ["privacy analyst", "data privacy", "compliance"], "Evaluates data collection, consent, retention, privacy risks, and user-facing policies.", ["Data Privacy", "Risk Analysis", "Documentation", "Communication", "Systems Analysis", "Security"], ["privacy notice", "data map", "retention policy"], "Add a data map showing what Nexus stores locally, through the API, and in exports."],
    ["digital-forensics", "Digital Forensics Intern", "Cybersecurity", ["forensics", "incident response", "security"], "Investigates events, preserves evidence, analyzes system behavior, and documents findings.", ["Security", "Troubleshooting", "Documentation", "Python", "Risk Analysis", "Communication"], ["forensics notes", "timeline", "evidence summary"], "Create a mock investigation of a broken application sync event."],
    ["product-operations", "Product Operations Intern", "Product", ["product operations", "ops", "product"], "Improves product feedback loops, processes, user data, documentation, and launch readiness.", ["Product Thinking", "Systems Analysis", "Data Analysis", "Documentation", "Communication", "Agile"], ["feedback tracker", "launch checklist", "process map"], "Build a feedback intake workflow for Nexus user requests and bug reports."],
    ["program-manager", "Technical Program Manager Intern", "Product", ["program manager", "tpm", "technical program"], "Coordinates technical projects, timelines, risks, dependencies, and stakeholder communication.", ["Agile", "Systems Analysis", "Communication", "Documentation", "Risk Analysis", "Product Thinking"], ["project plan", "risk log", "status update"], "Create a release plan for the next Nexus milestone with scope, risks, and timeline."],
    ["customer-success-technical", "Technical Customer Success Intern", "Business", ["customer success", "technical customer", "implementation"], "Helps users adopt technical products through onboarding, troubleshooting, education, and feedback.", ["Communication", "Systems Analysis", "Documentation", "Product Thinking", "Troubleshooting", "Data Analysis"], ["onboarding guide", "user success metrics", "support workflow"], "Write a student onboarding playbook for first-week Nexus usage."],
    ["solutions-consultant", "Solutions Consultant Intern", "Business", ["solutions consultant", "consulting", "implementation"], "Maps user problems to product workflows, explains value, and supports technical implementation.", ["Systems Analysis", "Communication", "Product Thinking", "APIs", "Business Analysis", "Documentation"], ["solution map", "implementation brief", "workflow diagram"], "Create a solutions brief for a campus career center using Nexus."],
    ["technology-consultant", "Technology Consulting Intern", "Business", ["technology consulting", "consultant", "systems"], "Analyzes business problems, recommends technology solutions, and documents implementation plans.", ["Systems Analysis", "Business Analysis", "Communication", "Data Analysis", "Documentation", "Agile"], ["client memo", "systems diagram", "requirements"], "Write a consulting-style case study for Nexus as a campus career-prep system."],
    ["erp-analyst", "ERP Analyst Intern", "Business", ["erp", "enterprise systems", "business systems"], "Supports enterprise workflows, requirements, data, process improvements, and system configuration.", ["Systems Analysis", "Database Management", "Business Analysis", "Documentation", "SQL", "Communication"], ["workflow map", "requirements table", "data model"], "Map Nexus modules as enterprise-style workflows with inputs, owners, and outputs."],
    ["sales-operations", "Sales Operations Intern", "Business", ["sales operations", "revenue operations", "crm"], "Manages pipeline data, reporting, CRM hygiene, forecasting, and process improvements.", ["Excel", "Data Analysis", "CRM", "SQL", "Business Analysis", "Communication"], ["pipeline dashboard", "CRM process", "forecast summary"], "Frame Nexus applications as a CRM pipeline and report stage conversion metrics."],
    ["research-data-analyst", "Research Data Analyst Intern", "Research", ["research data", "research analyst", "data"], "Supports research projects through data collection, cleaning, analysis, and clear documentation.", ["Data Analysis", "Statistics", "Research", "Excel", "SQL", "Documentation"], ["research dataset", "analysis memo", "methods notes"], "Create a research-style analysis of student career-prep pain points."],
    ["computational-social-science", "Computational Social Science Intern", "Research", ["computational social science", "social data", "research"], "Uses data and computation to study social behavior, technology, platforms, or institutions.", ["Python", "Data Analysis", "Research", "Statistics", "Data Visualization", "Ethics"], ["research question", "dataset analysis", "ethics notes"], "Analyze how AI career tools affect student decision-making and confidence."],
    ["human-computer-interaction", "HCI Research Intern", "Research", ["hci", "human computer interaction", "user research"], "Studies how people use technology through research methods, prototypes, and usability evaluation.", ["User Research", "Product Thinking", "Data Analysis", "Accessibility", "Communication", "Documentation"], ["usability study", "prototype findings", "research synthesis"], "Run a usability study on the Nexus onboarding and job importer."],
    ["education-technology", "EdTech Product Intern", "Education", ["edtech", "education technology", "learning"], "Builds or evaluates learning products, student workflows, progress tracking, and academic support tools.", ["Product Thinking", "User Research", "Data Analysis", "Generative AI", "Communication", "Systems Analysis"], ["learning workflow", "student feedback", "product metrics"], "Connect LearnWise and Nexus into a learning-to-career pathway case study."],
    ["learning-analytics", "Learning Analytics Intern", "Education", ["learning analytics", "student success", "education data"], "Analyzes learning behavior, student progress, intervention signals, and educational outcomes.", ["Data Analysis", "SQL", "Data Visualization", "Education Analytics", "Communication", "Research"], ["student dashboard", "intervention model", "analytics memo"], "Build a learning analytics view that maps skills progress to career readiness."],
    ["health-informatics", "Health Informatics Intern", "Healthcare", ["health informatics", "health data", "clinical data"], "Works with healthcare data, systems, privacy, reporting, and workflow improvement.", ["Data Analysis", "Database Management", "Data Privacy", "Systems Analysis", "SQL", "Communication"], ["workflow map", "privacy notes", "health data dashboard"], "Adapt Nexus privacy and data mapping ideas to a healthcare-style workflow."],
    ["public-sector-tech", "Public Sector Technology Intern", "Government", ["public sector", "government technology", "civic tech"], "Supports digital services, data systems, public-interest technology, and user-centered government workflows.", ["Systems Analysis", "Data Analysis", "Communication", "Documentation", "Accessibility", "Security"], ["civic tech case study", "requirements brief", "accessibility review"], "Write a civic-tech version of Nexus for public college career support."],
    ["transportation-data", "Transportation Data Analyst Intern", "Government", ["transportation", "traffic", "mobility data"], "Analyzes transportation data, dashboards, safety signals, and public infrastructure workflows.", ["Data Analysis", "SQL", "Data Visualization", "Python", "Systems Analysis", "Communication"], ["transportation dashboard", "data cleaning notes", "insight memo"], "Build a transportation-style analytics case study using public data."],
    ["technical-writer", "Technical Writing Intern", "Product", ["technical writer", "documentation", "developer docs"], "Explains product behavior, APIs, setup steps, user workflows, and technical decisions clearly.", ["Documentation", "Communication", "APIs", "Systems Analysis", "GitHub", "User Research"], ["developer docs", "user guide", "API reference"], "Turn the Nexus setup and API behavior into polished docs for new contributors."],
    ["developer-advocate", "Developer Advocate Intern", "Product", ["developer advocate", "community", "api"], "Creates tutorials, examples, community resources, and product education for technical users.", ["Communication", "APIs", "JavaScript", "Documentation", "Product Thinking", "GitHub"], ["tutorial", "sample app", "technical post"], "Write a tutorial showing how a student can extend Nexus with a new tracker module."],
    ["data-annotation-specialist", "AI Data Annotation Specialist", "AI", ["data annotation", "ai trainer", "annotator"], "Labels, reviews, and improves data quality for AI systems using detailed guidelines and judgment.", ["Data Annotation", "AI Model Evaluation", "Attention To Detail", "Documentation", "Communication", "Quality Assurance"], ["annotation examples", "quality rubric", "review notes"], "Create an annotation case study showing how guidelines improve AI output quality."],
    ["llm-operations", "LLM Operations Analyst", "AI", ["llm ops", "ai operations", "model operations"], "Monitors AI workflows, evaluates quality, manages feedback loops, and documents model behavior.", ["LLMs", "AI Model Evaluation", "Data Analysis", "Documentation", "Prompt Engineering", "Quality Assurance"], ["quality dashboard", "feedback loop", "evaluation report"], "Add an AI quality dashboard concept to Nexus with tracked model-output issues."],
    ["trust-safety-analyst", "Trust and Safety Analyst Intern", "AI", ["trust and safety", "safety analyst", "moderation"], "Reviews platform risks, harmful content patterns, policy enforcement, and user safety workflows.", ["Risk Analysis", "Policy", "AI Model Evaluation", "Documentation", "Communication", "Data Analysis"], ["policy analysis", "risk taxonomy", "moderation workflow"], "Build a taxonomy for unsafe AI coaching advice and prevention rules."],
    ["prompt-evaluator", "Prompt Evaluation Specialist", "AI", ["prompt evaluation", "prompt analyst", "ai evaluator"], "Tests prompts, compares outputs, tracks failure modes, and recommends better prompt patterns.", ["Prompt Engineering", "AI Model Evaluation", "Data Analysis", "Documentation", "Quality Assurance", "Communication"], ["prompt benchmark", "scorecard", "iteration log"], "Create a benchmark comparing Nexus coaching prompts across common student questions."],
    ["scrum-master", "Agile Project Coordinator Intern", "Business", ["agile", "scrum", "project coordinator"], "Supports sprint planning, task tracking, documentation, blockers, and team communication.", ["Agile", "Communication", "Documentation", "Product Thinking", "Systems Analysis", "GitHub"], ["sprint board", "status report", "release notes"], "Create a sprint board and release notes for the next Nexus improvement cycle."],
    ["operations-analyst", "Operations Analyst Intern", "Business", ["operations analyst", "process", "ops"], "Analyzes operational processes, bottlenecks, data quality, and workflow improvements.", ["Excel", "Data Analysis", "Systems Analysis", "Business Analysis", "Communication", "Documentation"], ["process map", "operations dashboard", "improvement memo"], "Analyze the application workflow from saved role to interview and identify bottlenecks."],
    ["procurement-analyst", "Procurement Analyst Intern", "Business", ["procurement", "vendor", "supply"], "Analyzes vendor data, contracts, purchasing workflows, and process improvements.", ["Excel", "Data Analysis", "Business Analysis", "Documentation", "Communication", "SQL"], ["vendor analysis", "cost summary", "process map"], "Create a vendor-style comparison of AI, hosting, and database tools for Nexus."],
    ["hr-people-analytics", "People Analytics Intern", "Business", ["people analytics", "hr analytics", "talent"], "Analyzes talent, recruiting, retention, survey, and workforce data to support people decisions.", ["Data Analysis", "Excel", "SQL", "Data Visualization", "Communication", "Research"], ["HR dashboard", "survey analysis", "talent insight"], "Build a people-analytics view for student application outcomes and career readiness."],
    ["recruiting-operations", "Recruiting Operations Intern", "Business", ["recruiting operations", "talent operations", "ats"], "Improves recruiting workflows, candidate pipelines, data quality, and operational reporting.", ["CRM", "Data Analysis", "Systems Analysis", "Excel", "Communication", "Documentation"], ["pipeline report", "ATS workflow", "data cleanup plan"], "Map Nexus as a student-side applicant tracking system and define pipeline stages."],
    ["content-strategy", "Content Strategy Intern", "Marketing", ["content strategy", "communications", "brand"], "Plans content, audience messaging, product storytelling, and performance measurement.", ["Writing", "Communication", "Marketing Analytics", "Product Thinking", "Data Analysis", "Research"], ["content calendar", "audience brief", "performance report"], "Create a launch content plan for Nexus with target audiences and success metrics."],
    ["social-media-analytics", "Social Media Analytics Intern", "Marketing", ["social media", "analytics", "content"], "Measures social performance, engagement, audience growth, and content strategy outcomes.", ["Data Analysis", "Excel", "Marketing Analytics", "Communication", "Data Visualization", "Research"], ["social dashboard", "engagement analysis", "content recommendation"], "Track LinkedIn posts about building Nexus and analyze what content performs best."],
    ["web-analytics", "Web Analytics Intern", "Marketing", ["web analytics", "seo", "traffic"], "Analyzes website traffic, funnels, conversion, SEO signals, and audience behavior.", ["Data Analysis", "Google Analytics", "SQL", "Data Visualization", "A/B Testing", "Communication"], ["traffic dashboard", "conversion funnel", "SEO recommendations"], "Define portfolio analytics for visits, project clicks, resume views, and contact clicks."],
    ["accessibility-specialist", "Accessibility Intern", "UX", ["accessibility", "a11y", "inclusive design"], "Reviews products for accessible design, keyboard support, readable UI, and inclusive workflows.", ["Accessibility", "HTML", "CSS", "User Research", "Testing", "Documentation"], ["accessibility audit", "WCAG checklist", "fix plan"], "Run an accessibility audit on Nexus navigation, forms, contrast, and keyboard behavior."],
    ["service-designer", "Service Design Intern", "UX", ["service design", "journey map", "user journey"], "Maps end-to-end user journeys, service touchpoints, pain points, and improvement opportunities.", ["User Research", "Systems Analysis", "Product Thinking", "Communication", "Documentation", "Accessibility"], ["journey map", "service blueprint", "research findings"], "Create a service blueprint from a student's first saved role to interview preparation."],
    ["design-systems", "Design Systems Intern", "UX", ["design system", "components", "ui"], "Creates reusable components, style rules, documentation, and consistent product patterns.", ["UI Design", "CSS", "Accessibility", "Documentation", "Product Thinking", "Testing"], ["component library", "style guide", "usage rules"], "Turn Nexus cards, buttons, forms, and dashboard widgets into a documented design system."]
  ].map(([id, title, cluster, matchTerms, summary, skills, proof, next]) => ({
    id,
    title,
    cluster,
    matchTerms,
    summary,
    skills,
    proof,
    next
  }))
);

const opportunityTemplates = [
  {
    company: "Campus Career Center",
    role: "Student Career Technology Assistant",
    cluster: "Product",
    deadlineOffset: 10,
    tags: ["student support", "dashboards", "workflow"],
    notes: "Position Nexus as proof that you can build student career tools."
  },
  {
    company: "Transportation Analytics Lab",
    role: "Software Quality Engineer Intern",
    cluster: "Software",
    deadlineOffset: 16,
    tags: ["testing", "analytics", "QA"],
    notes: "Emphasize manual testing, bug reports, backend endpoints, and clean documentation."
  },
  {
    company: "AI Platform Startup",
    role: "AI Data Evaluation Intern",
    cluster: "AI",
    deadlineOffset: 21,
    tags: ["LLM evaluation", "rubrics", "data quality"],
    notes: "Lead with AI Data Trainer experience and Nexus coaching/evaluation logic."
  },
  {
    company: "Cloud Operations Team",
    role: "Cloud Systems Intern",
    cluster: "Cloud",
    deadlineOffset: 28,
    tags: ["APIs", "Render", "databases"],
    notes: "Use Nexus backend deployment, health checks, CORS, SQLite, and PostgreSQL plan as proof."
  }
];

initApp();

async function initApp() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("capture") === "1") {
    document.body.classList.add("capture-shot");
    backendOnline = false;
    state = normalizeState(structuredClone(sampleWorkspace));
    updateSyncStatus("Local mode");
    render();
    switchView(params.get("view") || "dashboard");
    return;
  }

  backendOnline = await detectBackend();
  updateSyncStatus();
  if (backendOnline) {
    try {
      await refreshFromBackend();
    } catch (error) {
      backendOnline = false;
      updateSyncStatus("API unavailable - local mode");
      console.warn("Backend refresh failed; continuing locally.", error);
    }
  }
  if (params.get("view") && document.querySelector(`#${params.get("view")}View`)) {
    currentView = params.get("view");
  } else if (isWorkspaceEmpty(state)) {
    currentView = "onboarding";
  }
  render();
  switchView(currentView);
}

function getApiBase() {
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get("api") || localStorage.getItem("nexus-ai-api-base");
  if (explicit) return explicit.replace(/\/$/, "");
  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) return "http://127.0.0.1:8000";
  if (window.location.hostname === "jasonbinong.github.io") return PRODUCTION_API_BASE;
  return "";
}

async function detectBackend() {
  if (!API_BASE) return false;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`${API_BASE}/health`, { cache: "no-store", signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
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
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      signal: controller.signal,
      ...options
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || `Request failed: ${response.status}`);
    }
    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Backend request timed out. Your local workspace is still safe.");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
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
      displayName: snapshot.profile?.display_name || "",
      email: snapshot.profile?.email || "",
      targetRole: snapshot.profile?.target_role || "",
      major: snapshot.profile?.major || "",
      graduation: snapshot.profile?.graduation || "",
      weeklyHours: snapshot.profile?.weekly_hours || 0
    },
    account: state?.account || structuredClone(starterState.account),
    applications: snapshot.applications || [],
    opportunities: state?.opportunities || [],
    savedRoles: state?.savedRoles || [],
    jobAnalyses: state?.jobAnalyses || [],
    chat: state?.chat || [],
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
  next.account = { ...starterState.account, ...(raw.account || {}) };
  next.onboarding = { ...starterState.onboarding, ...(raw.onboarding || {}) };
  next.resume = typeof raw.resume === "string" ? raw.resume : starterState.resume;
  next.activity = Array.isArray(raw.activity) ? raw.activity.slice(0, 50) : [];
  next.savedRoles = Array.isArray(raw.savedRoles) ? raw.savedRoles : [];
  next.jobAnalyses = Array.isArray(raw.jobAnalyses) ? raw.jobAnalyses : [];
  next.chat = Array.isArray(raw.chat) ? raw.chat.slice(-20) : [];

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
    if (backendOnline && collection !== "opportunities") {
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
    displayName: els.profileForm.displayName.value.trim(),
    email: els.profileForm.email.value.trim(),
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
          display_name: profile.displayName,
          email: profile.email,
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

function saveAccount(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.account = {
    workspaceName: data.get("workspaceName").trim(),
    email: data.get("email").trim(),
    mode: data.get("mode") || "Private",
    lastSaved: new Date().toISOString()
  };
  if (!state.profile.email) state.profile.email = state.account.email;
  if (!state.profile.displayName && state.account.workspaceName) {
    state.profile.displayName = state.account.workspaceName.replace(/\s+career\s+workspace$/i, "").trim();
  }
  addActivity(`Updated workspace account: ${state.account.workspaceName}`);
  saveState();
  render();
}

async function saveOnboarding(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const profile = {
    displayName: state.profile.displayName || "",
    email: state.profile.email || "",
    targetRole: data.get("targetRole").trim(),
    major: data.get("major").trim(),
    graduation: data.get("graduation").trim(),
    weeklyHours: Number(data.get("weeklyHours") || 0)
  };
  state.profile = profile;
  state.onboarding = { primaryGoal: data.get("primaryGoal") || "Land an internship" };
  addActivity(`Completed onboarding for ${profile.targetRole}`);

  try {
    if (backendOnline) {
      await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({
          display_name: profile.displayName,
          email: profile.email,
          target_role: profile.targetRole,
          major: profile.major,
          graduation: profile.graduation,
          weekly_hours: profile.weeklyHours
        })
      });
      await refreshFromBackend();
      state.onboarding = { primaryGoal: data.get("primaryGoal") || "Land an internship" };
    }
    saveState();
    currentView = "dashboard";
    switchView("dashboard");
    render();
  } catch (error) {
    showError(error);
  }
}

function getOnboardingChecklist() {
  return [
    {
      title: "Save a target role",
      body: "This lets Nexus judge your skills, projects, and weekly priorities against a specific direction.",
      time: "2 min",
      done: Boolean(state.profile.targetRole)
    },
    {
      title: "Add three active applications",
      body: "A pipeline gives the dashboard enough signal to prioritize deadlines and follow-ups.",
      time: "15 min",
      done: state.applications.filter(app => !["Rejected", "Offer"].includes(app.status)).length >= 3
    },
    {
      title: "Save career opportunities",
      body: "Track internships, fellowships, hackathons, scholarships, and programs before promoting the best ones to applications.",
      time: "10 min",
      done: state.opportunities.length >= 3
    },
    {
      title: "Add two public projects",
      body: "Recruiters need proof. Link GitHub, live sites, screenshots, and a result statement.",
      time: "20 min",
      done: state.projects.filter(project => project.link).length >= 2
    },
    {
      title: "Track five proof-backed skills",
      body: "Every skill should point to a project, certification, course, or work example.",
      time: "15 min",
      done: state.skills.filter(skill => skill.evidence).length >= 5
    },
    {
      title: "Write resume notes",
      body: "Use the resume vault to draft bullets before polishing your official PDF.",
      time: "20 min",
      done: state.resume.trim().length > 80
    }
  ];
}

function caseStudyCard(title, body) {
  return `
    <div class="coach-card">
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(body)}</p>
    </div>
  `;
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
    if (backendOnline && collection !== "opportunities") {
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
    if (backendOnline && collection !== "opportunities") {
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

async function importResumePdf(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.type !== "application/pdf") {
    updateResumeUploadStatus("Use a PDF file");
    return;
  }
  updateResumeUploadStatus("Reading PDF...");
  try {
    const text = await extractPdfText(file);
    if (!text.trim()) {
      updateResumeUploadStatus("No text found");
      els.resumeCoach.innerHTML = `
        <div class="alert-card warning">
          <strong>PDF text could not be extracted</strong>
          <span>This may be a scanned/image resume. Paste the resume text into the vault or export a text-based PDF.</span>
        </div>
      `;
      return;
    }
    state.resume = cleanExtractedResumeText(text);
    latestResumePageImages = await renderPdfPages(file);
    els.resumeDraft.value = state.resume;
    addActivity(`Imported resume PDF: ${file.name}`);
    saveState();
    await reviewResumeNow();
    updateResumeUploadStatus(`Imported ${file.name} with ${latestResumePageImages.length} page image${latestResumePageImages.length === 1 ? "" : "s"}`);
  } catch (error) {
    console.error(error);
    updateResumeUploadStatus("PDF import failed");
    els.resumeCoach.innerHTML = `
      <div class="alert-card danger">
        <strong>Resume import failed</strong>
        <span>PDF parsing is unavailable right now. Paste the text into the vault and run the review.</span>
      </div>
    `;
  } finally {
    event.target.value = "";
  }
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) throw new Error("PDF.js is not loaded");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(" "));
  }
  return pages.join("\n");
}

async function renderPdfPages(file) {
  if (!window.pdfjsLib) throw new Error("PDF.js is not loaded");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  const rendered = [];
  const maxPages = Math.min(pdf.numPages, 2);
  for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const targetWidth = 1400;
    const scale = targetWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    canvas.width = Math.floor(scaledViewport.width);
    canvas.height = Math.floor(scaledViewport.height);
    await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
    rendered.push(canvas.toDataURL("image/jpeg", 0.86));
  }
  return rendered;
}

function cleanExtractedResumeText(text) {
  return String(text || "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function updateResumeUploadStatus(message) {
  if (els.resumeUploadStatus) els.resumeUploadStatus.textContent = message;
}

async function reviewResumeNow() {
  state.resume = els.resumeDraft.value.trim();
  addActivity("Ran resume review");
  saveState();
  els.reviewResumeButton.disabled = true;
  els.reviewResumeButton.textContent = "Reviewing...";
  els.resumeCoach.innerHTML = emptyState("Reviewing resume...");
  try {
    const payload = {
      tool: "resume_review",
      extra_context: "Review this uploaded resume honestly but fairly for AI, data, software, and information systems internship applications. Do not use a harsh formula score; give calibrated recruiter-style feedback.",
      application: null,
      snapshot: buildAiSnapshot({ includeResumeImages: true })
    };
    const result = backendOnline
      ? await apiRequest("/ai/coach", {
          method: "POST",
          body: JSON.stringify(payload)
        })
      : generateLocalAiResponse(payload);
    renderResumeAiResult(result);
  } catch (error) {
    const fallback = generateLocalAiResponse({
      tool: "resume_review",
      extra_context: "",
      application: null,
      snapshot: buildAiSnapshot({ includeResumeImages: true })
    });
    fallback.note = error.message;
    renderResumeAiResult(fallback);
  } finally {
    els.reviewResumeButton.disabled = false;
    els.reviewResumeButton.textContent = "Review Resume";
  }
}

function renderResumeAiResult(result) {
  const sections = Array.isArray(result.sections) ? result.sections : [];
  els.resumeCoach.innerHTML = sections.map(section => `
    <div class="coach-card">
      <h4>${escapeHtml(section.title)}</h4>
      <p>${escapeHtml(section.body)}</p>
    </div>
  `).join("") || emptyState("No review returned. Paste resume text and try again.");
  if (result.provider || result.note) {
    els.resumeCoach.innerHTML += `
      <div class="empty-state">
        ${escapeHtml([result.provider, result.note].filter(Boolean).join(" | "))}
      </div>
    `;
  }
}

async function clearWorkspace() {
  const confirmed = window.confirm("Start a new blank workspace? This clears the current browser data after exporting is recommended.");
  if (!confirmed) return;

  try {
    if (backendOnline) {
      await apiRequest("/workspace/reset", { method: "DELETE" });
      await refreshFromBackend();
      state.account = structuredClone(starterState.account);
      state.opportunities = [];
      state.savedRoles = [];
      state.jobAnalyses = [];
      state.chat = [];
      saveState();
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
  renderExplore();
  renderJobBoard();
  renderOpportunities();
  renderApplications();
  renderCertifications();
  renderProjects();
  renderSkills();
  renderNetworking();
  renderInterviews();
  renderGoals();
  renderResume();
  renderAiTools();
  renderProfileView();
  renderAccount();
  renderOnboarding();
  renderCaseStudy();
}

function renderProfile() {
  populateTargetRoleOptions();
  els.profileForm.displayName.value = state.profile.displayName || "";
  els.profileForm.email.value = state.profile.email || "";
  els.profileForm.targetRole.value = state.profile.targetRole || "";
  els.profileForm.major.value = state.profile.major || "";
  els.profileForm.graduation.value = state.profile.graduation || "";
  els.profileForm.weeklyHours.value = state.profile.weeklyHours || "";
}

function renderOnboarding() {
  if (!els.onboardingForm) return;
  populateTargetRoleOptions();
  const targetRole = state.profile.targetRole || "";
  if (targetRole && ![...els.onboardingForm.targetRole.options].some(option => option.value === targetRole)) {
    els.onboardingForm.targetRole.add(new Option(targetRole, targetRole));
  }
  els.onboardingForm.targetRole.value = targetRole;
  els.onboardingForm.major.value = state.profile.major || "";
  els.onboardingForm.graduation.value = state.profile.graduation || "";
  els.onboardingForm.weeklyHours.value = state.profile.weeklyHours || "";
  els.onboardingForm.primaryGoal.value = state.onboarding.primaryGoal || "Land an internship";

  const items = getOnboardingChecklist();
  const completed = items.filter(item => item.done).length;
  els.onboardingProgress.textContent = `${Math.round((completed / items.length) * 100)}% complete`;
  els.onboardingChecklist.innerHTML = items.map(item => `
    <div class="action-card ${item.done ? "is-done" : ""}">
      <div class="action-card-top">
        <span>${item.done ? "Complete" : "Next"}</span>
        <strong>${escapeHtml(item.time)}</strong>
      </div>
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.body)}</p>
    </div>
  `).join("");
}

function renderCaseStudy() {
  if (!els.caseStudyScore) return;
  const score = calculateCareerScore();
  els.caseStudyScore.textContent = score;
  els.caseStudyScore.closest(".score-ring").style.setProperty("--score", score);
  els.caseStudyProblem.innerHTML = [
    ["Fragmented career prep", "Students manage applications, projects, networking, certifications, and resume notes in separate places, so progress is hard to measure."],
    ["Weak feedback loops", "A student may be busy without knowing whether their work improves internship readiness."],
    ["Proof is scattered", "Recruiters need visible project links, outcomes, and skills, but students often do not connect those pieces clearly."]
  ].map(([title, body]) => caseStudyCard(title, body)).join("");

  els.caseStudySystem.innerHTML = [
    ["Frontend", "Static GitHub Pages dashboard with local fallback and production API detection"],
    ["Backend", "FastAPI service on Render with workspace import, CRUD endpoints, readiness analytics, and health checks"],
    ["Data model", "Profile, applications, certifications, projects, skills, networking, interviews, goals, resume notes, and activity"],
    ["Intelligence layer", "Rule-based coaching, skill-gap analysis, weekly planning, deadline tracking, and resume scoring"]
  ].map(([name, fields]) => `
    <div class="schema-row">
      <strong>${escapeHtml(name)}</strong>
      <span>${escapeHtml(fields)}</span>
    </div>
  `).join("");

  els.caseStudyEvidence.innerHTML = generateAnalytics().map(item => `
    <div class="analytics-item">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </div>
  `).join("");

  els.caseStudyRoadmap.innerHTML = [
    actionItem("Add authentication", "Use Clerk or Firebase so each student owns a private workspace.", "Phase 1", "Next"),
    actionItem("Move storage to PostgreSQL", "Use persistent relational storage for real users, reporting, and cohort analytics.", "Phase 1", "Next"),
    actionItem("Add true AI feedback", "Connect resume review, interview practice, and roadmap generation to an LLM API.", "Phase 2", "Later"),
    actionItem("Pilot with UMBC students", "Collect feedback from classmates and career advisors before scaling.", "Phase 3", "Later")
  ].map((item, index) => `
    <div class="action-card priority-${index + 1}">
      <div class="action-card-top">
        <span>${escapeHtml(item.due)}</span>
        <strong>${escapeHtml(item.time)}</strong>
      </div>
      <h4>${escapeHtml(item.action)}</h4>
      <p>${escapeHtml(item.reason)}</p>
    </div>
  `).join("");
}

function populateTargetRoleOptions() {
  if (els.roleOptions) {
    els.roleOptions.innerHTML = [...careerPaths]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(path => `<option value="${escapeAttribute(path.title)}"></option>`)
      .join("");
  }
  if (!els.onboardingForm?.targetRole) return;
  const current = els.onboardingForm.targetRole.value || state.profile.targetRole || "";
  const grouped = [...careerPaths]
    .sort((a, b) => a.cluster.localeCompare(b.cluster) || a.title.localeCompare(b.title))
    .reduce((groups, path) => {
      if (!groups.has(path.cluster)) groups.set(path.cluster, []);
      groups.get(path.cluster).push(path);
      return groups;
    }, new Map());

  els.onboardingForm.targetRole.innerHTML = `<option value="">Select a target role</option>`;
  grouped.forEach((paths, cluster) => {
    const group = document.createElement("optgroup");
    group.label = cluster;
    paths.forEach(path => group.append(new Option(path.title, path.title)));
    els.onboardingForm.targetRole.append(group);
  });

  if (current && ![...els.onboardingForm.targetRole.options].some(option => option.value === current)) {
    els.onboardingForm.targetRole.add(new Option(current, current));
  }
  els.onboardingForm.targetRole.value = current;
}

function populateRoleClusterOptions() {
  if (!els.roleClusterFilter) return;
  const current = els.roleClusterFilter.value || "all";
  const clusters = [...new Set(careerPaths.map(path => path.cluster))].sort((a, b) => a.localeCompare(b));
  els.roleClusterFilter.innerHTML = [
    `<option value="all">All clusters</option>`,
    ...clusters.map(cluster => `<option value="${escapeAttribute(cluster)}">${escapeHtml(cluster)}</option>`)
  ].join("");
  els.roleClusterFilter.value = clusters.includes(current) ? current : "all";
}

function populateJobBoardClusterOptions() {
  if (!els.jobBoardCluster) return;
  const current = els.jobBoardCluster.value || "all";
  const clusters = [...new Set(careerPaths.map(path => path.cluster))].sort((a, b) => a.localeCompare(b));
  els.jobBoardCluster.innerHTML = [
    `<option value="all">All clusters</option>`,
    ...clusters.map(cluster => `<option value="${escapeAttribute(cluster)}">${escapeHtml(cluster)}</option>`)
  ].join("");
  els.jobBoardCluster.value = clusters.includes(current) ? current : "all";
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

  els.weeklyPlan.innerHTML = renderWeeklyPlan();
  els.priorityAlerts.innerHTML = generatePriorityAlerts().map(alert => `
    <div class="alert-card ${alert.tone}">
      <strong>${escapeHtml(alert.title)}</strong>
      <span>${escapeHtml(alert.body)}</span>
    </div>
  `).join("") || emptyState("No urgent issues. Keep adding proof and follow-ups.");
  els.recentActivity.innerHTML = state.activity.slice(0, 6).map(item => `
    <div class="activity-item">
      <strong>${escapeHtml(item.message)}</strong>
      <span>${formatActivityTime(item.at)}</span>
    </div>
  `).join("") || emptyState("No activity yet. Add your first application, project, skill, or goal.");
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
  els.readinessTimeline.innerHTML = renderReadinessTimeline();
}

function renderExplore() {
  if (!els.roleExplorer) return;
  populateRoleClusterOptions();
  const query = els.roleSearch.value.trim().toLowerCase();
  const cluster = els.roleClusterFilter.value;
  const filteredPaths = careerPaths
    .map(path => ({ ...path, fit: calculatePathFit(path) }))
    .filter(path => {
      const searchable = `${path.title} ${path.cluster} ${path.summary} ${path.skills.join(" ")}`.toLowerCase();
      return (!query || searchable.includes(query)) && (cluster === "all" || path.cluster === cluster);
    })
    .sort((a, b) => b.fit.score - a.fit.score);

  els.roleExplorer.innerHTML = filteredPaths.map(path => `
    <article class="role-card">
      <div class="role-card-top">
        <span class="cluster-pill">${escapeHtml(path.cluster)}</span>
        <strong>${path.fit.score}% fit</strong>
      </div>
      <h3>${escapeHtml(path.title)}</h3>
      <p>${escapeHtml(path.summary)}</p>
      <div class="mini-skill-list">
        ${path.skills.slice(0, 6).map(skill => `<span class="${path.fit.matched.includes(skill) ? "matched" : ""}">${escapeHtml(skill)}</span>`).join("")}
      </div>
      <div class="role-proof">
        <strong>Proof recruiters expect</strong>
        <p>${escapeHtml(path.proof.join(" | "))}</p>
      </div>
      <div class="button-row">
        <button class="primary-button" type="button" onclick="selectCareerPath('${path.id}')">Use Path</button>
        <button class="secondary-button" type="button" onclick="saveRoleFromPath('${path.id}')">Save Role</button>
      </div>
    </article>
  `).join("") || emptyState("No paths match that search.");

  currentRecommendations = getRecommendedOpportunities(filteredPaths);
  const opportunityCards = currentRecommendations.map((item, index) => `
    <div class="opportunity-card">
      <div class="role-card-top">
        <span class="cluster-pill">${escapeHtml(item.cluster)}</span>
        <strong>${item.fit}% fit</strong>
      </div>
      <h4>${escapeHtml(item.role)}</h4>
      <p>${escapeHtml(item.company)} | Due ${formatDate(item.deadline)}</p>
      <div class="mini-skill-list">
        ${item.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
      <p>${escapeHtml(item.notes)}</p>
      <button class="primary-button full-width" type="button" onclick="saveOpportunity(${index})">Save To Pipeline</button>
    </div>
  `).join("");
  els.opportunityList.innerHTML = opportunityCards || emptyState("Save a target role or add skills to unlock recommendations.");

  const bestPath = filteredPaths[0] || careerPaths.map(path => ({ ...path, fit: calculatePathFit(path) })).sort((a, b) => b.fit.score - a.fit.score)[0];
  els.pathBuilder.innerHTML = bestPath ? [
    actionItem(`Aim at ${bestPath.title}`, `Best current fit based on your profile and proof: ${bestPath.fit.score}%.`, "Now", "Path"),
    actionItem("Close the first missing skill", bestPath.fit.missing[0] ? getSkillGapAction(bestPath.fit.missing[0]) : "Your tracked skills match this path well. Add stronger evidence for the skills you already have.", "60 min", "This week"),
    actionItem("Add recruiter proof", bestPath.next, "90 min", "This week"),
    actionItem("Save one matched opportunity", "Move from browsing to pipeline by saving one role with a deadline and next action.", "10 min", "Today")
  ].map((item, index) => `
    <div class="action-card priority-${index + 1}">
      <div class="action-card-top">
        <span>${escapeHtml(item.due)}</span>
        <strong>${escapeHtml(item.time)}</strong>
      </div>
      <h4>${escapeHtml(item.action)}</h4>
      <p>${escapeHtml(item.reason)}</p>
    </div>
  `).join("") : emptyState("Add a target role to generate a path.");
}

function calculatePathFit(path) {
  const skillNames = new Set(state.skills.map(skill => normalizeSkill(skill.name)));
  const evidenceText = [
    state.profile.targetRole,
    state.profile.major,
    state.resume,
    ...state.projects.map(project => `${project.name} ${project.stack} ${project.impact}`),
    ...state.certifications.map(cert => `${cert.name} ${cert.provider}`)
  ].join(" ").toLowerCase();
  const matched = path.skills.filter(skill => skillNames.has(normalizeSkill(skill)) || evidenceText.includes(skill.toLowerCase()));
  const targetBoost = path.matchTerms.some(term => String(state.profile.targetRole || "").toLowerCase().includes(term)) ? 18 : 0;
  const proofBoost = Math.min(state.projects.filter(project => project.link).length * 4, 12);
  const pipelineBoost = Math.min(state.applications.length * 2, 8);
  const score = Math.min(99, Math.round((matched.length / path.skills.length) * 62 + targetBoost + proofBoost + pipelineBoost));
  return { score, matched, missing: path.skills.filter(skill => !matched.includes(skill)) };
}

function getRecommendedOpportunities(paths) {
  const topClusters = new Set(paths.slice(0, 3).map(path => path.cluster));
  const today = new Date();
  return opportunityTemplates
    .filter(item => !topClusters.size || topClusters.has(item.cluster))
    .map(item => {
      const path = paths.find(candidate => candidate.cluster === item.cluster) || careerPaths.find(candidate => candidate.cluster === item.cluster);
      const deadline = new Date(today);
      deadline.setDate(today.getDate() + item.deadlineOffset);
      return {
        ...item,
        deadline: deadline.toISOString().slice(0, 10),
        fit: path ? calculatePathFit(path).score : calculateSkillFit().coverage
      };
    })
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 4);
}

function getExpandedJobBoard() {
  const today = new Date();
  return careerPaths.map((path, index) => {
    const deadline = new Date(today);
    deadline.setDate(today.getDate() + 7 + (index % 8) * 4);
    const companies = {
      AI: ["AI Platform Startup", "Handshake AI", "Responsible AI Lab", "Voice AI Studio"],
      Data: ["Civic Data Lab", "Campus Analytics Team", "Commerce Insights Group", "Transportation Analytics Lab"],
      Software: ["Product Engineering Team", "UMD CATT Lab", "Developer Tools Startup", "Student Success Platform"],
      Cloud: ["Cloud Operations Team", "Infrastructure Lab", "Enterprise Systems Group", "Campus IT Cloud"],
      Cybersecurity: ["Security Operations Center", "Cloud Security Team", "AI Governance Lab", "Risk Analytics Group"],
      Product: ["Student Product Studio", "Career Tech Startup", "Learning Platform Team", "Campus Innovation Lab"],
      UX: ["Human-Centered AI Lab", "Student Experience Team", "Product Design Studio", "Accessibility Research Group"],
      Business: ["Operations Analytics Team", "CRM Systems Group", "Strategy and Insights Lab", "Business Systems Office"],
      IT: ["Campus IT Services", "Technology Support Center", "Systems Operations Team", "Enterprise Support Desk"]
    };
    const companyList = companies[path.cluster] || companies.Software;
    return {
      id: `board-${path.id}`,
      company: companyList[index % companyList.length],
      role: path.title,
      cluster: path.cluster,
      deadline: deadline.toISOString().slice(0, 10),
      fit: calculatePathFit(path).score,
      skills: path.skills.slice(0, 4),
      notes: path.next
    };
  });
}

function renderJobBoard() {
  if (!els.jobBoardList) return;
  populateJobBoardClusterOptions();
  const query = els.jobBoardSearch.value.trim().toLowerCase();
  const cluster = els.jobBoardCluster.value;
  const jobs = getExpandedJobBoard()
    .filter(job => {
      const searchable = `${job.company} ${job.role} ${job.cluster} ${job.skills.join(" ")}`.toLowerCase();
      return (!query || searchable.includes(query)) && (cluster === "all" || job.cluster === cluster);
    })
    .sort((a, b) => b.fit - a.fit);

  els.jobBoardList.innerHTML = jobs.map(job => `
    <article class="job-card">
      <div class="role-card-top">
        <span class="cluster-pill">${escapeHtml(job.cluster)}</span>
        <strong>${job.fit}% fit</strong>
      </div>
      <h3>${escapeHtml(job.role)}</h3>
      <p>${escapeHtml(job.company)} | Due ${formatDate(job.deadline)}</p>
      <div class="mini-skill-list">
        ${job.skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join("")}
      </div>
      <p>${escapeHtml(job.notes)}</p>
      <button class="primary-button full-width" type="button" onclick="saveJobBoardApplication('${job.id}')">Save To Pipeline</button>
    </article>
  `).join("") || emptyState("No jobs match this search.");
}

function saveJobBoardApplication(jobId) {
  const job = getExpandedJobBoard().find(item => item.id === jobId);
  if (!job) return;
  const exists = state.applications.some(app => normalizeSkill(`${app.company}${app.role}`) === normalizeSkill(`${job.company}${job.role}`));
  if (!exists) {
    state.applications.push({
      id: createId(),
      company: job.company,
      role: job.role,
      status: "Saved",
      deadline: job.deadline,
      link: "",
      notes: job.notes
    });
    selectedApplicationId = state.applications[state.applications.length - 1].id;
    addActivity(`Saved job board role: ${job.company} ${job.role}`);
    saveState();
  }
  render();
  switchView("applications");
}

function renderOpportunities() {
  if (!els.opportunitiesList) return;
  const type = els.opportunityTypeFilter?.value || "all";
  const opportunities = state.opportunities
    .filter(item => type === "all" || item.type === type)
    .sort((a, b) => String(a.deadline || "").localeCompare(String(b.deadline || "")));
  const active = state.opportunities.filter(item => daysUntil(item.deadline) >= 0);
  els.opportunityStats.textContent = `${active.length} active`;
  els.opportunitiesList.innerHTML = opportunities.map(item => {
    const days = daysUntil(item.deadline);
    const urgency = days < 0 ? "Closed" : days <= 7 ? "Due soon" : `${days} days left`;
    return `
      <div class="data-card">
        <div class="role-card-top">
          <span class="cluster-pill">${escapeHtml(item.type)}</span>
          <strong>${escapeHtml(urgency)}</strong>
        </div>
        <h4>${escapeHtml(item.name)}</h4>
        <p>${escapeHtml(item.organization)} | ${formatDate(item.deadline)}</p>
        <p>${escapeHtml(item.notes || "Add why this opportunity matters and the next action.")}</p>
        <div class="button-row">
          ${item.link ? `<a class="secondary-button" href="${escapeAttribute(item.link)}" target="_blank" rel="noreferrer">Open</a>` : ""}
          <button class="primary-button" type="button" onclick="promoteOpportunity('${item.id}')">Move To Applications</button>
          <button class="delete-button" type="button" onclick="deleteLocalOpportunity('${item.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join("") || emptyState("No opportunities saved yet. Add internships, fellowships, hackathons, scholarships, or career programs.");

  els.opportunityStrategy.innerHTML = generateOpportunityStrategy().map(card => `
    <div class="coach-card">
      <h4>${escapeHtml(card.title)}</h4>
      <p>${escapeHtml(card.body)}</p>
    </div>
  `).join("");
}

function promoteOpportunity(id) {
  const item = state.opportunities.find(opportunity => opportunity.id === id);
  if (!item) return;
  const exists = state.applications.some(app => normalizeSkill(`${app.company}${app.role}`) === normalizeSkill(`${item.organization}${item.name}`));
  if (!exists) {
    state.applications.push({
      id: createId(),
      company: item.organization,
      role: item.name,
      status: "Saved",
      deadline: item.deadline,
      link: item.link || "",
      notes: item.notes || `Promoted from ${item.type} opportunity tracker.`
    });
    selectedApplicationId = state.applications[state.applications.length - 1].id;
    addActivity(`Moved opportunity to applications: ${item.name}`);
  }
  saveState();
  render();
  switchView("applications");
}

function deleteLocalOpportunity(id) {
  state.opportunities = state.opportunities.filter(item => item.id !== id);
  addActivity("Deleted saved opportunity");
  saveState();
  render();
}

function generateOpportunityStrategy() {
  const active = state.opportunities.filter(item => daysUntil(item.deadline) >= 0);
  const urgent = active.filter(item => daysUntil(item.deadline) <= 7).sort((a, b) => a.deadline.localeCompare(b.deadline));
  const fellowships = active.filter(item => item.type === "Fellowship");
  const apps = state.applications.filter(item => !["Rejected", "Offer"].includes(item.status));
  return [
    {
      title: "Top priority",
      body: urgent[0]
        ? `${urgent[0].name} is due ${formatDate(urgent[0].deadline)}. Decide today whether to apply, archive, or move it to applications.`
        : active[0]
        ? `${active[0].name} is the next opportunity by deadline. Add a concrete next step before it becomes urgent.`
        : "Add 3-5 opportunities so Nexus can help you choose what deserves application time."
    },
    {
      title: "Pipeline balance",
      body: apps.length < 6
        ? "Your application pipeline can use more volume. Promote the best saved opportunities into applications with deadlines."
        : "Your application pipeline has useful volume. Prioritize follow-ups and interview preparation over saving more roles."
    },
    {
      title: "Fellowship angle",
      body: fellowships.length
        ? `${fellowships.length} fellowship${fellowships.length === 1 ? "" : "s"} tracked. Use Nexus, CareerLens, and LearnWise as proof of independent building.`
        : "Add fellowships separately from internships because they often reward project story, initiative, and mission fit."
    },
    {
      title: "Weekly rule",
      body: "Every week, save five opportunities, promote two to applications, tailor one resume version, and send two networking messages."
    }
  ];
}

function selectCareerPath(pathId) {
  const path = careerPaths.find(item => item.id === pathId);
  if (!path) return;
  state.profile.targetRole = path.title;
  state.onboarding.primaryGoal = state.onboarding.primaryGoal || "Land an internship";
  addActivity(`Selected career path: ${path.title}`);
  saveState();
  render();
  switchView("dashboard");
}

function saveRoleFromPath(pathId) {
  const path = careerPaths.find(item => item.id === pathId);
  if (!path) return;
  const alreadySaved = state.savedRoles.some(item => item.id === path.id);
  if (!alreadySaved) {
    state.savedRoles.push({ id: path.id, title: path.title, cluster: path.cluster, savedAt: new Date().toISOString() });
  }
  state.profile.targetRole = state.profile.targetRole || path.title;
  addActivity(`Saved role path: ${path.title}`);
  saveState();
  render();
}

function saveOpportunity(index) {
  const item = currentRecommendations[index];
  if (!item) return;
  const exists = state.applications.some(app => normalizeSkill(`${app.company}${app.role}`) === normalizeSkill(`${item.company}${item.role}`));
  if (!exists) {
    state.applications.push({
      id: createId(),
      company: item.company,
      role: item.role,
      status: "Saved",
      deadline: item.deadline,
      link: "",
      notes: item.notes
    });
    addActivity(`Saved opportunity to pipeline: ${item.company} ${item.role}`);
    saveState();
  }
  render();
  switchView("applications");
}

function generatePriorityAlerts() {
  const alerts = [];
  const overdue = getAllDeadlines().filter(item => daysUntil(item.date) < 0);
  const nextThree = getAllDeadlines().filter(item => {
    const days = daysUntil(item.date);
    return days >= 0 && days <= 3;
  });
  const activeApps = state.applications.filter(app => !["Rejected", "Offer"].includes(app.status));
  const activeOpportunities = state.opportunities.filter(item => daysUntil(item.deadline) >= 0);
  const fit = calculateSkillFit();
  const projectsWithoutLinks = state.projects.filter(project => !project.link);

  if (!state.profile.targetRole) {
    alerts.push({ tone: "danger", title: "Choose a target role", body: "Nexus needs a role before it can judge skills, projects, and next moves." });
  }
  if (overdue.length) {
    alerts.push({ tone: "danger", title: `${overdue.length} overdue item${overdue.length === 1 ? "" : "s"}`, body: "Update dates or resolve old tasks so the dashboard stays trustworthy." });
  }
  if (nextThree.length) {
    alerts.push({ tone: "warning", title: "Deadline window", body: `${nextThree[0].title} is due ${formatDate(nextThree[0].date)}.` });
  }
  if (activeApps.length < 3) {
    alerts.push({ tone: "warning", title: "Pipeline too thin", body: "Add at least three active roles so the weekly plan has enough opportunity data." });
  }
  if (fit.gaps.length) {
    alerts.push({ tone: "warning", title: `Skill proof gap: ${fit.gaps[0].name}`, body: fit.gaps[0].action });
  }
  if (projectsWithoutLinks.length) {
    alerts.push({ tone: "info", title: "Project proof missing", body: `${projectsWithoutLinks.length} project${projectsWithoutLinks.length === 1 ? "" : "s"} need a GitHub, live site, or project link.` });
  }
  return alerts.slice(0, 5);
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
  if (!selectedApplicationId && state.applications[0]) selectedApplicationId = state.applications[0].id;
  renderApplicationDetail();
}

function renderApplicationDetail() {
  if (!els.applicationDetail) return;
  const selected = state.applications.find(item => item.id === selectedApplicationId) || state.applications[0];
  if (!selected) {
    els.applicationDetailLabel.textContent = "Select a role";
    els.applicationDetail.innerHTML = emptyState("Save or add an application to see resume match, follow-up plan, and interview prep.");
    return;
  }
  selectedApplicationId = selected.id;
  const match = scoreResumeAgainstText(`${selected.company} ${selected.role} ${selected.notes}`);
  const plan = [
    ["Tailor resume", `Add keywords: ${match.missing.slice(0, 4).join(", ") || "your resume already covers the strongest terms"}.`],
    ["Prepare proof", strongestProjectLine()],
    ["Follow up", selected.status === "Applied" || selected.status === "Follow-up needed" ? "Send a concise follow-up with portfolio link and one role-specific proof point." : "Set a follow-up date after applying."],
    ["Interview prep", `Practice explaining how Nexus relates to ${selected.role}.`]
  ];
  els.applicationDetailLabel.textContent = `${selected.company} - ${selected.role}`;
  els.applicationDetail.innerHTML = `
    <div class="match-card">
      <strong>${match.score}% resume-role match</strong>
      <div class="progress-track"><div class="progress-fill" style="width:${match.score}%"></div></div>
      <p>${escapeHtml(match.summary)}</p>
    </div>
    <div class="detail-actions">
      ${plan.map(([title, body]) => `
        <div class="coach-card">
          <h4>${escapeHtml(title)}</h4>
          <p>${escapeHtml(body)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function selectApplicationDetail(id) {
  selectedApplicationId = id;
  renderApplications();
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
  renderResumeReview();
  if (!els.bulletOutput.innerHTML.trim()) {
    els.bulletOutput.innerHTML = emptyState("Build a resume bullet from a project, tool, and result.");
  }
}

function renderResumeReview() {
  if (!els.resumeCoach) return;
  els.resumeCoach.innerHTML = generateResumeCoach().map(card => `
    <div class="coach-card">
      <h4>${escapeHtml(card.title)}</h4>
      <p>${escapeHtml(card.body)}</p>
    </div>
  `).join("");
}

function renderAiTools() {
  if (!els.aiApplicationSelect) return;
  const options = [
    `<option value="">Use overall workspace</option>`,
    ...state.applications.map(item => `<option value="${escapeAttribute(item.id)}">${escapeHtml(item.company)} - ${escapeHtml(item.role)}</option>`)
  ];
  const current = els.aiApplicationSelect.value;
  els.aiApplicationSelect.innerHTML = options.join("");
  if ([...els.aiApplicationSelect.options].some(option => option.value === current)) {
    els.aiApplicationSelect.value = current;
  }
  if (!els.aiOutput.innerHTML.trim()) {
    els.aiOutput.innerHTML = emptyState("Choose a tool and run it to generate career guidance.");
  }
  renderChatThread();
  if (!els.jobAnalysisOutput.innerHTML.trim()) {
    els.jobAnalysisOutput.innerHTML = emptyState("Import a real posting, then save the analyzed role to your application pipeline.");
  }
}

function buildResumeBullet(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const action = cleanSentencePart(data.action);
  const tool = cleanSentencePart(data.tool);
  const project = cleanSentencePart(data.project);
  const result = cleanSentencePart(data.result);
  const bullet = `- ${action} ${project} using ${tool} to ${result}.`;
  latestGeneratedBullet = bullet;
  els.bulletOutput.innerHTML = `
    <div class="coach-card">
      <h4>Generated bullet</h4>
      <p>${escapeHtml(bullet)}</p>
    </div>
    <div class="button-row">
      <button class="secondary-button" type="button" data-add-bullet>Add To Resume Notes</button>
    </div>
  `;
  event.currentTarget.reset();
}

function appendBulletToResume() {
  const bullet = latestGeneratedBullet;
  if (!bullet) return;
  state.resume = `${state.resume.trim()}${state.resume.trim() ? "\n" : ""}${bullet}`.trim();
  addActivity("Added generated resume bullet");
  saveState();
  render();
}

function cleanSentencePart(value) {
  return String(value || "").trim().replace(/[.]+$/, "");
}

function analyzeJobDescription() {
  const source = els.jobSourceSelect?.value || "Other";
  const url = els.jobUrlInput?.value.trim() || "";
  const companyInput = els.jobCompanyInput?.value.trim() || "";
  const roleInput = els.jobRoleInput?.value.trim() || "";
  const deadline = els.jobDeadlineInput?.value || "";
  const text = els.jobDescriptionInput.value.trim();
  if (!text && !url && !companyInput && !roleInput) {
    els.jobAnalysisOutput.innerHTML = emptyState("Add a job URL, company, role, or job description first.");
    return;
  }
  const company = companyInput || inferCompanyFromUrl(url) || "Imported Company";
  const roleGuess = roleInput || inferRoleFromDescription(text || url);
  const analysisText = [roleGuess, company, source, url, text].filter(Boolean).join(" ");
  const keywords = extractKeywords(analysisText);
  const score = scoreResumeAgainstText(analysisText);
  const interviewTopics = [...new Set([...score.missing.slice(0, 4), ...keywords.slice(0, 3)])].slice(0, 6);
  latestJobAnalysis = {
    id: createId(),
    createdAt: new Date().toISOString(),
    source,
    url,
    role: roleGuess,
    company,
    deadline,
    text,
    keywords,
    score: score.score,
    missing: score.missing,
    matched: score.matched,
    interviewTopics
  };
  state.jobAnalyses = [latestJobAnalysis, ...state.jobAnalyses].slice(0, 10);
  els.jdScoreLabel.textContent = `${score.score}% resume match`;
  els.jobAnalysisOutput.innerHTML = `
    <div class="match-card">
      <strong>${escapeHtml(company)} - ${escapeHtml(roleGuess)}</strong>
      <div class="progress-track"><div class="progress-fill" style="width:${score.score}%"></div></div>
      <p>${score.score}% resume-to-role match. ${escapeHtml(score.summary)}</p>
      <p>${escapeHtml(source)}${url ? ` - <a href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">Open posting</a>` : ""}</p>
    </div>
    <div class="analysis-grid">
      <div class="coach-card">
        <h4>Extracted keywords</h4>
        <p>${escapeHtml(keywords.join(", ") || "No strong keywords detected.")}</p>
      </div>
      <div class="coach-card">
        <h4>Missing proof</h4>
        <p>${escapeHtml(score.missing.slice(0, 8).join(", ") || "No major keyword gaps detected.")}</p>
      </div>
      <div class="coach-card">
        <h4>Interview topics</h4>
        <p>${escapeHtml(interviewTopics.join(", ") || "Prepare a project walkthrough and behavioral story.")}</p>
      </div>
      <div class="coach-card">
        <h4>Suggested resume move</h4>
        <p>${escapeHtml(score.missing[0] ? getSkillGapAction(score.missing[0]) : "Add a stronger metric to your best project bullet.")}</p>
      </div>
    </div>
  `;
  addActivity(`Analyzed imported role for ${roleGuess}`);
  saveState();
}

function inferCompanyFromUrl(url) {
  if (!url) return "";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("linkedin")) return "LinkedIn Import";
    if (host.includes("intern-list")) return "Intern List Import";
    if (host.includes("joinhandshake")) return "Handshake Import";
    if (host.includes("simplify")) return "Simplify Import";
    const name = host.split(".")[0].replace(/[-_]+/g, " ");
    return toTitleCase(name);
  } catch {
    return "";
  }
}

function toTitleCase(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function inferRoleFromDescription(text) {
  const lower = text.toLowerCase();
  const match = careerPaths.find(path => path.matchTerms.some(term => lower.includes(term)) || lower.includes(path.title.toLowerCase()));
  if (match) return match.title;
  if (lower.includes("data")) return "Data Analyst Intern";
  if (lower.includes("software") || lower.includes("developer")) return "Software Engineering Intern";
  if (lower.includes("security")) return "Cybersecurity Analyst Intern";
  if (lower.includes("product")) return "Product Analyst Intern";
  return state.profile.targetRole || "Imported Role";
}

function saveAnalyzedJob() {
  if (!latestJobAnalysis) {
    analyzeJobDescription();
    if (!latestJobAnalysis) return;
  }
  state.applications.push({
    id: createId(),
    company: latestJobAnalysis.company,
    role: latestJobAnalysis.role,
    status: "Saved",
    deadline: latestJobAnalysis.deadline || "",
    link: latestJobAnalysis.url || "",
    notes: `Source: ${latestJobAnalysis.source || "Imported"}. Match ${latestJobAnalysis.score}%. Missing proof: ${latestJobAnalysis.missing.slice(0, 4).join(", ") || "none detected"}.`
  });
  selectedApplicationId = state.applications[state.applications.length - 1].id;
  addActivity(`Saved analyzed job: ${latestJobAnalysis.role}`);
  saveState();
  render();
  switchView("applications");
}

function renderChatThread() {
  if (!els.chatThread) return;
  els.chatThread.innerHTML = state.chat.map(item => `
    <div class="chat-message ${item.role === "user" ? "from-user" : "from-coach"}">
      <strong>${item.role === "user" ? "You" : "Nexus Coach"}</strong>
      <p>${escapeHtml(item.message)}</p>
    </div>
  `).join("") || emptyState("Ask a question like: What should I do today? How do I improve this bullet? Am I ready for AI internships?");
}

async function sendChatMessage(event) {
  event.preventDefault();
  const input = event.currentTarget.message;
  const message = input.value.trim();
  if (!message) return;
  state.chat.push({ role: "user", message, at: new Date().toISOString() });
  const response = generateChatResponse(message);
  state.chat.push({ role: "coach", message: response, at: new Date().toISOString() });
  state.chat = state.chat.slice(-20);
  input.value = "";
  addActivity("Asked AI chat coach a question");
  saveState();
  render();
}

function generateChatResponse(message) {
  const lower = message.toLowerCase();
  const score = calculateCareerScore();
  const fit = calculateSkillFit();
  if (lower.includes("today") || lower.includes("next")) {
    const plan = generateWeeklyPlan()[0];
    return plan ? `Today, focus on: ${plan.action}. ${plan.reason}` : "Start by setting a target role, then add one application, one project, and three proof-backed skills.";
  }
  if (lower.includes("ready") || lower.includes("score")) {
    return `Your current readiness score is ${score}/100. Your role-fit coverage is ${fit.coverage}%. Biggest gap: ${fit.gaps[0]?.name || "make your proof more measurable"}.`;
  }
  if (lower.includes("bullet") || lower.includes("resume")) {
    return "Use action + tool + result. Example: Built Nexus AI using JavaScript, FastAPI, and SQLite to centralize career workflows and generate role-aware next steps.";
  }
  if (lower.includes("interview")) {
    return `Practice a 90-second walkthrough of ${state.projects[0]?.name || "Nexus AI"}: problem, users, technical choices, tradeoffs, result, and next improvement.`;
  }
  return `Based on your workspace, the strongest move is to build proof for ${fit.gaps[0]?.name || "your target role"}, keep applications moving, and connect your best project to the role you want.`;
}

function renderProfileView() {
  if (!els.profileScore) return;
  const score = calculateCareerScore();
  const fit = calculateSkillFit();
  els.profileScore.textContent = score;
  els.profileScore.closest(".score-ring").style.setProperty("--score", score);
  els.profileNameHeading.textContent = state.profile.displayName ? `${state.profile.displayName}'s Career Profile` : "Your Nexus profile";
  els.profileSummary.textContent = state.profile.targetRole
    ? `${state.profile.major || "Student"} targeting ${state.profile.targetRole} with ${fit.coverage}% role-fit coverage.`
    : "Add your target role, major, projects, and skills to build a recruiter-ready profile.";
  els.profileSnapshot.innerHTML = [
    ["Target role", state.profile.targetRole || "Not set"],
    ["Major", state.profile.major || "Not set"],
    ["Graduation", state.profile.graduation || "Not set"],
    ["Weekly focus", `${state.profile.weeklyHours || 0} hours`],
    ["Applications", `${state.applications.length} tracked`],
    ["Opportunities", `${state.opportunities.length} saved`],
    ["Saved paths", `${state.savedRoles.length} saved`]
  ].map(([label, value]) => `
    <div class="analytics-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join("");
  els.profileProof.innerHTML = [
    ...state.projects.slice(0, 4).map(project => caseStudyCard(project.name, project.impact || project.stack || "Add a measurable outcome.")),
    ...state.certifications.slice(0, 2).map(cert => caseStudyCard(cert.name, `${cert.provider} | ${cert.progress}% complete`)),
    ...state.skills.slice(0, 4).map(skill => caseStudyCard(skill.name, skill.evidence || "Add proof for this skill."))
  ].join("") || emptyState("Add projects, certifications, and skills to build your proof portfolio.");
}

function renderAccount() {
  if (!els.accountForm) return;
  els.accountForm.workspaceName.value = state.account.workspaceName || "";
  els.accountForm.email.value = state.account.email || state.profile.email || "";
  els.accountForm.mode.value = state.account.mode || "Private";
  els.accountStatus.textContent = state.account.email ? "Workspace saved" : "Set up account";
  const savedAt = state.account.lastSaved ? formatActivityTime(state.account.lastSaved) : "Not saved yet";
  els.accountSummary.innerHTML = [
    ["Workspace", state.account.workspaceName || "Not named"],
    ["Email", state.account.email || state.profile.email || "Not set"],
    ["Mode", state.account.mode || "Private"],
    ["Last saved", savedAt]
  ].map(([title, body]) => `
    <div class="coach-card">
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(body)}</p>
    </div>
  `).join("");
  els.accountControls.innerHTML = [
    actionItem("Private by default", "Your profile starts blank and personal information is only stored after you enter it.", "Now", "Privacy"),
    actionItem("Portable data", "Export a JSON snapshot anytime and keep a backup outside the app.", "1 min", "Data"),
    actionItem("Backend-ready", "The current API supports profile, resume, applications, skills, projects, goals, and activity. Account auth can be connected with Clerk or Firebase next.", "Next", "Scale"),
    actionItem("Mentor review", "Use export/import to share a workspace with a mentor without exposing unrelated personal data.", "Optional", "Share")
  ].map(item => `
    <div class="action-card">
      <div class="action-card-top">
        <span>${escapeHtml(item.due)}</span>
        <strong>${escapeHtml(item.time)}</strong>
      </div>
      <h4>${escapeHtml(item.action)}</h4>
      <p>${escapeHtml(item.reason)}</p>
    </div>
  `).join("");
}

async function runAiTool() {
  const tool = els.aiToolSelect.value;
  const applicationId = els.aiApplicationSelect.value;
  const extraContext = els.aiPromptInput.value.trim();
  const selectedApplication = state.applications.find(item => item.id === applicationId) || null;
  const payload = {
    tool,
    extra_context: extraContext,
    application: selectedApplication,
    snapshot: buildAiSnapshot()
  };

  els.runAiToolButton.disabled = true;
  els.runAiToolButton.textContent = "Generating...";
  els.aiProviderLabel.textContent = backendOnline ? "Checking API" : "Local fallback";
  els.aiOutput.innerHTML = emptyState("Generating guidance...");

  try {
    let result;
    if (backendOnline) {
      result = await apiRequest("/ai/coach", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    } else {
      result = generateLocalAiResponse(payload);
    }
    renderAiResult(result);
    addActivity(`Ran AI tool: ${tool.replace(/_/g, " ")}`);
    saveState();
  } catch (error) {
    const fallback = generateLocalAiResponse(payload);
    fallback.provider = "Local fallback after API issue";
    fallback.note = error.message;
    renderAiResult(fallback);
  } finally {
    els.runAiToolButton.disabled = false;
    els.runAiToolButton.textContent = "Run AI Tool";
  }
}

function buildAiSnapshot(options = {}) {
  const snapshot = {
    profile: state.profile,
    account: state.account,
    applications: state.applications.slice(0, 12),
    opportunities: state.opportunities.slice(0, 12),
    projects: state.projects.slice(0, 8),
    skills: state.skills.slice(0, 16),
    certifications: state.certifications.slice(0, 8),
    networking: state.networking.slice(0, 8),
    interviews: state.interviews.slice(0, 8),
    goals: state.goals.slice(0, 8),
    resume: state.resume,
    jobAnalyses: state.jobAnalyses.slice(0, 5),
    chat: state.chat.slice(-8),
    readinessScore: calculateCareerScore(),
    skillFit: calculateSkillFit(),
    weeklyPlan: generateWeeklyPlan()
  };
  if (options.includeResumeImages && latestResumePageImages.length) {
    snapshot.resumePageImages = latestResumePageImages;
  }
  return snapshot;
}

function renderAiResult(result) {
  els.aiProviderLabel.textContent = result.provider || "AI guidance";
  const sections = Array.isArray(result.sections) ? result.sections : [];
  els.aiOutput.dataset.lastOutput = sections.map(section => `${section.title}\n${section.body}`).join("\n\n");
  els.aiOutput.innerHTML = sections.map(section => `
    <div class="coach-card">
      <h4>${escapeHtml(section.title)}</h4>
      <p>${escapeHtml(section.body)}</p>
    </div>
  `).join("") || `<div class="coach-card"><p>${escapeHtml(result.text || "No guidance returned.")}</p></div>`;
  if (result.note) {
    els.aiOutput.innerHTML += `<div class="empty-state">${escapeHtml(result.note)}</div>`;
  }
}

async function copyAiOutput() {
  const text = els.aiOutput.dataset.lastOutput || els.aiOutput.textContent.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    els.copyAiOutputButton.textContent = "Copied";
    setTimeout(() => {
      els.copyAiOutputButton.textContent = "Copy Output";
    }, 1400);
  } catch {
    downloadFile("nexus-ai-output.txt", text, "text/plain");
  }
}

function generateLocalAiResponse(payload) {
  const snapshot = payload.snapshot;
  const role = snapshot.profile.targetRole || "your target role";
  const app = payload.application;
  const fit = snapshot.skillFit;
  const strongestProject = snapshot.projects.find(project => project.link && project.impact) || snapshot.projects[0];
  const missingSkill = fit.gaps[0]?.name || "role-specific proof";
  const appLabel = app ? `${app.role} at ${app.company}` : role;
  const resumeReview = analyzeResumeText(snapshot.resume || state.resume);
  const common = {
    provider: "Local fallback",
    note: "Connect the backend with an OpenAI API key to generate model-written responses."
  };

  const toolResponses = {
    resume_review: [
      [`Honest score: ${resumeReview.score}/100`, `${resumeReview.verdict} ${resumeReview.summary}`],
      ["Most important fix", resumeReview.nextEdit],
      ...resumeReview.issues.slice(0, 5).map(issue => [`${issue.level}: ${issue.title}`, issue.body])
    ],
    cover_letter: [
      ["Opening angle", `I am interested in ${appLabel} because it connects to my work building AI-assisted student career and learning systems.`],
      ["Evidence paragraph", strongestProject ? `Use ${strongestProject.name} as the main story and explain the problem, technical stack, and outcome.` : "Use Nexus AI as the main story and explain the career workflow problem it solves."],
      ["Close", "End by naming the specific team need you can support: clean software, data workflows, AI evaluation, or student/user-focused product thinking."]
    ],
    interview_prep: [
      ["Tell me about yourself", `Frame yourself as an Information Systems student building AI, data, and software tools for student decision-making, with ${role} as your current direction.`],
      ["Project walkthrough", strongestProject ? `Practice explaining ${strongestProject.name}: problem, users, architecture, tradeoffs, result, and what you would improve next.` : "Prepare a Nexus AI walkthrough: problem, users, frontend, backend, data model, AI tools, and next version."],
      ["Technical questions", `Expect questions about ${missingSkill}, API design, data validation, deployment, and how you test product quality.`],
      ["Behavioral question", "Prepare a STAR story about improving Nexus after feedback instead of defending the first version."]
    ],
    role_fit: [
      ["Why you match", `Your strongest match signals are ${fit.matched.map(item => item.name).slice(0, 4).join(", ") || "your deployed projects and AI/data experience"}.`],
      ["Why you may be filtered out", fit.gaps.length ? `Missing or weak proof: ${fit.gaps.map(item => item.name).slice(0, 4).join(", ")}.` : "No major skill gaps detected. Improve proof quality and specificity."],
      ["Next move", fit.gaps[0]?.action || "Add stronger measurable outcomes to your best project and apply to more matched roles."]
    ],
    roadmap: buildRoleRoadmapSections(role, fit, strongestProject),
    weekly_plan: generateWeeklyPlan().map((item, index) => [`Priority ${index + 1}: ${item.action}`, `${item.reason} Time: ${item.time}. Due: ${item.due}.`]),
    networking_message: [
      ["Message draft", `Hi, I'm Jason, an Information Systems student at UMBC interested in ${role}. I've been building Nexus AI, CareerLens, and LearnWise to explore how AI and data can improve student career decisions. I'd appreciate any advice on what skills or project proof matter most for ${appLabel}.`],
      ["Follow-up angle", "Keep it short, mention one specific project, ask one clear question, and do not ask for a job in the first message."]
    ],
    follow_up: [
      ["Subject line", `Following up on ${appLabel}`],
      ["Message draft", `Hi, I wanted to follow up on my application for ${appLabel}. Since applying, I have continued strengthening my project proof through Nexus AI and related AI/data tools, and I would be glad to share more context on how my experience matches the role.`],
      ["Timing", "Send this 5-7 business days after applying unless the posting gives a different timeline."]
    ],
    opportunity_strategy: generateOpportunityStrategy().map(card => [card.title, card.body])
  };

  const sections = (toolResponses[payload.tool] || toolResponses.weekly_plan).map(([title, body]) => ({ title, body }));
  if (payload.extra_context) {
    sections.push({ title: "Extra context used", body: `You added: ${payload.extra_context.slice(0, 240)}${payload.extra_context.length > 240 ? "..." : ""}` });
  }
  return { ...common, sections };
}

function buildRoleRoadmapSections(role, fit, strongestProject) {
  const bestPath = careerPaths.find(path => path.title === role) || careerPaths
    .map(path => ({ ...path, fit: calculatePathFit(path) }))
    .sort((a, b) => b.fit.score - a.fit.score)[0];
  const skills = bestPath?.skills || fit.required || [];
  const proof = bestPath?.proof || ["deployed project", "case study", "resume bullets"];
  const firstGap = fit.gaps[0]?.name || skills[0] || "role-specific proof";
  return [
    ["Target outcome", `Build enough proof for ${role} that a recruiter can see a clear connection between your skills, projects, and applications.`],
    ["Skills to learn next", skills.slice(0, 6).join(", ") || "Add a target role first to generate skill priorities."],
    ["Project proof to build", proof.join(", ")],
    ["Resume keywords", [...new Set([role, ...skills.slice(0, 5), "GitHub", "deployed project"])].join(", ")],
    ["First weekly move", fit.gaps[0]?.action || `Document ${strongestProject?.name || "your strongest project"} with a clearer problem, stack, result, and next improvement.`],
    ["Interview prep", `Prepare a 90-second story about ${strongestProject?.name || "Nexus AI"} and one example showing ${firstGap}.`]
  ];
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
      ${collection === "applications" ? `<button class="delete-button" type="button" onclick="selectApplicationDetail('${id}')">Details</button>` : ""}
      <button class="delete-button" type="button" onclick="openEdit('${collection}', '${id}')">Edit</button>
      <button class="delete-button" type="button" onclick="deleteItem('${collection}', '${id}')">Remove</button>
    </div>
  `;
}

function scoreResumeAgainstText(text) {
  const source = String(text || "").toLowerCase();
  const resume = `${state.resume} ${state.projects.map(project => `${project.name} ${project.stack} ${project.impact}`).join(" ")} ${state.skills.map(skill => `${skill.name} ${skill.evidence}`).join(" ")}`.toLowerCase();
  const keywords = extractKeywords(source);
  const matched = keywords.filter(keyword => resume.includes(keyword.toLowerCase()));
  const missing = keywords.filter(keyword => !resume.includes(keyword.toLowerCase()));
  const proofBonus = Math.min(state.projects.filter(project => project.link).length * 4, 16);
  const score = keywords.length ? Math.min(98, Math.round((matched.length / keywords.length) * 78 + proofBonus)) : calculateSkillFit().coverage;
  return {
    score,
    matched,
    missing,
    keywords,
    summary: matched.length
      ? `Matched ${matched.slice(0, 5).join(", ")}. Strengthen missing proof for ${missing.slice(0, 4).join(", ") || "the most role-specific outcomes"}.`
      : "Add more role keywords, project proof, and measurable outcomes to improve match quality."
  };
}

function extractKeywords(text) {
  const bank = [
    "Python", "JavaScript", "TypeScript", "React", "SQL", "FastAPI", "APIs", "SQLite", "PostgreSQL",
    "Power BI", "Excel", "Data Analysis", "Data Visualization", "Machine Learning", "Statistics",
    "Generative AI", "LLM Evaluation", "Prompt Engineering", "AI Model Evaluation", "Testing",
    "QA", "Documentation", "Cloud", "Security", "Networking", "User Research", "Product",
    "Agile", "Systems Analysis", "Business Analysis", "Communication", "Troubleshooting"
  ];
  const lower = String(text || "").toLowerCase();
  const found = bank.filter(term => lower.includes(term.toLowerCase()));
  if (found.length >= 6) return found;
  const inferred = lower
    .replace(/[^a-z0-9+#\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 4 && !["intern", "student", "experience", "required", "preferred", "skills", "ability", "working"].includes(word))
    .slice(0, 12)
    .map(word => word.replace(/^\w/, letter => letter.toUpperCase()));
  return [...new Set([...found, ...inferred])].slice(0, 14);
}

function strongestProjectLine() {
  const project = state.projects.find(item => item.link && item.impact) || state.projects[0];
  if (!project) return "Add one project with a public link and a result statement before applying.";
  return `${project.name}: ${project.impact || "add the result this project created."}`;
}

function renderReadinessTimeline() {
  const base = calculateCareerScore();
  const points = [
    { label: "Start", value: Math.max(4, base - 24), note: "Workspace created" },
    { label: "Profile", value: Math.max(8, base - 18 + (state.profile.targetRole ? 8 : 0)), note: state.profile.targetRole ? "Target role set" : "Target role missing" },
    { label: "Proof", value: Math.max(12, base - 10 + Math.min(state.projects.length * 3, 10)), note: `${state.projects.length} projects tracked` },
    { label: "Pipeline", value: Math.max(16, base - 4 + Math.min(state.applications.length * 2, 8)), note: `${state.applications.length} applications` },
    { label: "Today", value: base, note: `${base}/100 readiness` }
  ].map(item => ({ ...item, value: clamp(Math.round(item.value), 0, 100) }));
  return `
    <div class="timeline-bars">
      ${points.map(item => `
        <div class="timeline-bar-item">
          <span>${escapeHtml(item.label)}</span>
          <div class="timeline-bar"><div style="height:${item.value}%; width:${item.value}%"></div></div>
          <strong>${item.value}</strong>
          <small>${escapeHtml(item.note)}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function calculateCareerScore() {
  const profile = state.profile.targetRole && state.profile.major ? 10 : 0;
  const apps = Math.min(state.applications.length * 4, 20);
  const opportunities = Math.min(state.opportunities.length * 2, 6);
  const interviews = Math.min(state.applications.filter(app => ["Interviewing", "Offer"].includes(app.status)).length * 6, 12);
  const projects = Math.min(state.projects.filter(project => project.stage === "Published").length * 10, 22);
  const certs = Math.min(state.certifications.reduce((sum, cert) => sum + Number(cert.progress || 0), 0) / 10, 16);
  const network = Math.min(state.networking.length * 4, 12);
  const goals = Math.min(state.goals.reduce((sum, goal) => sum + Number(goal.progress || 0), 0) / 18, 8);
  const skills = Math.min(calculateSkillFit().coverage / 10, 10);
  return Math.min(100, Math.round(profile + apps + opportunities + interviews + projects + certs + network + goals + skills));
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

function renderWeeklyPlan() {
  const plan = generateWeeklyPlan();
  return plan.map((item, index) => `
    <div class="action-card priority-${index + 1}">
      <div class="action-card-top">
        <span>Priority ${index + 1}</span>
        <strong>${escapeHtml(item.time)}</strong>
      </div>
      <h4>${escapeHtml(item.action)}</h4>
      <p>${escapeHtml(item.reason)}</p>
      <small>${escapeHtml(item.due)}</small>
    </div>
  `).join("") || emptyState("Add a target role, applications, skills, projects, and goals to generate a weekly plan.");
}

function renderSchemaPreview() {
  const tables = [
    ["users", "auth_provider, auth_subject, email, created_at"],
    ["students", "profile_id, target_role, major, graduation, weekly_hours"],
    ["applications", "company, role, status, deadline, link, notes"],
    ["skills", "name, category, confidence_level, evidence"],
    ["projects", "name, tech_stack, stage, link, impact"],
    ["networking", "contact_name, organization, status, next_follow_up"],
    ["goals", "goal, category, progress, due_date, next_step"],
    ["activity", "user_id, message, created_at"]
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
  const interviews = state.applications.filter(app => app.status === "Interviewing");
  const publishedProjects = state.projects.filter(project => project.stage === "Published");
  const role = state.profile.targetRole || "your target role";
  const lowCert = state.certifications.find(item => Number(item.progress || 0) < 50);
  const fit = calculateSkillFit();
  const nextDeadline = getAllDeadlines().filter(item => daysUntil(item.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  const projectWithoutProof = state.projects.find(project => !project.link || !project.impact);
  const weakestGoal = state.goals
    .filter(goal => Number(goal.progress || 0) < 100)
    .sort((a, b) => Number(a.progress || 0) - Number(b.progress || 0))[0];

  cards.push({
    title: "Pipeline move",
    body: !state.profile.targetRole
      ? "Start by saving a target role. The workspace will use that role to judge your pipeline, skills, and project proof."
      : activeApps.length < 8
      ? `For ${role}, add three more active roles with deadlines and next actions. Prioritize roles that mention ${fit.gaps[0]?.name || "your strongest project proof"}.`
      : `Your ${role} pipeline has volume. Move two applications from passive tracking into follow-up, referral, or interview prep.`
  });
  cards.push({
    title: "Portfolio proof",
    body: projectWithoutProof
      ? `${projectWithoutProof.name} needs stronger proof. Add ${!projectWithoutProof.link ? "a public link" : "a measurable impact statement"} so recruiters can verify it quickly.`
      : publishedProjects.length < 3
      ? "Publish or polish one more project with a live link, GitHub README, screenshots, and a clear result statement."
      : "Your project proof is credible. Add short case-study summaries so recruiters can scan the value faster."
  });
  cards.push({
    title: "Interview readiness",
    body: interviews.length
      ? `You have ${interviews.length} interview-stage item${interviews.length === 1 ? "" : "s"}. Practice one STAR story and one technical project walkthrough.`
      : nextDeadline
      ? `No interview-stage applications yet. Before ${formatDate(nextDeadline.date)}, prepare one project story tied to ${nextDeadline.title}.`
      : "No interview-stage applications yet. Prepare anyway by linking each resume bullet to a project story."
  });
  cards.push({
    title: "Learning focus",
    body: fit.gaps.length
      ? `Your biggest role-fit gap is ${fit.gaps[0].name}. ${fit.gaps[0].action}`
      : lowCert
      ? `${lowCert.name} is at ${lowCert.progress}%. Schedule focused study blocks before ${formatDate(lowCert.target)}.`
      : "Your certification pipeline is either complete or empty. Keep only credentials that match your target role."
  });
  cards.push({
    title: "Goal execution",
    body: weakestGoal
      ? `Lowest-progress goal: ${weakestGoal.goal}. Next move: ${weakestGoal.nextStep || "define one concrete next step and due date."}`
      : "Add one semester goal so Nexus can connect your weekly plan to a measurable outcome."
  });

  return cards;
}

function generateWeeklyPlan() {
  const plan = [];
  const overdue = getAllDeadlines().filter(item => daysUntil(item.date) < 0);
  const upcoming = getUpcomingDeadlines();
  const fit = calculateSkillFit();
  const activeApps = state.applications.filter(app => !["Rejected", "Offer"].includes(app.status));
  const publishedProjects = state.projects.filter(project => project.stage === "Published" || project.stage === "Improving");
  const lowestGoal = state.goals
    .filter(goal => Number(goal.progress || 0) < 100)
    .sort((a, b) => Number(a.progress || 0) - Number(b.progress || 0))[0];

  if (!state.profile.targetRole) {
    plan.push(actionItem(
      "Set your target role",
      "Nexus needs a target role before it can judge skill gaps, project proof, and application quality.",
      "10 min",
      "Today"
    ));
  }

  if (overdue.length) {
    plan.push(actionItem(
      `Resolve ${overdue.length} overdue item${overdue.length === 1 ? "" : "s"}`,
      "Outdated dates make the dashboard less trustworthy and hide what actually needs attention.",
      "20 min",
      "Today"
    ));
  }

  if (activeApps.length < 8) {
    if (activeOpportunities.length >= 2) {
      plan.push(actionItem(
        "Promote two saved opportunities",
        "Move the strongest saved opportunities into applications so they get deadlines, statuses, and follow-up notes.",
        "25 min",
        "Today"
      ));
    }
    plan.push(actionItem(
      "Add three internship applications",
      "A stronger pipeline gives you more chances while your projects and skills keep improving.",
      "45 min",
      "This week"
    ));
  } else {
    plan.push(actionItem(
      "Follow up on two active applications",
      "Your pipeline is healthy, so the best move is turning applications into conversations.",
      "30 min",
      "Next 2 days"
    ));
  }

  if (fit.gaps.length) {
    plan.push(actionItem(
      `Build proof for ${fit.gaps[0].name}`,
      fit.gaps[0].action,
      "60-90 min",
      "This week"
    ));
  }

  if (publishedProjects.length < 3) {
    plan.push(actionItem(
      "Publish or polish one portfolio project",
      "Recruiters need visible proof, not only a list of skills. Add a link, tech stack, and result statement.",
      "90 min",
      "This week"
    ));
  }

  if (state.networking.length < 5) {
    plan.push(actionItem(
      "Add two networking contacts",
      "A small follow-up system helps you build opportunity before applications go cold.",
      "25 min",
      "This week"
    ));
  }

  if (activeOpportunities.length < 5) {
    plan.push(actionItem(
      "Save five career opportunities",
      "Keep internships, fellowships, hackathons, scholarships, and career programs visible before choosing where to apply.",
      "30 min",
      "This week"
    ));
  }

  if (state.interviews.length < 2) {
    plan.push(actionItem(
      "Create one interview practice session",
      "Prepare before you need it by practicing one behavioral story and one project walkthrough.",
      "35 min",
      "This week"
    ));
  }

  if (lowestGoal) {
    plan.push(actionItem(
      `Advance goal: ${lowestGoal.goal}`,
      lowestGoal.nextStep || "Move the lowest-progress goal forward with one specific next step.",
      "30 min",
      "Before Friday"
    ));
  }

  if (upcoming.length) {
    plan.push(actionItem(
      `Prepare for ${upcoming[0].title}`,
      `${upcoming[0].type} deadline is coming up on ${formatDate(upcoming[0].date)}.`,
      "30 min",
      "Before the deadline"
    ));
  }

  return dedupePlan(plan).slice(0, 5);
}

function actionItem(action, reason, time, due) {
  return { action, reason, time, due };
}

function dedupePlan(plan) {
  const seen = new Set();
  return plan.filter(item => {
    const key = item.action.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function generateResumeCoach() {
  const review = analyzeResumeText(state.resume);
  return [
    {
      title: `Honest resume score: ${review.score}/100`,
      body: `${review.verdict} ${review.summary}`
    },
    ...review.issues.slice(0, 8).map(issue => ({
      title: `${issue.level}: ${issue.title}`,
      body: issue.body
    })),
    {
      title: "Best next edit",
      body: review.nextEdit
    }
  ];
}

function analyzeResumeText(rawResume) {
  const raw = String(rawResume || "").trim();
  if (!raw) {
    return {
      score: 0,
      verdict: "No resume text found.",
      summary: "Upload a text-based PDF or paste your resume text to get a real review.",
      nextEdit: "Start by importing your current PDF resume.",
      issues: [{ level: "Critical", title: "Resume missing", body: "Nexus cannot review an empty resume." }]
    };
  }

  const text = raw.toLowerCase();
  const lines = raw.split(/\n+/).map(line => line.trim()).filter(Boolean);
  const bullets = lines.filter(line => /^(?:[-*]|\u2022)/.test(line) || /^[A-Z][^.!?]{20,}$/.test(line));
  const actionVerbs = ["built", "created", "designed", "developed", "deployed", "analyzed", "implemented", "improved", "automated", "modeled", "tracked", "evaluated", "managed", "led", "tested", "documented", "launched", "optimized"];
  const tools = ["javascript", "python", "java", "sql", "fastapi", "sqlite", "postgresql", "power bi", "excel", "github", "render", "api", "html", "css", "openai", "llm", "cloud", "oracle", "figma"];
  const sections = ["education", "experience", "projects", "skills"];
  const role = state.profile.targetRole || inferRoleFromDescription(raw);
  const roleKeywords = getResumeRoleKeywords(role);
  const projectNames = state.projects.map(project => project.name.toLowerCase()).filter(Boolean);
  const issueList = [];

  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(raw);
  const hasPhone = /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(raw);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(raw);
  const hasGithub = /github\.com\//i.test(raw);
  const hasPortfolio = /(https?:\/\/|jasonbinong\.github\.io|portfolio)/i.test(raw);
  const hasMetric = /(\d+%|\d+\+|\$\d+|\d+\s?(users|projects|applications|workflows|hours|roles|records|students|weeks|endpoints)|\/100)/i.test(raw);
  const sectionHits = sections.filter(section => text.includes(section));
  const toolHits = tools.filter(tool => text.includes(tool));
  const keywordHits = roleKeywords.filter(keyword => text.includes(keyword.toLowerCase()));
  const actionBulletCount = bullets.filter(line => actionVerbs.some(verb => line.toLowerCase().includes(verb))).length;
  const strongBulletCount = bullets.filter(line => {
    const lower = line.toLowerCase();
    return actionVerbs.some(verb => lower.includes(verb)) &&
      tools.some(tool => lower.includes(tool)) &&
      /(\d|result|impact|deployed|reduced|increased|tracked|centralized|connected|improved|generated|launched|supported)/.test(lower);
  }).length;
  const weakBullets = bullets.filter(line => line.length < 55 || !/\d|result|impact|deployed|improved|built|analyzed|designed|developed/i.test(line)).slice(0, 3);
  const projectHits = projectNames.filter(name => name && text.includes(name));
  const wordCount = raw.split(/\s+/).filter(Boolean).length;

  const checks = [
    { ok: hasEmail, points: 6, level: "Critical", title: "Missing email", body: "Add a professional email in the header so recruiters can contact you." },
    { ok: hasPhone, points: 5, level: "High", title: "Missing phone number", body: "Most internship applications still expect a phone number in the resume header." },
    { ok: hasLinkedIn, points: 5, level: "High", title: "Missing LinkedIn", body: "Add your LinkedIn URL because recruiters often cross-check projects, experience, and profile details." },
    { ok: hasGithub, points: 8, level: "High", title: "Missing GitHub", body: "For AI/software/data roles, a GitHub link is a major proof signal." },
    { ok: hasPortfolio, points: 6, level: "Medium", title: "Missing portfolio/live project link", body: "Add your portfolio or deployed project links so your work is verifiable." },
    { ok: sectionHits.length >= 4, points: 8, level: "Medium", title: "Section structure is incomplete", body: `Detected ${sectionHits.join(", ") || "no core sections"}. A strong student resume should clearly include Education, Experience, Projects, and Skills.` },
    { ok: bullets.length >= 8, points: 8, level: "Medium", title: "Not enough bullet evidence", body: `Detected about ${bullets.length} bullet-style lines. Add enough bullets to prove experience, projects, and leadership without padding.` },
    { ok: actionBulletCount >= Math.max(4, Math.ceil(bullets.length * 0.5)), points: 10, level: "High", title: "Bullets need stronger action verbs", body: "More bullets should start with strong verbs like Built, Analyzed, Deployed, Designed, Tested, or Improved." },
    { ok: strongBulletCount >= 4, points: 14, level: "High", title: "Bullets need action + tool + result", body: `Only ${strongBulletCount} bullets look strong. Rewrite weak bullets to include what you did, what tool you used, and what changed.` },
    { ok: hasMetric, points: 10, level: "High", title: "Needs measurable outcomes", body: "Add truthful numbers: roles analyzed, workflows tracked, users supported, projects shipped, response quality scored, or hours saved." },
    { ok: toolHits.length >= 6, points: 10, level: "High", title: "Technical keywords are thin", body: `Detected ${toolHits.join(", ") || "few tools"}. Add relevant tools only if you can defend them in projects or coursework.` },
    { ok: keywordHits.length >= Math.min(5, roleKeywords.length), points: 8, level: "Medium", title: "Role fit is unclear", body: `For ${role}, include more truthful keywords such as ${roleKeywords.slice(0, 8).join(", ")}.` },
    { ok: projectHits.length >= Math.min(2, Math.max(1, state.projects.length)), points: 8, level: "Medium", title: "Project proof is disconnected", body: "Your resume should name your strongest projects and connect them to the skills you list." },
    { ok: wordCount >= 320 && wordCount <= 750, points: 4, level: "Low", title: "Resume length may be off", body: `Detected about ${wordCount} words. For an early-career one-page resume, aim for dense but readable proof.` }
  ];

  let rawScore = 0;
  checks.forEach(check => {
    if (check.ok) rawScore += check.points;
    else issueList.push({ level: check.level, title: check.title, body: check.body });
  });
  const score = Math.min(96, Math.max(45, Math.round(42 + rawScore * 0.55)));

  if (weakBullets.length) {
    issueList.push({
      level: "Medium",
      title: "Weak bullet examples",
      body: `Review these first: ${weakBullets.map(line => `"${line.slice(0, 110)}"`).join(" ")}`
    });
  }

  const verdict = score >= 85
    ? "Strong resume."
    : score >= 70
    ? "Good resume, but not fully internship-proof yet."
    : score >= 50
    ? "Decent foundation, but it may get filtered for competitive AI/software/data roles."
    : "Needs serious work before competitive applications.";
  const summary = `Detected ${toolHits.length} technical tools, ${keywordHits.length}/${roleKeywords.length} role keywords, ${strongBulletCount} strong bullets, and ${issueList.length} issues.`;
  const nextEdit = issueList[0]
    ? `${issueList[0].title}: ${issueList[0].body}`
    : "Tighten wording and tailor the top project bullets to the exact job description.";

  return { score, verdict, summary, nextEdit, issues: issueList };
}

function getResumeRoleKeywords(role) {
  const lower = String(role || "").toLowerCase();
  if (lower.includes("software") || lower.includes("developer")) return ["JavaScript", "Python", "Java", "APIs", "Testing", "GitHub", "Deployment", "Object-Oriented Programming", "Debugging"];
  if (lower.includes("data") || lower.includes("analyst")) return ["SQL", "Excel", "Power BI", "Data Analysis", "Data Visualization", "Statistics", "Dashboard", "Insights", "Reporting"];
  if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("llm")) return ["Python", "Generative AI", "LLM Evaluation", "Prompt Engineering", "AI Model Evaluation", "Data Quality", "APIs", "Responsible AI"];
  if (lower.includes("cloud") || lower.includes("systems")) return ["Cloud Computing", "APIs", "Database", "Security", "Networking", "Troubleshooting", "Documentation", "Deployment"];
  return ["SQL", "JavaScript", "Python", "Data Analysis", "GitHub", "Communication", "Systems Analysis", "Project"];
}

function generateAnalytics() {
  const appsByStatus = ["Saved", "Applied", "Interviewing", "Offer", "Rejected", "Follow-up needed", "Deadline approaching"]
    .map(status => `${status}: ${state.applications.filter(app => app.status === status).length}`)
    .join(" | ");
  const avgCert = state.certifications.length
    ? `${Math.round(state.certifications.reduce((sum, cert) => sum + Number(cert.progress || 0), 0) / state.certifications.length)}%`
    : "0%";
  const published = state.projects.filter(project => project.stage === "Published").length;
  const nextDeadline = getAllDeadlines().filter(item => daysUntil(item.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];

  return [
    { label: "Saved opportunities", value: `${state.opportunities.length} tracked` },
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
    ...state.opportunities.map(item => ({ type: item.type || "Opportunity", title: `${item.organization} - ${item.name}`, date: item.deadline })),
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
  const weeklyPlan = generateWeeklyPlan();
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
    ...weeklyPlan.map((item, index) => `${index + 1}. ${item.action} (${item.time}, ${item.due})\n   Why: ${item.reason}`)
  ];
  downloadFile("nexus-ai-career-plan.txt", lines.join("\n"), "text/plain");
}

async function copyWeeklyPlan() {
  const weeklyPlan = generateWeeklyPlan();
  const text = [
    "Nexus AI Weekly Career Plan",
    `Target role: ${state.profile.targetRole || "Not set"}`,
    "",
    ...weeklyPlan.map((item, index) => `${index + 1}. ${item.action}\n   Time: ${item.time}\n   Due: ${item.due}\n   Why: ${item.reason}`)
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    els.copyWeeklyPlanButton.textContent = "Copied";
    setTimeout(() => {
      els.copyWeeklyPlanButton.textContent = "Copy Plan";
    }, 1400);
  } catch {
    downloadFile("nexus-ai-weekly-plan.txt", text, "text/plain");
  }
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
      state.account = { ...starterState.account, ...(snapshot.account || {}) };
      state.opportunities = Array.isArray(snapshot.opportunities) ? snapshot.opportunities : [];
      state.savedRoles = Array.isArray(snapshot.savedRoles) ? snapshot.savedRoles : [];
      state.jobAnalyses = Array.isArray(snapshot.jobAnalyses) ? snapshot.jobAnalyses : [];
      state.chat = Array.isArray(snapshot.chat) ? snapshot.chat.slice(-20) : [];
      saveState();
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

async function loadSampleWorkspace() {
  const confirmed = window.confirm("Load the starter workspace? This replaces the current workspace. New users otherwise start blank.");
  if (!confirmed) return;

  await importSnapshotData(structuredClone(sampleWorkspace), "starter-workspace");
  currentView = "dashboard";
  switchView("dashboard");
  updateSyncStatus(backendOnline ? "Starter workspace loaded to API" : "Starter workspace loaded locally");
}

function switchView(view) {
  const titles = {
    dashboard: "Find Roles. Track Progress. Move Next.",
    explore: "Explore Roles",
    jobBoard: "Job Board",
    opportunities: "Opportunities",
    applications: "Applications",
    certifications: "Certifications",
    projects: "Projects",
    networking: "Networking",
    interviews: "Interview Prep",
    skills: "Skills Lab",
    resume: "Resume Builder",
    aiTools: "AI Career Tools",
    profile: "Student Profile",
    account: "Workspace Account",
    goals: "Career Goals",
    onboarding: "Onboarding",
    caseStudy: "Case Study"
  };

  currentView = view;
  els.navItems.forEach(item => item.classList.toggle("active", item.dataset.view === view));
  els.navGroups.forEach(group => {
    const isActive = [...group.querySelectorAll(".nav-item")].some(item => item.dataset.view === view);
    group.classList.toggle("active", isActive);
  });
  els.views.forEach(section => section.classList.toggle("active", section.id === `${view}View`));
  els.viewTitle.textContent = titles[view];
}

function addActivity(message) {
  state.activity = [{ id: createId(), at: new Date().toISOString(), message }, ...(state.activity || [])].slice(0, 50);
}

function isWorkspaceEmpty(workspace) {
  return !workspace.profile.targetRole &&
    !workspace.applications.length &&
    !workspace.projects.length &&
    !workspace.skills.length &&
    !workspace.goals.length &&
    !workspace.resume.trim();
}

function displayName(collection, item) {
  if (collection === "applications") return `${item.company} ${item.role}`;
  if (collection === "opportunities") return `${item.organization} ${item.name}`;
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
    opportunities: "opportunity",
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

function formatActivityTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
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
  window.alert(`Nexus AI could not complete that action. ${error.message || "Check that the backend is running, then try again."}`);
}
