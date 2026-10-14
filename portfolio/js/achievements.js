/**
 * ============================================================================
 * ACHIEVEMENTS MODULE (js/achievements.js)
 * Clean Light SaaS Theme: Dynamic data rendering, category filters, search,
 * and credential verification modal. Ready for Supabase.
 * ============================================================================
 */

// Local JSON dataset for credentials, hackathons, and competitions
const ACHIEVEMENTS_DATA = [
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
    skills: ["Cloud Architecture", "VPC & Networking", "S3 & DynamoDB", "High Availability", "IAM Security"],
    description: "Validated comprehensive expertise in designing resilient, high-performing, secure, and cost-optimized distributed systems on AWS.",
    featured: true
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
    skills: ["Google Kubernetes Engine", "BigQuery", "Compute Engine", "Cloud IAM", "Cloud Storage"],
    description: "Demonstrated proficiency in deploying applications, monitoring operations, and managing enterprise cloud infrastructure on GCP.",
    featured: true
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
    skills: ["Distributed Systems", "FastAPI", "React", "PostgreSQL", "Real-time Telemetry"],
    description: "Engineered an AI-driven disaster response dispatch coordination system in a 36-hour non-stop national collegiate hackathon competing against 1,200+ teams.",
    featured: true
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
    skills: ["Azure Cloud", "Virtual Machines", "Azure SQL", "Compliance & Governance"],
    description: "Mastered cloud concepts, Azure architecture components, core Azure services, management tools, and enterprise security frameworks.",
    featured: false
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
    skills: ["React.js", "JavaScript ES6+", "UI/UX Systems", "Tailwind CSS", "Jest Unit Testing"],
    description: "Comprehensive 9-course specialization covering modern frontend engineering, component design patterns, accessibility, and client-side performance.",
    featured: false
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
    skills: ["Smart Contracts", "Python Agents", "Tailwind CSS", "IPFS", "Zero Knowledge Proofs"],
    description: "Built 'TrustProof AI', an autonomous agent verifying provenance and code reproducibility for academic preprints, awarded Best Technical Execution.",
    featured: true
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
    skills: ["Advanced Algorithms", "Dynamic Programming", "Graph Theory", "C++20", "Problem Solving"],
    description: "Qualified through preliminary rounds to compete in the on-site regional finals, solving complex algorithmic challenges under strict time constraints.",
    featured: true
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
    skills: ["Data Structures", "Algorithms", "Python 3", "SQL Queries", "Time Complexity Optimization"],
    description: "Earned 5-Star Gold Badges in both Algorithms and Problem Solving with 100% test case pass rates across arrays, trees, and dynamic programming.",
    featured: false
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
    skills: ["Computer Science", "Database Engineering", "Operating Systems", "Discrete Mathematics"],
    description: "Recognized for maintaining consecutive 9.6/10.0 CGPA and exemplary performance in undergraduate computer science coursework and laboratory projects.",
    featured: false
  }
];

async function getAchievementsData() {
  if (window.supabaseClient) {
    try {
      const { data, error } = await window.supabaseClient.from('achievements').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn("Using local achievements dataset:", e);
    }
  }
  return ACHIEVEMENTS_DATA;
}

// Runtime State
let activeCategory = 'all';
let currentSearchQuery = '';
let allAchievements = [];

document.addEventListener('DOMContentLoaded', async () => {
  allAchievements = await getAchievementsData();
  renderAchievements();
  initFilterTabs();
  initSearchInput();
  initCredentialModal();
  updateCategoryCounts();
});

function updateCategoryCounts() {
  const counts = {
    all: allAchievements.length,
    certifications: allAchievements.filter(a => a.category === 'certifications').length,
    hackathons: allAchievements.filter(a => a.category === 'hackathons').length,
    competitions: allAchievements.filter(a => a.category === 'competitions').length,
    honors: allAchievements.filter(a => a.category === 'honors').length
  };

  for (const [cat, count] of Object.entries(counts)) {
    const badge = document.querySelector(`[data-count-cat="${cat}"]`);
    if (badge) badge.textContent = count;
  }
}

function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-50', 'border-blue-500', 'text-blue-700', 'shadow-sm');
        b.classList.add('bg-white', 'border-slate-200', 'text-slate-600', 'hover:bg-slate-50');
      });

      btn.classList.add('bg-blue-50', 'border-blue-500', 'text-blue-700', 'shadow-sm');
      btn.classList.remove('bg-white', 'border-slate-200', 'text-slate-600', 'hover:bg-slate-50');

      activeCategory = btn.getAttribute('data-category');
      renderAchievements();
    });
  });
}

function initSearchInput() {
  const searchInput = document.getElementById('achievement-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.toLowerCase().trim();
    renderAchievements();
  });
}

function renderAchievements() {
  const container = document.getElementById('achievements-grid');
  const counterEl = document.getElementById('achievements-counter');
  if (!container) return;

  const filtered = allAchievements.filter(item => {
    const matchesCategory = (activeCategory === 'all' || item.category === activeCategory);
    const matchesSearch = !currentSearchQuery || 
      item.title.toLowerCase().includes(currentSearchQuery) ||
      item.issuer.toLowerCase().includes(currentSearchQuery) ||
      item.skills.some(s => s.toLowerCase().includes(currentSearchQuery)) ||
      item.description.toLowerCase().includes(currentSearchQuery);

    return matchesCategory && matchesSearch;
  });

  if (counterEl) {
    counterEl.textContent = `Showing ${filtered.length} of ${allAchievements.length} credentials`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <h4 class="text-base font-bold text-slate-800">No credentials found</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">No matching achievements in "${activeCategory}" with the current search query.</p>
        <button onclick="resetAchievementFilters()" class="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors">
          Reset Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => createAchievementCardHTML(item)).join('');
}

