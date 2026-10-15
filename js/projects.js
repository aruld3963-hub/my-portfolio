/**
 * ============================================================================
 * PROJECTS MODULE (js/projects.js)
 * Clean Light SaaS Theme: Dynamic project cards rendering from Centralized Data Store
 * (Supabase + localStorage), category filtering, cloud image previews, and GitHub modals.
 * ============================================================================
 */

let activeProjectCategory = 'all';
let allProjects = [];

async function getProjectsData() {
  if (window.supabaseClient) {
    try {
      const { data, error } = await window.supabaseClient.from('projects').select('*').eq('is_visible', true);
      if (!error && Array.isArray(data)) return data;
    } catch (e) {
      console.warn("Direct Supabase projects fetch error:", e);
    }
  }

  if (window.PortfolioStore && typeof window.PortfolioStore.getProjects === 'function') {
    try {
      const data = await window.PortfolioStore.getProjects(true); // only visible
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.warn("PortfolioStore projects fetch error:", e);
    }
  }

  return [];
}

document.addEventListener('DOMContentLoaded', async () => {
  allProjects = await getProjectsData();
  renderProjects();
  initProjectTabs();
  updateProjectCategoryCounts();
});

function updateProjectCategoryCounts() {
  const allCount = allProjects.length;
  const backendCount = allProjects.filter(p => p.category === 'backend').length;
  const fullstackCount = allProjects.filter(p => p.category === 'fullstack').length;
  const aidsaCount = allProjects.filter(p => p.category === 'ai-dsa').length;

  const allBtn = document.querySelector('.proj-tab[data-filter="all"]');
  if (allBtn) allBtn.innerHTML = `All Projects (${allCount})`;

  const sidebarCountBadge = document.querySelector('nav a[href="projects.html"] span:last-child');
  if (sidebarCountBadge) {
    sidebarCountBadge.textContent = allCount;
  }
}

function initProjectTabs() {
  const tabs = document.querySelectorAll('.proj-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-filter');
      window.filterProjects(cat);
    });
  });
}

