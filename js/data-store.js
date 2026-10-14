/**
 * ============================================================================
 * CENTRALIZED DATA STORE (js/data-store.js)
 * Full CRUD, Visibility Toggling, LocalStorage Caching & Supabase Cloud Sync
 * ============================================================================
 */

// Storage Keys
const STORE_KEYS = {
  ACHIEVEMENTS: 'portfolio_achievements_v2',
  PROJECTS: 'portfolio_projects_v2',
  PROFILE: 'portfolio_profile_v2',
  SKILLS: 'portfolio_skills_v2',
  AUTH: 'portfolio_admin_auth'
};

// Default Seed Data for Initial Load
const DEFAULT_ACHIEVEMENTS = [
  {
    id: "aws-saa",
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    issuerLogo: "fa-brands fa-aws",
    issuerColor: "text-amber-700 bg-amber-50 border-amber-200",
    category: "certifications",
    date: "Dec 2024",
    expires: "Dec 2027",
    verificationId: "AWS-SAA-84920194",
    credentialUrl: "https://aws.amazon.com/verification",
    imageUrl: "",
    skills: ["Cloud Architecture", "VPC & Networking", "S3 & DynamoDB", "High Availability", "IAM Security"],
    description: "Validated comprehensive expertise in designing resilient, high-performing, secure, and cost-optimized distributed systems on AWS.",
    featured: true,
    is_visible: true
  },
  {
    id: "gcp-cdl",
    title: "Google Cloud Certified: Associate Cloud Engineer",
    issuer: "Google Cloud",
    issuerLogo: "fa-brands fa-google",
    issuerColor: "text-blue-700 bg-blue-50 border-blue-200",
    category: "certifications",
    date: "Oct 2024",
    expires: "Oct 2027",
    verificationId: "GCP-ACE-99482012",
    credentialUrl: "https://google.accredible.com",
    imageUrl: "",
    skills: ["Google Kubernetes Engine", "BigQuery", "Compute Engine", "Cloud IAM", "Cloud Storage"],
    description: "Demonstrated proficiency in deploying applications, monitoring operations, and managing enterprise cloud infrastructure on GCP.",
    featured: true,
    is_visible: true
  },
  {
    id: "hack-sih",
    title: "Smart India Hackathon 2024 – National Finalist & 1st Runner Up",
    issuer: "Ministry of Education & AICTE",
    issuerLogo: "fa-solid fa-trophy",
    issuerColor: "text-purple-700 bg-purple-50 border-purple-200",
    category: "hackathons",
    date: "Aug 2024",
    expires: "Lifetime Honor",
    verificationId: "SIH-2024-FN-4028",
    credentialUrl: "https://www.sih.gov.in",
    imageUrl: "",
    skills: ["Distributed Systems", "FastAPI", "React", "PostgreSQL", "Real-time Telemetry"],
    description: "Engineered an AI-driven disaster response dispatch coordination system in a 36-hour non-stop national collegiate hackathon competing against 1,200+ teams.",
    featured: true,
    is_visible: true
  },
  {
    id: "ms-az900",
    title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    issuerLogo: "fa-brands fa-microsoft",
    issuerColor: "text-blue-700 bg-blue-50 border-blue-200",
    category: "certifications",
    date: "Jun 2024",
    expires: "Lifetime",
    verificationId: "MS-AZ900-7719402",
    credentialUrl: "https://learn.microsoft.com/en-us/users/credentials",
    imageUrl: "",
    skills: ["Azure Cloud", "Virtual Machines", "Azure SQL", "Compliance & Governance"],
    description: "Mastered cloud concepts, Azure architecture components, core Azure services, management tools, and enterprise security frameworks.",
    featured: false,
    is_visible: true
  },
  {
    id: "meta-frontend",
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    issuerLogo: "fa-brands fa-meta",
    issuerColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    category: "certifications",
    date: "Apr 2024",
    expires: "Lifetime",
    verificationId: "META-FED-5501839",
    credentialUrl: "https://coursera.org/verify/professional-cert/meta-frontend",
    imageUrl: "",
    skills: ["React.js", "JavaScript ES6+", "UI/UX Systems", "Tailwind CSS", "Jest Unit Testing"],
    description: "Comprehensive 9-course specialization covering modern frontend engineering, component design patterns, accessibility, and client-side performance.",
    featured: false,
    is_visible: true
  },
  {
    id: "hack-eth",
    title: "Global Web3 & AI Hackathon – 1st Place Winner",
    issuer: "Devfolio & Superteam",
    issuerLogo: "fa-solid fa-medal",
    issuerColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    category: "hackathons",
    date: "Feb 2025",
    expires: "Lifetime Honor",
    verificationId: "DEV-AIW3-0091",
    credentialUrl: "https://devfolio.co",
    imageUrl: "",
    skills: ["Smart Contracts", "Python Agents", "Tailwind CSS", "IPFS", "Zero Knowledge Proofs"],
    description: "Built 'TrustProof AI', an autonomous agent verifying provenance and code reproducibility for academic preprints, awarded Best Technical Execution.",
    featured: true,
    is_visible: true
  },
  {
    id: "comp-icpc",
    title: "ACM ICPC Regional Contest – Top 15 Finalist",
    issuer: "International Collegiate Programming Contest",
    issuerLogo: "fa-solid fa-code-fork",
    issuerColor: "text-amber-700 bg-amber-50 border-amber-200",
    category: "competitions",
    date: "Nov 2024",
    expires: "Lifetime Honor",
    verificationId: "ICPC-REG-2024-819",
    credentialUrl: "https://icpc.global",
    imageUrl: "",
    skills: ["Advanced Algorithms", "Dynamic Programming", "Graph Theory", "C++20", "Problem Solving"],
    description: "Qualified through preliminary rounds to compete in the on-site regional finals, solving complex algorithmic challenges under strict time constraints.",
    featured: true,
    is_visible: true
  },
  {
    id: "hr-5star",
    title: "HackerRank 5-Star Problem Solving & Gold Badges",
    issuer: "HackerRank",
    issuerLogo: "fa-brands fa-hackerrank",
    issuerColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    category: "competitions",
    date: "Sep 2024",
    expires: "Verified",
    verificationId: "HR-GOLD-ALGO-289",
    credentialUrl: "https://www.hackerrank.com",
    imageUrl: "",
    skills: ["Data Structures", "Algorithms", "Python 3", "SQL Queries", "Time Complexity Optimization"],
    description: "Earned 5-Star Gold Badges in both Algorithms and Problem Solving with 100% test case pass rates across arrays, trees, and dynamic programming.",
    featured: false,
    is_visible: true
  },
  {
    id: "honor-dean",
    title: "Dean's Academic Excellence Award (Rank 1 / 180)",
    issuer: "Faculty of Engineering & Technology",
    issuerLogo: "fa-solid fa-graduation-cap",
    issuerColor: "text-blue-700 bg-blue-50 border-blue-200",
    category: "honors",
    date: "Jul 2024",
    expires: "Annual Honor",
    verificationId: "ACAD-HONOR-2024-001",
    credentialUrl: "#",
    imageUrl: "",
    skills: ["Computer Science", "Database Engineering", "Operating Systems", "Discrete Mathematics"],
    description: "Recognized for maintaining consecutive 9.6/10.0 CGPA and exemplary performance in undergraduate computer science coursework and laboratory projects.",
    featured: false,
    is_visible: true
  }
];

