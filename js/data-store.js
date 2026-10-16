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
  SITE_PROFILE: 'portfolio_site_profile_v1',
  SKILLS: 'portfolio_skills_v2',
  AUTH: 'portfolio_admin_auth',
  AUTH_SESSION: 'portfolio_admin_session_v3',
  ADMIN_EMAIL: 'portfolio_admin_email_key'
};

// Default Seed Data for Initial Load - Clean zero mock items so visitors only see authentic uploaded certificates & media
const DEFAULT_ACHIEVEMENTS = [];

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

const DEFAULT_SITE_PROFILE = {
  id: "main_profile",
  full_name: "ARULDAVID A",
  headline_badge: "MCA Postgraduate Scholar",
  degree_title: "Master of Computer Applications (MCA)",
  college_name: "PSG College of Arts and Science • Coimbatore",
  bio_summary: "Dedicated postgraduate scholar with a focused pursuit in computational problem-solving, algorithm optimization, and clean software architecture. Driven by building robust database systems, authoring maintainable production code, and demonstrating collaborative technical leadership across academic and real-world initiatives.",
  core_skills: ["Python", "Java", "C#", "SQL & Relational Databases", "Supabase", "Data Structures"],
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  email: "aruld3963@gmail.com",
  phone: "+91 8610471539",
  resume_url: "assets/resume.pdf",
  avatar_url: "assets/profile.png",
  education_journey: [
    {
      id: "edu-1",
      level: "Postgraduate (MCA)",
      institution: "PSG College of Arts and Science • Coimbatore",
      year: "2024 — 2026",
      details: "Specializing in Advanced Data Structures, Cloud Computing, Database Engineering, and High-Performance Software Systems.",
      isVisible: true
    },
    {
      id: "edu-2",
      level: "Undergraduate (B.Sc. CS)",
      institution: "PSG College of Arts and Science • Coimbatore",
      year: "2021 — 2024",
      details: "Graduated with Distinction (First Class with Exemplary). Core focus on Object-Oriented Programming, Database Systems, and Algorithms.",
      isVisible: true
    },
    {
      id: "edu-3",
      level: "Higher Secondary (HSC)",
      institution: "State Board of Higher Secondary Education",
      year: "2020 — 2021",
      details: "Computer Science, Mathematics, Physics, and Chemistry. Completed with high academic distinction.",
      isVisible: true
    }
  ],
  is_badge_visible: true,
  updated_at: new Date().toISOString()
};