window.filterProjects = function(category) {
  activeProjectCategory = category;

  const tabs = document.querySelectorAll('.proj-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-filter') === category) {
      tab.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-500', 'shadow-sm');
      tab.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
    } else {
      tab.classList.remove('bg-blue-50', 'text-blue-700', 'border-blue-500', 'shadow-sm');
      tab.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
    }
  });

  renderProjects();
};

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Empty state handling
  if (allProjects.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-2xl shadow-sm">
          <i class="fa-solid fa-layer-group"></i>
        </div>
        <h4 class="text-lg font-bold text-slate-900">No Projects Published Yet</h4>
        <p class="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          The projects catalog has been cleared. Log in to the Admin Control Portal to publish your projects, add tech stack tags, and upload preview screenshots to Supabase.
        </p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href="admin-login.html" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm flex items-center gap-2">
            <i class="fa-solid fa-lock"></i>
            <span>Access Admin Portal</span>
          </a>
          <button onclick="restoreProjectsDefaultAndReload()" class="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
            <i class="fa-solid fa-rotate-left mr-1"></i> Restore Sample Demo
          </button>
        </div>
      </div>
    `;
    return;
  }

  const filtered = allProjects.filter(p => {
    return activeProjectCategory === 'all' || p.category === activeProjectCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <h4 class="text-base font-bold text-slate-800">No projects found in this category</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">There are currently no visible projects under "${activeProjectCategory}".</p>
        <button onclick="window.filterProjects('all')" class="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors">
          Show All Projects
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => createProjectCardHTML(p)).join('');
}

window.restoreProjectsDefaultAndReload = function() {
  if (window.PortfolioStore) {
    window.PortfolioStore.resetProjectsToDefault();
    window.location.reload();
  }
};

function createProjectCardHTML(p) {
  const skillsList = Array.isArray(p.skills) 
    ? p.skills 
    : (typeof p.skills === 'string' ? p.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  // Category Icon & Color
  const catStyles = {
    backend: { icon: 'fa-solid fa-server', color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Cloud & Backend' },
    fullstack: { icon: 'fa-solid fa-cubes', color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Full-Stack & Web' },
    'ai-dsa': { icon: 'fa-solid fa-brain', color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'AI & Algorithms' }
  };

  const style = catStyles[p.category] || { icon: 'fa-solid fa-layer-group', color: 'bg-slate-50 text-slate-700 border-slate-200', label: 'Project' };
  const colSpan = p.featured ? 'lg:col-span-8' : 'lg:col-span-4';

  return `
    <div class="project-card ${colSpan} dashboard-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group" data-category="${p.category}">
      ${p.featured ? `
        <div class="absolute top-0 right-0 bg-blue-600 text-[10px] uppercase font-bold tracking-wider text-white px-3 py-1 rounded-bl-xl shadow-sm z-10">
          <i class="fa-solid fa-star mr-1"></i> Flagship Architecture
        </div>
      ` : ''}

      <div>
        <!-- Cloud Thumbnail Preview (if uploaded) -->
        ${p.imageUrl ? `
          <div class="mb-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 group-hover:border-blue-300 transition-colors">
            <img src="${p.imageUrl}" alt="${p.title}" class="w-full h-40 sm:h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300">
          </div>
        ` : ''}

        <div class="flex items-center gap-3 mb-4 ${p.featured && !p.imageUrl ? 'pr-20' : ''}">
          <div class="w-12 h-12 rounded-2xl ${style.color} flex items-center justify-center text-xl flex-shrink-0">
            <i class="${style.icon}"></i>
          </div>
          <div class="overflow-hidden">
            <span class="text-xs font-mono text-blue-700 uppercase font-semibold block truncate">
              ${p.badgeLabel || style.label}
            </span>
            <h3 class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate" title="${p.title}">
              ${p.title}
            </h3>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          ${p.description}
        </p>

        <!-- Optional Metrics Strip if provided -->
        ${p.metrics && Object.keys(p.metrics).length > 0 ? `
          <div class="grid grid-cols-3 gap-2.5 mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
            ${p.metrics.tps ? `
              <div>
                <span class="text-slate-500 block text-[10px]">THROUGHPUT</span>
                <span class="text-blue-700 font-bold">${p.metrics.tps}</span>
              </div>
            ` : ''}
            ${p.metrics.latency ? `
              <div>
                <span class="text-slate-500 block text-[10px]">P99 LATENCY</span>
                <span class="text-emerald-700 font-bold">${p.metrics.latency}</span>
              </div>
            ` : ''}
            ${p.metrics.uptime ? `
              <div>
                <span class="text-slate-500 block text-[10px]">UPTIME</span>
                <span class="text-purple-700 font-bold">${p.metrics.uptime}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Tech Stack Badges -->
        <div class="flex flex-wrap gap-1.5 mb-6">
          ${skillsList.map(s => `
            <span class="badge-slate px-2.5 py-1 rounded-lg text-xs font-mono font-medium">
              ${s}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Actions Strip -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span class="text-slate-500 font-mono flex items-center gap-1.5 text-[11px]">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Build
        </span>
        <div class="flex items-center gap-2">
          <button onclick="window.openProjectModal('${p.id}')" class="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors font-semibold border border-slate-200 flex items-center gap-1.5">
            <i class="fa-brands fa-github text-sm text-slate-700"></i>
            <span>Details</span>
          </button>
          <a href="${p.liveUrl || p.githubUrl || '#'}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-sm">
            <span>Live Demo</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

// GitHub Project Details Modal Handler
window.openProjectModal = function(id) {
  const p = allProjects.find(item => item.id === id);
  if (!p) return;

  const modal = document.getElementById('github-project-modal');
  const body = document.getElementById('project-modal-body');
  if (!modal || !body) return;

  const cloneCmd = `git clone ${p.githubUrl || 'https://github.com/aruldavid/repo'}.git`;
  const skillsList = Array.isArray(p.skills) 
    ? p.skills 
    : (typeof p.skills === 'string' ? p.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  body.innerHTML = `
    <div class="flex items-start justify-between pb-4 border-b border-slate-100">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-2xl flex-shrink-0">
          <i class="fa-brands fa-github"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900 leading-snug">${p.title}</h3>
          <span class="text-xs text-slate-500 font-mono">${p.githubUrl ? p.githubUrl.replace('https://github.com/', '') : 'aruldavid/repo'}</span>
        </div>
      </div>
      <button class="close-proj-modal text-slate-400 hover:text-slate-600 p-1">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
    </div>

    <!-- Cloud Screenshot Preview if uploaded -->
    ${p.imageUrl ? `
      <div class="mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-56 text-center">
        <img src="${p.imageUrl}" alt="${p.title}" class="max-h-52 mx-auto rounded-lg object-contain">
      </div>
    ` : ''}

    <div class="py-4 space-y-4 text-xs">
      <div>
        <h4 class="font-bold uppercase text-[10px] tracking-wider text-slate-500 mb-1">Architecture &amp; Scope</h4>
        <p class="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
          ${p.description}
        </p>
      </div>

      <!-- Repo Quick Stats -->
      <div class="grid grid-cols-4 gap-2 text-center font-mono text-xs">
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-500 block text-[10px]">STARS</span>
          <span class="text-amber-700 font-bold">★ ${p.stars || 42}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-500 block text-[10px]">FORKS</span>
          <span class="text-blue-700 font-bold">${p.forks || 12}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-500 block text-[10px]">BRANCH</span>
          <span class="text-slate-700 font-bold">${p.branch || 'main'}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-500 block text-[10px]">STACK</span>
          <span class="text-emerald-700 font-bold">${skillsList[0] || 'Core'}</span>
        </div>
      </div>

      <div>
        <h4 class="font-bold uppercase text-[10px] tracking-wider text-slate-500 mb-1.5">Technologies</h4>
        <div class="flex flex-wrap gap-1.5">
          ${skillsList.map(s => `
            <span class="badge-blue px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium">
              ${s}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Clone Terminal Strip -->
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between font-mono text-[11px]">
        <span class="text-slate-700 truncate select-all">${cloneCmd}</span>
        <button onclick="navigator.clipboard.writeText('${cloneCmd}'); window.showToast('Clone command copied!');" class="text-blue-700 hover:text-blue-900 ml-2 font-sans font-bold flex-shrink-0">
          Copy
        </button>
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 text-xs">
      <button class="close-proj-modal px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
        Close
      </button>
      <a href="${p.githubUrl || 'https://github.com'}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-sm transition-colors">
        <span>View on GitHub</span>
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    </div>
  `;

  modal.querySelectorAll('.close-proj-modal').forEach(b => {
    b.addEventListener('click', () => {
      modal.classList.add('opacity-0');
      const d = modal.querySelector('.project-dialog');
      if (d) d.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }, 200);
    });
  });

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    const d = modal.querySelector('.project-dialog');
    if (d) d.classList.remove('scale-95', 'opacity-0');
  }, 10);
  document.body.classList.add('overflow-hidden');
};