const DEFAULT_PROJECTS = [
  {
    id: "nexus-engine",
    title: "NexusEngine: Distributed Event Ingestion",
    category: "backend",
    badgeLabel: "Distributed Event Ingestion",
    description: "High-throughput asynchronous telemetry ingestion pipeline capable of sustaining 14,000+ events/sec with sub-20ms p99 query latency. Features PgBouncer connection pooling, Redis distributed lock invalidation, and Docker Compose orchestration.",
    skills: ["Python 3.12", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    githubUrl: "https://github.com/aruldavid/nexus-engine",
    liveUrl: "https://nexus-demo.aruldavid.dev",
    imageUrl: "",
    stars: 342,
    forks: 58,
    branch: "main",
    featured: true,
    is_visible: true,
    metrics: {
      tps: "14.2k ops/s",
      latency: "18.4 ms",
      uptime: "99.98%"
    }
  },
  {
    id: "clean-dotnet",
    title: "CleanArchitecture.NET 8",
    category: "backend",
    badgeLabel: "Microservices Template",
    description: "Enterprise boilerplate featuring CQRS pattern via MediatR, FluentValidation, Entity Framework Core with SQL Server, JWT authentication, and Swagger OpenAPI generation.",
    skills: ["C# .NET 8", "EF Core", "SQL Server", "Docker"],
    githubUrl: "https://github.com/aruldavid/clean-architecture-dotnet",
    liveUrl: "https://github.com/aruldavid/clean-architecture-dotnet",
    imageUrl: "",
    stars: 184,
    forks: 32,
    branch: "main",
    featured: false,
    is_visible: true,
    metrics: {}
  },
  {
    id: "trustproof-ai",
    title: "TrustProof AI Scholar",
    category: "ai-dsa",
    badgeLabel: "Hackathon Winner (1st Place)",
    description: "Autonomous verification agent cross-referencing preprint claims with computational code reproducibility and citation graph integrity. Built with Python and FastAPI.",
    skills: ["Python", "FastAPI", "Tailwind CSS", "Zero-Knowledge"],
    githubUrl: "https://github.com/aruldavid/trustproof-ai",
    liveUrl: "https://trustproof-demo.aruldavid.dev",
    imageUrl: "",
    stars: 129,
    forks: 21,
    branch: "main",
    featured: false,
    is_visible: true,
    metrics: {}
  },
  {
    id: "cloudpulse",
    title: "CloudPulse Dashboard",
    category: "fullstack",
    badgeLabel: "Full-Stack • Real-Time UI",
    description: "Clean responsive real-time monitoring dashboard with WebSockets live telemetry streaming and interactive charts styled with Tailwind CSS.",
    skills: ["Tailwind CSS", "Vanilla JS", "WebSockets", "Chart.js"],
    githubUrl: "https://github.com/aruldavid/cloudpulse-dashboard",
    liveUrl: "https://cloudpulse.aruldavid.dev",
    imageUrl: "",
    stars: 96,
    forks: 14,
    branch: "main",
    featured: false,
    is_visible: true,
    metrics: {}
  },
  {
    id: "smart-dispatch",
    title: "SmartDispatch GIS Router",
    category: "ai-dsa",
    badgeLabel: "Algorithmic Optimization",
    description: "Dynamic shortest-path calculation engine for emergency services under real-time traffic road network graphs using Dijkstra and A* heuristics in C++ & Python.",
    skills: ["C++20", "Graph DSA", "PostGIS", "FastAPI"],
    githubUrl: "https://github.com/aruldavid/smart-dispatch-gis",
    liveUrl: "https://github.com/aruldavid/smart-dispatch-gis",
    imageUrl: "",
    stars: 112,
    forks: 19,
    branch: "main",
    featured: false,
    is_visible: true,
    metrics: {}
  },
  {
    id: "algo-codex",
    title: "The Algorithmic Codex: LeetCode & HackerRank",
    category: "ai-dsa",
    badgeLabel: "Competitive Programming",
    description: "Open-source repository containing rigorously documented algorithmic solutions across Dynamic Programming, Graph Theory, Segment Trees, Bit Manipulation, and Concurrency in Python, C++, and Java with mathematical complexity proofs.",
    skills: ["Dynamic Programming", "Graphs", "Trees", "Bitmask", "C++"],
    githubUrl: "https://github.com/aruldavid/algorithmic-codex",
    liveUrl: "https://github.com/aruldavid/algorithmic-codex",
    imageUrl: "",
    stars: 420,
    forks: 85,
    branch: "main",
    featured: true,
    is_visible: true,
    metrics: {}
  }
];

const DEFAULT_PROFILE = {
  name: "Arul David",
  title: "Software Engineer",
  headline: "Architecting Scalable Cloud Systems & Modern Web Applications",
  bio: "I specialize in building performant backend services, resilient distributed databases, and responsive web experiences using Python, Java, C#, ASP.NET Core, SQL, and Tailwind CSS.",
  location: "Bengaluru, India",
  email: "aruldavid.dev@gmail.com",
  status: "Open to Opportunities",
  year: "2026",
  cgpa: "9.6 / 10.0"
};

const DEFAULT_SKILLS = {
  languages: [
    { name: "Python", mastery: 95, exp: "4+ Years", tags: ["FastAPI", "AsyncIO", "PyTest"], icon: "fa-brands fa-python", color: "text-amber-700 bg-amber-50" },
    { name: "Java", mastery: 90, exp: "3+ Years", tags: ["Spring Boot", "JVM", "JUnit 5"], icon: "fa-brands fa-java", color: "text-rose-700 bg-rose-50" },
    { name: "C#", mastery: 92, exp: "3+ Years", tags: ["ASP.NET Core", "EF Core", "LINQ"], icon: "fa-solid fa-code", color: "text-purple-700 bg-purple-50" },
    { name: "SQL", mastery: 94, exp: "3+ Years", tags: ["PostgreSQL", "T-SQL", "MySQL"], icon: "fa-solid fa-database", color: "text-blue-700 bg-blue-50" }
  ],
  webDb: [
    { name: "HTML5 / CSS3", mastery: 96, tags: ["Semantic", "a11y", "CSS Grid"], icon: "fa-brands fa-html5" },
    { name: "Tailwind CSS", mastery: 98, tags: ["SaaS Layouts", "Responsive"], icon: "fa-solid fa-wind" },
    { name: "ASP.NET Core", mastery: 91, tags: ["Web API", "EF Core"], icon: "fa-solid fa-server" },
    { name: "RDBMS & Cloud DBs", mastery: 93, tags: ["Postgres", "Redis"], icon: "fa-solid fa-hard-drive" }
  ],
  coreDsa: [
    { name: "Data Structures & Algorithms", desc: "Graphs, Dynamic Programming, Segment Trees, Heaps (850+ Solved)", icon: "fa-solid fa-network-wired" },
    { name: "System Architecture & OOP", desc: "Microservices, Distributed Caching, SOLID Principles", icon: "fa-solid fa-cubes" },
    { name: "Cloud Infrastructure & DevOps", desc: "AWS & GCP Dual Certified, Docker & CI/CD Pipelines", icon: "fa-solid fa-cloud-arrow-up" }
  ]
};

/**
 * Main PortfolioStore API
 */
const PortfolioStore = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  isAuthenticated() {
    return localStorage.getItem(STORE_KEYS.AUTH) === 'true';
  },

  login(passkey) {
    if (passkey === 'admin123') {
      localStorage.setItem(STORE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(STORE_KEYS.AUTH);
  },

  // ==========================================
  // ACHIEVEMENTS CRUD
  // ==========================================
  async getAchievements(onlyVisible = true) {
    // 1. Try Supabase cloud fetch first if available
    if (window.supabaseClient) {
      try {
        let query = window.supabaseClient.from('achievements').select('*').order('created_at', { ascending: false });
        if (onlyVisible) query = query.eq('is_visible', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          // Sync into localStorage
          localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn("Supabase fetch fallback to local store:", e);
      }
    }

    // 2. Read from localStorage
    const raw = localStorage.getItem(STORE_KEYS.ACHIEVEMENTS);
    let list = raw ? JSON.parse(raw) : DEFAULT_ACHIEVEMENTS;
    if (!raw) {
      localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
    }

    if (onlyVisible) {
      return list.filter(item => item.is_visible !== false);
    }
    return list;
  },

  async addAchievement(item) {
    item.id = item.id || `ach-${Date.now()}`;
    if (item.is_visible === undefined) item.is_visible = true;
    if (typeof item.skills === 'string') {
      item.skills = item.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Cloud insert
    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('achievements').insert([item]);
      } catch (e) {
        console.warn("Supabase insert error:", e);
      }
    }

    // Local insert
    const list = await this.getAchievements(false);
    list.unshift(item);
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(list));
    return item;
  },

  async updateAchievement(id, updates) {
    if (typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Cloud update
    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('achievements').update(updates).eq('id', id);
      } catch (e) {
        console.warn("Supabase update error:", e);
      }
    }

    // Local update
    const list = await this.getAchievements(false);
    const index = list.findIndex(a => a.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  async deleteAchievement(id) {
    // Cloud delete
    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('achievements').delete().eq('id', id);
      } catch (e) {
        console.warn("Supabase delete error:", e);
      }
    }

    // Local delete
    const list = await this.getAchievements(false);
    const filtered = list.filter(a => a.id !== id);
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(filtered));
    return true;
  },

  async toggleAchievementVisibility(id) {
    const list = await this.getAchievements(false);
    const item = list.find(a => a.id === id);
    if (item) {
      const newStatus = !item.is_visible;
      return await this.updateAchievement(id, { is_visible: newStatus });
    }
    return null;
  },

  async purgeSampleAchievements() {
    // Completely wipe all placeholder items
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify([]));
    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('achievements').delete().neq('id', 'keep_none');
      } catch (e) {
        console.warn(e);
      }
    }
    return true;
  },

  resetAchievementsToDefault() {
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
    return DEFAULT_ACHIEVEMENTS;
  },

  // ==========================================
  // PROJECTS CRUD
  // ==========================================
  async getProjects(onlyVisible = true) {
    if (window.supabaseClient) {
      try {
        let query = window.supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
        if (onlyVisible) query = query.eq('is_visible', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          localStorage.setItem(STORE_KEYS.PROJECTS, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn("Supabase projects fetch error:", e);
      }
    }

    const raw = localStorage.getItem(STORE_KEYS.PROJECTS);
    let list = raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
    if (!raw) {
      localStorage.setItem(STORE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    }

    if (onlyVisible) {
      return list.filter(item => item.is_visible !== false);
    }
    return list;
  },

  async addProject(project) {
    project.id = project.id || `proj-${Date.now()}`;
    if (project.is_visible === undefined) project.is_visible = true;
    if (typeof project.skills === 'string') {
      project.skills = project.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('projects').insert([project]);
      } catch (e) {
        console.warn(e);
      }
    }

    const list = await this.getProjects(false);
    list.unshift(project);
    localStorage.setItem(STORE_KEYS.PROJECTS, JSON.stringify(list));
    return project;
  },

  async updateProject(id, updates) {
    if (typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('projects').update(updates).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }

    const list = await this.getProjects(false);
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(STORE_KEYS.PROJECTS, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  async deleteProject(id) {
    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('projects').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }

    const list = await this.getProjects(false);
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem(STORE_KEYS.PROJECTS, JSON.stringify(filtered));
    return true;
  },

  async toggleProjectVisibility(id) {
    const list = await this.getProjects(false);
    const item = list.find(p => p.id === id);
    if (item) {
      const newStatus = !item.is_visible;
      return await this.updateProject(id, { is_visible: newStatus });
    }
    return null;
  },

  async purgeSampleProjects() {
    localStorage.setItem(STORE_KEYS.PROJECTS, JSON.stringify([]));
    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('projects').delete().neq('id', 'keep_none');
      } catch (e) {
        console.warn(e);
      }
    }
    return true;
  },

  resetProjectsToDefault() {
    localStorage.setItem(STORE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  },

  // ==========================================
  // PROFILE & SKILLS
  // ==========================================
  getProfile() {
    const raw = localStorage.getItem(STORE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  },

  updateProfile(updates) {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  getSkills() {
    const raw = localStorage.getItem(STORE_KEYS.SKILLS);
    if (!raw) {
      localStorage.setItem(STORE_KEYS.SKILLS, JSON.stringify(DEFAULT_SKILLS));
      return DEFAULT_SKILLS;
    }
    return JSON.parse(raw);
  },

  updateSkills(skillsData) {
    localStorage.setItem(STORE_KEYS.SKILLS, JSON.stringify(skillsData));
    return skillsData;
  }
};

window.PortfolioStore = PortfolioStore;