const DEFAULT_PROFILE = {
  name: "Arul David",
  title: "Software Engineer",
  headline: "Architecting Scalable Cloud Systems & Modern Web Applications",
  bio: "I specialize in building performant backend services, resilient distributed databases, and responsive web experiences using Python, Java, C#, ASP.NET Core, SQL, and Tailwind CSS.",
  location: "Bengaluru, India",
  email: "aruld3963@gmail.com",
  phone: "+91 8610471539",
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
 * Web Crypto SHA-256 Hashing for Secure Admin Authentication
 * Generates salted SHA-256 hashes inside browser - plain-text passwords never stored.
 */
async function hashAdminPassword(password, salt = 'agy_auth_salt_2026') {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '::' + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateRandomToken(bytes = 32) {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Main PortfolioStore API
 */
const PortfolioStore = {
  // ==========================================
  // ENHANCED ADMIN AUTHENTICATION & PASSWORD RESET
  // ==========================================
  
  isAuthenticated() {
    // 1. Check for active Supabase Auth token
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            const val = localStorage.getItem(key);
            if (val && val.includes('access_token')) {
              const parsed = JSON.parse(val);
              if (parsed && parsed.access_token) return true;
            }
          }
        }
      } catch (e) {}
    }

    // 2. Check for active cryptographically generated session in sessionStorage
    try {
      const raw = sessionStorage.getItem(STORE_KEYS.AUTH_SESSION);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.token && session.expiresAt && session.expiresAt > Date.now()) {
          return true;
        }
      }
    } catch (e) {}

    return false;
  },

  async verifySession() {
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        const { data } = await window.supabaseClient.auth.getSession();
        if (data && data.session) return true;
      } catch (e) {}
    }

    try {
      const raw = sessionStorage.getItem(STORE_KEYS.AUTH_SESSION);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.token && session.expiresAt > Date.now()) {
          return true;
        }
      }
    } catch (e) {}

    sessionStorage.removeItem(STORE_KEYS.AUTH_SESSION);
    return false;
  },

  async login(email, password) {
    if (!password || !password.trim()) {
      return { success: false, message: 'Password is required.' };
    }

    const cleanEmail = (email && email.trim()) ? email.trim().toLowerCase() : 'aruld3963@gmail.com';
    const cleanPassword = password.trim();

    // 1. Try Official Supabase Authentication first
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (!error && data && data.session) {
          const sessionData = {
            token: data.session.access_token,
            email: data.user.email,
            userId: data.user.id,
            expiresAt: (data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 24 * 3600 * 1000),
            method: 'supabase_auth'
          };
          sessionStorage.setItem(STORE_KEYS.AUTH_SESSION, JSON.stringify(sessionData));
          return { success: true, method: 'supabase_auth', user: data.user };
        } else if (error) {
          console.log("Supabase Auth notice:", error.message);
        }
      } catch (e) {
        console.warn("Supabase Auth signIn attempt error:", e);
      }
    }

    // 2. Try Dedicated 'admin_auth' Supabase Table with SHA-256 Hashed Check
    if (window.supabaseClient) {
      try {
        const { data: record, error } = await window.supabaseClient
          .from('admin_auth')
          .select('*')
          .eq('id', 'master_admin')
          .single();

        if (!error && record && record.password_hash) {
          const salt = record.salt || 'agy_auth_salt_2026';
          const computedHash = await hashAdminPassword(cleanPassword, salt);

          if (computedHash === record.password_hash) {
            const sessionToken = generateRandomToken(32);
            const sessionData = {
              token: sessionToken,
              email: record.email || cleanEmail,
              created: Date.now(),
              expiresAt: Date.now() + 24 * 3600 * 1000,
              method: 'admin_auth_hash'
            };
            sessionStorage.setItem(STORE_KEYS.AUTH_SESSION, JSON.stringify(sessionData));
            return { success: true, method: 'admin_auth_hash' };
          } else {
            return { success: false, message: 'Incorrect administrator password.' };
          }
        } else if (error && (error.code === 'PGRST116' || error.message?.includes('0 rows'))) {
          // Table exists but no master password record is created yet
          return { 
            success: false, 
            setupRequired: true, 
            message: 'No administrator password has been set yet. Please complete initial setup.' 
          };
        }
      } catch (e) {
        console.warn("admin_auth table check notice:", e);
      }
    }

    // 3. Fallback: Check local secure hashed credential if offline
    try {
      const localHash = localStorage.getItem('portfolio_admin_pwd_hash');
      const localSalt = localStorage.getItem('portfolio_admin_pwd_salt') || 'agy_auth_salt_2026';

      if (localHash) {
        const computed = await hashAdminPassword(cleanPassword, localSalt);
        if (computed === localHash) {
          const sessionToken = generateRandomToken(32);
          sessionStorage.setItem(STORE_KEYS.AUTH_SESSION, JSON.stringify({
            token: sessionToken,
            email: cleanEmail,
            expiresAt: Date.now() + 24 * 3600 * 1000,
            method: 'local_hash'
          }));
          return { success: true, method: 'local_hash' };
        }
        return { success: false, message: 'Incorrect administrator password.' };
      }
    } catch (e) {}

    // First time setup required
    return { 
      success: false, 
      setupRequired: true, 
      message: 'Initial Security Setup: No password configured yet. Please set your strong private password.' 
    };
  },

  async logout() {
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        await window.supabaseClient.auth.signOut();
      } catch (e) {}
    }
    sessionStorage.removeItem(STORE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORE_KEYS.AUTH);
    return true;
  },

  async setInitialPassword(email, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const cleanEmail = (email && email.trim()) ? email.trim().toLowerCase() : 'aruld3963@gmail.com';
    const salt = generateRandomToken(16);
    const passwordHash = await hashAdminPassword(newPassword.trim(), salt);

    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('admin_auth')
          .upsert({
            id: 'master_admin',
            email: cleanEmail,
            password_hash: passwordHash,
            salt: salt,
            updated_at: new Date().toISOString()
          });
      } catch (e) {
        console.warn("setInitialPassword cloud error:", e);
      }
    }

    localStorage.setItem('portfolio_admin_pwd_hash', passwordHash);
    localStorage.setItem('portfolio_admin_pwd_salt', salt);
    localStorage.setItem('portfolio_admin_email', cleanEmail);

    return { success: true, message: 'Master administrator password configured securely!' };
  },

  async requestPasswordReset(email) {
    const targetEmail = (email && email.trim()) ? email.trim().toLowerCase() : 'aruld3963@gmail.com';

    // 1. Try Supabase Auth reset password link
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        await window.supabaseClient.auth.resetPasswordForEmail(targetEmail, {
          redirectTo: window.location.origin + window.location.pathname.replace('admin.html', 'admin-login.html') + '?mode=reset'
        });
      } catch (e) {}
    }

    // 2. Generate a 6-digit OTP code stored in admin_auth table
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('admin_auth')
          .upsert({
            id: 'master_admin',
            email: targetEmail,
            reset_token: otpCode,
            reset_expires: expiresAt,
            updated_at: new Date().toISOString()
          });
      } catch (e) {
        console.warn("OTP save error:", e);
      }
    }

    localStorage.setItem('portfolio_admin_reset_otp', otpCode);
    localStorage.setItem('portfolio_admin_reset_expires', expiresAt);

    // 3. Automated dispatch to aruld3963@gmail.com via Web3Forms
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '56658dfa-45c5-4d7d-b570-384c55d0458e',
          to_email: 'aruld3963@gmail.com',
          from_name: 'Portfolio Admin Security System',
          subject: 'Admin Password Reset OTP Code: ' + otpCode,
          message: `Hello Aruldavid,\n\nA password reset was requested for your portfolio admin dashboard.\n\nYour 6-Digit Verification OTP is: ${otpCode}\n\nThis code will expire in 15 minutes. If you did not initiate this request, you can safely ignore this email.`
        })
      }).catch(() => {});
    } catch (e) {}

    return { 
      success: true, 
      message: `Password reset instructions and 6-digit OTP have been dispatched to ${targetEmail}.`,
      demoOtp: otpCode
    };
  },

  async verifyOtpAndResetPassword(email, otp, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const cleanEmail = (email && email.trim()) ? email.trim().toLowerCase() : 'aruld3963@gmail.com';
    const cleanOtp = (otp && otp.trim()) ? otp.trim() : '';

    let isValid = false;

    // Check against Supabase admin_auth table
    if (window.supabaseClient) {
      try {
        const { data: record, error } = await window.supabaseClient
          .from('admin_auth')
          .select('*')
          .eq('id', 'master_admin')
          .single();

        if (!error && record && record.reset_token) {
          const isNotExpired = !record.reset_expires || new Date(record.reset_expires) > new Date();
          if (record.reset_token === cleanOtp && isNotExpired) {
            isValid = true;
          }
        }
      } catch (e) {}
    }

    // Fallback: Check local reset token
    if (!isValid) {
      const localOtp = localStorage.getItem('portfolio_admin_reset_otp');
      const localExp = localStorage.getItem('portfolio_admin_reset_expires');
      if (localOtp && localOtp === cleanOtp && (!localExp || new Date(localExp) > new Date())) {
        isValid = true;
      }
    }

    if (!isValid) {
      return { success: false, message: 'Invalid or expired OTP code. Please request a new code.' };
    }

    const salt = generateRandomToken(16);
    const passwordHash = await hashAdminPassword(newPassword.trim(), salt);

    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('admin_auth')
          .upsert({
            id: 'master_admin',
            email: cleanEmail,
            password_hash: passwordHash,
            salt: salt,
            reset_token: null,
            reset_expires: null,
            updated_at: new Date().toISOString()
          });

        if (window.supabaseClient.auth) {
          try {
            await window.supabaseClient.auth.updateUser({ password: newPassword.trim() });
          } catch (e) {}
        }
      } catch (e) {
        console.warn("Password reset error in cloud:", e);
      }
    }

    localStorage.setItem('portfolio_admin_pwd_hash', passwordHash);
    localStorage.setItem('portfolio_admin_pwd_salt', salt);
    localStorage.removeItem('portfolio_admin_reset_otp');
    localStorage.removeItem('portfolio_admin_reset_expires');

    return { success: true, message: 'Master password has been reset successfully! You can now log in.' };
  },

  // ==========================================
  // ACHIEVEMENTS CRUD
  // ==========================================
  // ==========================================
  // ACHIEVEMENTS CRUD (SUPABASE LIVE + CACHE)
  // ==========================================
  async getAchievements(onlyVisible = true) {
    const mockIds = ['aws-saa', 'gcp-cdl', 'hack-sih', 'ms-az900', 'meta-frontend', 'contest-leetcode', 'contest-hackerrank', 'honor-deans', 'pub-ieee'];

    // 1. Live Supabase fetch
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient.from('achievements').select('*');
        if (!error && Array.isArray(data)) {
          // Rule Active: Filter out mock placeholders, all authentic uploaded certificates are 100% visible
          const authenticItems = data.filter(item => !mockIds.includes(item.id));
          const normalized = authenticItems.map(item => ({
            ...item,
            credentialUrl: item.credential_link || item.credentialUrl || '#',
            imageUrl: item.image_url || item.imageUrl || '',
            verificationId: item.verificationId || (item.id ? `CRED-${item.id}` : 'VERIFIED'),
            is_visible: true
          }));
          localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(normalized));
          return normalized;
        } else if (error) {
          console.warn("Supabase query returned error:", error.message || error);
        }
      } catch (e) {
        console.warn("Supabase fetch exception:", e);
      }
    }

    // 2. Read from localStorage cache (if offline)
    const raw = localStorage.getItem(STORE_KEYS.ACHIEVEMENTS);
    if (raw) {
      try {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          return list
            .filter(item => !mockIds.includes(item.id))
            .map(item => ({ ...item, is_visible: true }));
        }
      } catch (e) {}
    }

    // Default clean state: no mock certificates
    return [];
  },

  async addAchievement(item) {
    // New rule: ALL uploaded certificates and media are visible to all visitors on public site
    const generatedId = item.id || `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    item.id = generatedId;

    // Strict Supabase fields mapping with explicit primary key id
    const supabasePayload = {
      id: generatedId,
      title: item.title || '',
      category: item.category || 'certifications',
      issuer: item.issuer || '',
      date: item.date || '',
      credential_link: item.credential_link || item.credentialUrl || '',
      image_url: item.image_url || item.imageUrl || '',
      is_visible: true
    };

    let createdId = generatedId;

    // Cloud insert to Supabase 'achievements' table
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('achievements')
          .insert([supabasePayload])
          .select();

        if (error) {
          console.error("Supabase insert error:", error);
        } else if (data && data[0]) {
          createdId = data[0].id || createdId;
          supabasePayload.id = createdId;
        }
      } catch (e) {
        console.warn("Supabase cloud insert error:", e);
      }
    }

    // Local sync
    const finalItem = {
      ...supabasePayload,
      id: createdId,
      credentialUrl: supabasePayload.credential_link,
      imageUrl: supabasePayload.image_url,
      verificationId: `CRED-${createdId}`,
      is_visible: true
    };

    const list = await this.getAchievements(false);
    list.unshift(finalItem);
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(list));
    return finalItem;
  },

  async updateAchievement(id, updates) {
    const updatePayload = { ...updates, is_visible: true };
    if (updates.credential_link !== undefined) updatePayload.credential_link = updates.credential_link;
    if (updates.credentialUrl !== undefined && !updates.credential_link) updatePayload.credential_link = updates.credentialUrl;
    if (updates.image_url !== undefined) updatePayload.image_url = updates.image_url;
    if (updates.imageUrl !== undefined && !updates.image_url) updatePayload.image_url = updates.imageUrl;

    // Cloud update in Supabase
    if (window.supabaseClient) {
      try {
        const { error } = await window.supabaseClient
          .from('achievements')
          .update(updatePayload)
          .eq('id', id);

        if (error) console.error("Supabase update error:", error);
      } catch (e) {
        console.warn("Supabase update error:", e);
      }
    }

    // Local update
    const list = await this.getAchievements(false);
    const index = list.findIndex(a => a.id == id);
    if (index !== -1) {
      list[index] = { 
        ...list[index], 
        ...updates,
        is_visible: true,
        credentialUrl: updatePayload.credential_link || list[index].credentialUrl,
        imageUrl: updatePayload.image_url || list[index].imageUrl
      };
      localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  async deleteAchievement(id) {
    // Cloud delete from Supabase
    if (window.supabaseClient) {
      try {
        const { error } = await window.supabaseClient
          .from('achievements')
          .delete()
          .eq('id', id);

        if (error) console.error("Supabase delete error:", error);
      } catch (e) {
        console.warn("Supabase delete error:", e);
      }
    }

    // Local delete
    const list = await this.getAchievements(false);
    const filtered = list.filter(a => a.id != id);
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(filtered));
    return true;
  },

  async toggleAchievementVisibility(id) {
    // Under the new rule, enforce that all authentic uploaded certificates are 100% visible
    return await this.updateAchievement(id, { is_visible: true });
  },

  async purgeSampleAchievements() {
    const mockIds = ['aws-saa', 'gcp-cdl', 'hack-sih', 'ms-az900', 'meta-frontend', 'contest-leetcode', 'contest-hackerrank', 'honor-deans', 'pub-ieee'];
    // Remove mock items from cache
    const current = await this.getAchievements(false);
    const filtered = current.filter(item => !mockIds.includes(item.id));
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(filtered));

    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('achievements').delete().in('id', mockIds);
      } catch (e) {
        console.warn(e);
      }
    }
    return true;
  },

  resetAchievementsToDefault() {
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify([]));
    return [];
  },

  // ==========================================
  // PROJECTS CRUD
  // ==========================================
  async getProjects(onlyVisible = true) {
    if (window.supabaseClient) {
      try {
        let query = window.supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          const visibleProjects = data.map(p => ({ ...p, is_visible: true }));
          localStorage.setItem(STORE_KEYS.PROJECTS, JSON.stringify(visibleProjects));
          return visibleProjects;
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

    return list.map(p => ({ ...p, is_visible: true }));
  },

  async addProject(project) {
    project.id = project.id || `proj-${Date.now()}`;
    project.is_visible = true;
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
    const updatePayload = { ...updates, is_visible: true };

    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('projects').update(updatePayload).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }

    const list = await this.getProjects(false);
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatePayload };
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
    return await this.updateProject(id, { is_visible: true });
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
  // PROFILE & SKILLS (LEGACY COMPATIBILITY)
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
  },

  // ==========================================
  // SITE PROFILE & CMS (SUPABASE LIVE + CACHE)
  // ==========================================
  async getSiteProfile() {
    // 1. Try Live Supabase fetch
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('site_profile')
          .select('*')
          .eq('id', 'main_profile')
          .maybeSingle();

        if (!error && data && data.full_name) {
          localStorage.setItem(STORE_KEYS.SITE_PROFILE, JSON.stringify(data));
          return data;
        } else if (error) {
          console.warn("Supabase site_profile fetch notice (table may need creation):", error.message || error);
        }
      } catch (err) {
        console.warn("Supabase site_profile connection notice:", err);
      }
    }

    // 2. Fallback to LocalStorage cache
    const raw = localStorage.getItem(STORE_KEYS.SITE_PROFILE);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn("Error parsing cached site_profile:", e);
      }
    }

    // 3. Fallback to Default Seed Profile
    localStorage.setItem(STORE_KEYS.SITE_PROFILE, JSON.stringify(DEFAULT_SITE_PROFILE));
    return DEFAULT_SITE_PROFILE;
  },

  async saveSiteProfile(profileData) {
    const payload = {
      ...DEFAULT_SITE_PROFILE,
      ...profileData,
      id: 'main_profile',
      updated_at: new Date().toISOString()
    };

    if (typeof payload.core_skills === 'string') {
      payload.core_skills = payload.core_skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof payload.education_journey === 'string') {
      try {
        payload.education_journey = JSON.parse(payload.education_journey);
      } catch (e) {
        payload.education_journey = [];
      }
    }

    // 1. Live Supabase Upsert
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('site_profile')
          .upsert(payload, { onConflict: 'id' });

        if (error) {
          console.warn("Supabase site_profile upsert error:", error.message || error);
        } else {
          console.log("⚡ site_profile saved to Supabase successfully.");
        }
      } catch (err) {
        console.warn("Supabase site_profile upsert exception:", err);
      }
    }

    // 2. Update LocalStorage cache
    localStorage.setItem(STORE_KEYS.SITE_PROFILE, JSON.stringify(payload));
    return payload;
  },

  async resetSiteProfileToDefault() {
    return await this.saveSiteProfile(DEFAULT_SITE_PROFILE);
  }
};

window.PortfolioStore = PortfolioStore;