window.resetAchievementFilters = function() {
  activeCategory = 'all';
  currentSearchQuery = '';
  const searchInput = document.getElementById('achievement-search-input');
  if (searchInput) searchInput.value = '';

  const allTabBtn = document.querySelector('[data-category="all"]');
  if (allTabBtn) allTabBtn.click();
};

function createAchievementCardHTML(item) {
  const categoryPills = {
    certifications: '<span class="badge-blue px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">Certification</span>',
    hackathons: '<span class="badge-purple px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">Hackathon</span>',
    competitions: '<span class="badge-amber px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">Competition</span>',
    honors: '<span class="badge-emerald px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">Honors &amp; Awards</span>'
  };

  return `
    <div class="dashboard-card p-6 flex flex-col justify-between relative overflow-hidden group">
      ${item.featured ? `
        <div class="absolute top-0 right-0 bg-blue-600 text-[10px] uppercase font-bold tracking-wider text-white px-3 py-1 rounded-bl-xl shadow-sm">
          <i class="fa-solid fa-star mr-1"></i> Featured
        </div>
      ` : ''}

      <div>
        <div class="flex items-start justify-between gap-4 mb-4 ${item.featured ? 'pr-20' : ''}">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${item.issuerColor}">
              <i class="${item.issuerLogo}"></i>
            </div>
            <div>
              <span class="text-xs font-semibold text-slate-700 block">${item.issuer}</span>
              <span class="text-[11px] text-slate-500 font-mono">${item.date}</span>
            </div>
          </div>
          ${categoryPills[item.category] || ''}
        </div>

        <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
          ${item.title}
        </h3>
        <p class="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
          ${item.description}
        </p>

        <div class="flex flex-wrap gap-1.5 mb-5">
          ${item.skills.map(s => `
            <span class="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-medium">
              ${s}
            </span>
          `).join('')}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div class="font-mono text-[11px] text-slate-500 truncate max-w-[140px] sm:max-w-[160px]" title="Credential ID: ${item.verificationId}">
          <i class="fa-solid fa-fingerprint text-blue-600 mr-1"></i> ${item.verificationId}
        </div>
        <div class="flex items-center gap-2">
          <button onclick="openCredentialModal('${item.id}')" class="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors">
            Details
          </button>
          <a href="${item.credentialUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-sm">
            <span>Verify</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

function initCredentialModal() {
  const modal = document.getElementById('credential-modal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.close-cred-modal');
  const backdrop = modal.querySelector('.cred-modal-backdrop');

  function closeModal() {
    modal.classList.add('opacity-0');
    const dialog = modal.querySelector('.cred-dialog');
    if (dialog) dialog.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 200);
  }

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

window.openCredentialModal = function(id) {
  const item = allAchievements.find(a => a.id === id);
  if (!item) return;

  const modal = document.getElementById('credential-modal');
  if (!modal) return;

  const modalContent = document.getElementById('cred-modal-body');
  if (modalContent) {
    modalContent.innerHTML = `
      <div class="flex items-start justify-between gap-4 mb-5">
        <div class="flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${item.issuerColor}">
            <i class="${item.issuerLogo}"></i>
          </div>
          <div>
            <span class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">${item.category}</span>
            <h3 class="text-lg font-bold text-slate-900 leading-snug">${item.title}</h3>
            <span class="text-xs text-slate-500">${item.issuer} &bull; Issued: ${item.date}</span>
          </div>
        </div>
        <button class="close-cred-modal text-slate-400 hover:text-slate-600 p-1">
          <i class="fa-solid fa-xmark text-base"></i>
        </button>
      </div>

      <div class="space-y-4 text-xs text-slate-700">
        <div>
          <h4 class="text-[11px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Overview &amp; Scope</h4>
          <p class="leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700">
            ${item.description}
          </p>
        </div>

        <div>
          <h4 class="text-[11px] uppercase font-bold text-slate-500 tracking-wider mb-2">Evaluated Competencies</h4>
          <div class="flex flex-wrap gap-2">
            ${item.skills.map(s => `
              <span class="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                <i class="fa-solid fa-check text-[10px] mr-1 text-blue-600"></i> ${s}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-500 uppercase font-semibold block">Credential ID</span>
            <div class="flex items-center justify-between mt-1">
              <span class="font-mono text-xs font-semibold text-slate-800 select-all">${item.verificationId}</span>
              <button onclick="navigator.clipboard.writeText('${item.verificationId}'); window.showToast('Credential ID copied!');" class="text-blue-600 hover:text-blue-800 text-xs p-1" title="Copy ID">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-500 uppercase font-semibold block">Credential Status</span>
            <span class="font-semibold text-xs text-emerald-700 flex items-center gap-1.5 mt-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Active &amp; Verified
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button class="close-cred-modal px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
          Close
        </button>
        <a href="${item.credentialUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2 shadow-sm">
          <span>Official Registry Verification</span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    `;

    modalContent.querySelectorAll('.close-cred-modal').forEach(b => {
      b.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        const dialog = modal.querySelector('.cred-dialog');
        if (dialog) dialog.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
          modal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }, 200);
      });
    });
  }

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    const dialog = modal.querySelector('.cred-dialog');
    if (dialog) dialog.classList.remove('scale-95', 'opacity-0');
  }, 10);
  document.body.classList.add('overflow-hidden');
};
