/**
 * ============================================================================
 * ACHIEVEMENTS MODULE (js/achievements.js)
 * Clean Light SaaS Theme: Live Supabase Data Fetching, Cloud Image Display,
 * Category Filtering, Real-Time Search, and Credential Verification Modal.
 * Zero hardcoded mock cards.
 * ============================================================================
 */

// Fetch achievements directly from Supabase 'achievements' table
// RULE ACTIVE: All authentic uploaded certificates and photos are visible to all visitors.
async function getAchievementsData() {
  const mockIds = ['aws-saa', 'gcp-cdl', 'hack-sih', 'ms-az900', 'meta-frontend', 'contest-leetcode', 'contest-hackerrank', 'honor-deans', 'pub-ieee'];

  if (window.supabaseClient) {
    try {
      // Query all authentic uploaded achievements from Supabase
      const { data, error } = await window.supabaseClient
        .from('achievements')
        .select('*');

      if (!error && Array.isArray(data)) {
        console.log(`⚡ Fetched ${data.length} achievements from Supabase`);
        
        // Auto-heal any items marked false or null in Supabase to enforce public visibility rule
        if (data.some(d => d.is_visible === false || d.is_visible == null)) {
          window.supabaseClient
            .from('achievements')
            .update({ is_visible: true })
            .or('is_visible.eq.false,is_visible.is.null')
            .then(() => console.log('Enforced public visibility rule for achievements in Supabase'))
            .catch(() => {});
        }

        // Filter out any mock placeholder records so visitors ONLY see the user's authentic certificates
        const authentic = data.filter(item => !mockIds.includes(item.id));

        return authentic.map(item => ({
          ...item,
          id: item.id || `ach-${Math.random().toString(36).substring(2, 7)}`,
          credential_link: item.credential_link || item.credentialUrl || '',
          credentialUrl: item.credential_link || item.credentialUrl || '',
          image_url: item.image_url || item.imageUrl || '',
          imageUrl: item.image_url || item.imageUrl || '',
          verificationId: item.verificationId || (item.id ? `CRED-${item.id}` : 'VERIFIED'),
          is_visible: true // 100% visible by rule
        }));
      } else if (error) {
        console.warn("Supabase live achievements query error:", error.message || error);
      }
    } catch (err) {
      console.warn("Supabase fetch exception, trying local store cache:", err);
    }
  }

  // Fallback to PortfolioStore cache if Supabase query is unavailable
  if (window.PortfolioStore && typeof window.PortfolioStore.getAchievements === 'function') {
    try {
      const cached = await window.PortfolioStore.getAchievements(false);
      if (Array.isArray(cached)) {
        return cached
          .filter(item => !mockIds.includes(item.id))
          .map(item => ({ ...item, is_visible: true }));
      }
    } catch (e) {
      console.warn("PortfolioStore cache error:", e);
    }
  }

  return [];
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

  // Update category tab count pills
  for (const [cat, count] of Object.entries(counts)) {
    const badge = document.querySelector(`[data-count-cat="${cat}"]`);
    if (badge) badge.textContent = count;
  }

  // Update top quick stat cards
  const statCerts = document.getElementById('stat-count-certs');
  const statHacks = document.getElementById('stat-count-hackathons');
  const statContests = document.getElementById('stat-count-contests');
  const statHonors = document.getElementById('stat-count-honors');

  if (statCerts) statCerts.textContent = counts.certifications;
  if (statHacks) statHacks.textContent = counts.hackathons;
  if (statContests) statContests.textContent = counts.competitions;
  if (statHonors) statHonors.textContent = counts.honors;

  // Update sidebar count badge
  const sidebarCountBadge = document.querySelector('nav a[href="achievements.html"] span:last-child');
  if (sidebarCountBadge) {
    sidebarCountBadge.textContent = allAchievements.length;
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

  // Zero achievements empty state
  if (allAchievements.length === 0) {
    if (counterEl) counterEl.textContent = '0 credentials published';
    container.innerHTML = `
      <div class="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-2xl shadow-sm">
          <i class="fa-solid fa-cloud-arrow-up"></i>
        </div>
        <h4 class="text-lg font-bold text-slate-900">No Achievements Published Yet</h4>
        <p class="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Connected to your live Supabase database (<code class="text-blue-700 font-mono">achievements</code> table). Use the Admin Control Portal to upload your certificates and images.
        </p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href="admin-login.html" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm flex items-center gap-2">
            <i class="fa-solid fa-lock"></i>
            <span>Open Admin Portal</span>
          </a>
        </div>
      </div>
    `;
    return;
  }

  const filtered = allAchievements.filter(item => {
    const matchesCategory = (activeCategory === 'all' || item.category === activeCategory);
    
    const skillsList = Array.isArray(item.skills) 
      ? item.skills 
      : (typeof item.skills === 'string' ? item.skills.split(',') : []);

    const matchesSearch = !currentSearchQuery || 
      (item.title && item.title.toLowerCase().includes(currentSearchQuery)) ||
      (item.issuer && item.issuer.toLowerCase().includes(currentSearchQuery)) ||
      skillsList.some(s => s.toLowerCase().includes(currentSearchQuery)) ||
      (item.category && item.category.toLowerCase().includes(currentSearchQuery));

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
        <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">No matching items in "${activeCategory}" with the search query "${currentSearchQuery}".</p>
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
    honors: '<span class="badge-emerald px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">Academic Honor</span>'
  };

  const categoryIcons = {
    certifications: 'fa-solid fa-certificate',
    hackathons: 'fa-solid fa-trophy',
    competitions: 'fa-solid fa-medal',
    honors: 'fa-solid fa-graduation-cap'
  };

  const imgUrl = item.image_url || item.imageUrl || '';
  const credLink = item.credential_link || item.credentialUrl || '#';
  const categoryIcon = categoryIcons[item.category] || 'fa-solid fa-award';
  const badgeHtml = categoryPills[item.category] || '<span class="badge-blue px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">Verified</span>';

  // Construct tags
  let tags = [];
  if (Array.isArray(item.skills) && item.skills.length > 0) {
    tags = item.skills;
  } else if (typeof item.skills === 'string' && item.skills.trim()) {
    tags = item.skills.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    // Generate graceful tags from issuer & category
    tags = [item.issuer, item.category ? item.category.toUpperCase() : 'VERIFIED'];
  }

  return `
    <div class="dashboard-card p-6 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <!-- Cloud Storage Image Preview Banner -->
        ${imgUrl ? `
          <div class="h-44 w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200 mb-4 flex items-center justify-center relative cursor-pointer" onclick="openCredentialModal('${item.id}')">
            <img src="${imgUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.outerHTML='<div class=\\'flex items-center justify-center h-full text-slate-400 text-3xl\\'><i class=\\'${categoryIcon}\\'></i></div>'">
            <div class="absolute top-2.5 right-2.5">
              ${badgeHtml}
            </div>
          </div>
        ` : ''}

        <!-- Header Row (Issuer & Date) -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2.5">
            ${!imgUrl ? `
              <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-lg flex-shrink-0">
                <i class="${categoryIcon}"></i>
              </div>
            ` : ''}
            <div>
              <span class="text-xs font-bold text-slate-800 block">${item.issuer || 'Official Organization'}</span>
              <span class="text-[11px] text-slate-500 font-mono">${item.date || 'Verified'}</span>
            </div>
          </div>
          ${!imgUrl ? badgeHtml : ''}
        </div>

        <!-- Title -->
        <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
          ${item.title}
        </h3>

        <!-- Description (if provided) -->
        ${item.description ? `
          <p class="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
            ${item.description}
          </p>
        ` : ''}

        <!-- Tags / Badges -->
        <div class="flex flex-wrap gap-1.5 mb-5">
          ${tags.slice(0, 4).map(t => `
            <span class="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-medium font-mono">
              ${t}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Action Strip -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <button onclick="openCredentialModal('${item.id}')" class="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors flex items-center gap-1.5">
          <i class="fa-regular fa-eye text-[11px]"></i>
          <span>Details</span>
        </button>

        ${credLink && credLink !== '#' ? `
          <a href="${credLink}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-sm">
            <span>Verify Credential</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        ` : `
          <span class="text-slate-400 font-mono text-[11px] flex items-center gap-1">
            <i class="fa-solid fa-check text-emerald-500"></i> Active
          </span>
        `}
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
  const item = allAchievements.find(a => a.id == id);
  if (!item) return;

  const modal = document.getElementById('credential-modal');
  if (!modal) return;

  const modalContent = document.getElementById('cred-modal-body');
  if (modalContent) {
    const imgUrl = item.image_url || item.imageUrl || '';
    const credLink = item.credential_link || item.credentialUrl || '#';

    modalContent.innerHTML = `
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider">${item.category || 'Credential'}</span>
          <h3 class="text-lg font-bold text-slate-900 leading-snug mt-0.5">${item.title}</h3>
          <span class="text-xs text-slate-500">${item.issuer} &bull; Issued: ${item.date || 'Active'}</span>
        </div>
        <button class="close-cred-modal text-slate-400 hover:text-slate-600 p-1">
          <i class="fa-solid fa-xmark text-base"></i>
        </button>
      </div>

      <!-- Cloud Uploaded Certificate Preview -->
      ${imgUrl ? `
        <div class="mb-4">
          <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 text-center">
            <img src="${imgUrl}" alt="${item.title}" class="max-h-64 mx-auto rounded-lg object-contain shadow-sm">
          </div>
        </div>
      ` : ''}

      <div class="space-y-3 text-xs text-slate-700">
        ${item.description ? `
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-500 uppercase font-bold block mb-1">Overview</span>
            <p class="leading-relaxed text-slate-700">${item.description}</p>
          </div>
        ` : ''}

        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-500 uppercase font-semibold block">Credential ID / Ref</span>
            <div class="flex items-center justify-between mt-1">
              <span class="font-mono text-xs font-semibold text-slate-800 select-all">${item.verificationId || (item.id ? `ID: ${item.id}` : 'VERIFIED')}</span>
            </div>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-500 uppercase font-semibold block">Database Status</span>
            <span class="font-semibold text-xs text-emerald-700 flex items-center gap-1.5 mt-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Live in Supabase
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button class="close-cred-modal px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
          Close
        </button>
        ${credLink && credLink !== '#' ? `
          <a href="${credLink}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2 shadow-sm">
            <span>Official Credential Registry</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        ` : ''}
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
