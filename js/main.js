/**
 * ============================================================================
 * MAIN SCRIPT (js/main.js)
 * Clean SaaS Dashboard Shell Controller: Sidebar Navigation, Mobile Drawer,
 * Command Palette (Cmd+K), Live Clock, Toast System, and Interactive Modals.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigationHighlight();
  initMobileDrawer();
  initLiveClock();
  initCommandPalette();
  initResumeModal();
  initGlobalCopyHandlers();
  initLiveSiteProfileSync();
});

/**
 * Automatically detects current page and applies active styling to sidebar navigation
 */
function initNavigationHighlight() {
  const currentPath = window.location.pathname;
  let filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  if (!filename || filename === '') {
    filename = 'index.html';
  }

  const navLinks = document.querySelectorAll('.nav-menu-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === filename || (filename === 'index.html' && (href === './' || href === '/'))) {
      link.classList.add('nav-item-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('nav-item-active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Handles mobile sidebar drawer toggle and overlay backdrop
 */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const sidebar = document.getElementById('dashboard-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (!sidebar) return;

  function openDrawer() {
    sidebar.classList.remove('-translate-x-full');
    if (backdrop) {
      backdrop.classList.remove('hidden');
      setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
    }
    document.body.classList.add('overflow-hidden', 'md:overflow-auto');
  }

  function closeDrawer() {
    sidebar.classList.add('-translate-x-full');
    if (backdrop) {
      backdrop.classList.add('opacity-0');
      setTimeout(() => backdrop.classList.add('hidden'), 250);
    }
    document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sidebar.classList.contains('-translate-x-full')) {
      closeDrawer();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      closeDrawer();
    }
  });
}

/**
 * Live Digital Clock in Dashboard Header
 */
function initLiveClock() {
  const clockEl = document.getElementById('header-live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
  }

  update();
  setInterval(update, 1000);
}

/**
 * Global Toast Notification System (Light Theme)
 */
window.showToast = function(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const icons = {
    success: '<i class="fa-solid fa-circle-check text-emerald-600"></i>',
    info: '<i class="fa-solid fa-circle-info text-blue-600"></i>',
    warning: '<i class="fa-solid fa-triangle-exclamation text-amber-600"></i>',
    error: '<i class="fa-solid fa-circle-xmark text-rose-600"></i>'
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-slate-800 shadow-lg shadow-slate-200/50',
    info: 'border-blue-200 bg-white text-slate-800 shadow-lg shadow-slate-200/50',
    warning: 'border-amber-200 bg-white text-slate-800 shadow-lg shadow-slate-200/50',
    error: 'border-rose-200 bg-white text-slate-800 shadow-lg shadow-slate-200/50'
  };

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-300 transform translate-y-4 opacity-0 ${borders[type] || borders.success}`;
  toast.innerHTML = `
    <div class="text-base flex-shrink-0">${icons[type] || icons.success}</div>
    <div class="flex-1 font-medium pr-2 text-slate-700">${message}</div>
    <button class="text-slate-400 hover:text-slate-600 transition-colors p-1" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark text-xs"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-4');
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 3500);
};

/**
 * Clean Resume Download Modal
 */
function initResumeModal() {
  const resumeBtns = document.querySelectorAll('.trigger-resume-modal');
  const modal = document.getElementById('resume-modal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.close-resume-modal');
  const backdrop = modal.querySelector('.resume-modal-backdrop');

  function openResume() {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      const dialog = modal.querySelector('.resume-dialog');
      if (dialog) dialog.classList.remove('scale-95', 'opacity-0');
    }, 10);
    document.body.classList.add('overflow-hidden');
  }

  function closeResume() {
    const dialog = modal.querySelector('.resume-dialog');
    if (dialog) dialog.classList.add('scale-95', 'opacity-0');
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 200);
  }

  resumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResume();
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeResume));
  if (backdrop) backdrop.addEventListener('click', closeResume);

  const directDownloadBtn = document.getElementById('btn-download-resume-pdf');
  if (directDownloadBtn) {
    directDownloadBtn.addEventListener('click', () => {
      window.showToast('Generating official Arul David resume (PDF)...', 'info');
      setTimeout(() => {
        window.showToast('Resume PDF downloaded successfully!', 'success');
        closeResume();
      }, 700);
    });
  }
}

/**
 * Command Palette (Cmd+K / Ctrl+K)
 */
function initCommandPalette() {
  const paletteModal = document.getElementById('command-palette-modal');
  const paletteTrigger = document.getElementById('command-palette-trigger');
  if (!paletteModal) return;

  const input = document.getElementById('palette-search-input');
  const items = paletteModal.querySelectorAll('.palette-nav-item');
  const backdrop = paletteModal.querySelector('.palette-backdrop');

  function openPalette() {
    paletteModal.classList.remove('hidden');
    setTimeout(() => {
      paletteModal.classList.remove('opacity-0');
      const inner = paletteModal.querySelector('.palette-card');
      if (inner) inner.classList.remove('scale-95', 'opacity-0');
      if (input) {
        input.value = '';
        input.focus();
        filterItems('');
      }
    }, 10);
    document.body.classList.add('overflow-hidden');
  }

  function closePalette() {
    const inner = paletteModal.querySelector('.palette-card');
    if (inner) inner.classList.add('scale-95', 'opacity-0');
    paletteModal.classList.add('opacity-0');
    setTimeout(() => {
      paletteModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 200);
  }

  if (paletteTrigger) {
    paletteTrigger.addEventListener('click', openPalette);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closePalette);
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteModal.classList.contains('hidden')) {
        openPalette();
      } else {
        closePalette();
      }
    } else if (e.key === 'Escape' && !paletteModal.classList.contains('hidden')) {
      closePalette();
    }
  });

  if (input) {
    input.addEventListener('input', (e) => {
      filterItems(e.target.value.toLowerCase().trim());
    });
  }

  function filterItems(query) {
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }
}

/**
 * Global Copy Handlers
 */
function initGlobalCopyHandlers() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = el.getAttribute('data-copy');
      const label = el.getAttribute('data-copy-label') || 'Copied to clipboard!';
      try {
        await navigator.clipboard.writeText(text);
        window.showToast(`${label}`, 'success');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        window.showToast(`${label}`, 'success');
      }
    });
  });
}

/**
 * ============================================================================
 * LIVE SITE PROFILE & CMS SYNC (js/main.js)
 * Synchronizes hero elements, badges, bio, social links, avatar, and
 * education journey from Supabase / PortfolioStore.
 * ============================================================================
 */
async function initLiveSiteProfileSync() {
  if (typeof PortfolioStore === 'undefined' || !PortfolioStore.getSiteProfile) {
    return;
  }

  try {
    const profile = await PortfolioStore.getSiteProfile();
    if (!profile) return;

    // 1. Full Name
    if (profile.full_name) {
      document.querySelectorAll('.cms-full-name').forEach(el => {
        el.textContent = profile.full_name;
      });
      if (document.title && document.title.includes('Arul David')) {
        document.title = document.title.replace(/Arul David/gi, profile.full_name);
      }
    }

    // 2. Headline Badge & Visibility
    const badgeContainers = document.querySelectorAll('.cms-badge-container');
    const badgeTexts = document.querySelectorAll('.cms-headline-badge');

    if (profile.is_badge_visible === false) {
      badgeContainers.forEach(container => {
        container.classList.add('hidden');
        container.style.display = 'none';
      });
    } else {
      badgeContainers.forEach(container => {
        container.classList.remove('hidden');
        container.style.display = 'inline-flex';
      });
      if (profile.headline_badge) {
        badgeTexts.forEach(el => {
          el.textContent = profile.headline_badge;
        });
      }
    }

    // 3. Degree Title
    if (profile.degree_title) {
      document.querySelectorAll('.cms-degree-title').forEach(el => {
        el.textContent = profile.degree_title;
      });
    }

    // 4. College Name / Institution
    if (profile.college_name) {
      document.querySelectorAll('.cms-college-name').forEach(el => {
        el.textContent = profile.college_name;
      });
    }

    // 5. Bio Summary
    if (profile.bio_summary) {
      document.querySelectorAll('.cms-bio-summary').forEach(el => {
        el.textContent = profile.bio_summary;
      });
    }

    // 6. Avatar Image
    if (profile.avatar_url) {
      document.querySelectorAll('.cms-avatar-img').forEach(img => {
        img.src = profile.avatar_url;
      });
    }

    // 7. Core Skills Badges
    const skillsContainers = document.querySelectorAll('.cms-core-skills-container');
    if (skillsContainers.length > 0 && Array.isArray(profile.core_skills) && profile.core_skills.length > 0) {
      const skillsHtml = profile.core_skills.map(s => {
        const item = s.trim();
        if (!item) return '';
        let icon = 'fa-solid fa-code';
        let color = 'text-blue-600';
        const lower = item.toLowerCase();

        if (lower.includes('python')) {
          icon = 'fa-brands fa-python';
          color = 'text-blue-600';
        } else if (lower.includes('java') && !lower.includes('script')) {
          icon = 'fa-brands fa-java';
          color = 'text-rose-600';
        } else if (lower.includes('c#')) {
          icon = 'fa-solid fa-code';
          color = 'text-indigo-600';
        } else if (lower.includes('sql') || lower.includes('database')) {
          icon = 'fa-solid fa-database';
          color = 'text-emerald-600';
        } else if (lower.includes('supabase')) {
          icon = 'fa-solid fa-bolt';
          color = 'text-amber-500';
        } else if (lower.includes('data structure') || lower.includes('algo')) {
          icon = 'fa-solid fa-diagram-project';
          color = 'text-purple-600';
        } else if (lower.includes('cloud') || lower.includes('aws') || lower.includes('gcp') || lower.includes('azure')) {
          icon = 'fa-solid fa-cloud';
          color = 'text-sky-600';
        }

        return `
          <span class="badge-blue px-3 py-1.5 rounded-xl font-mono font-semibold flex items-center gap-1.5 shadow-2xs">
            <i class="${icon} ${color}"></i> ${item}
          </span>
        `;
      }).filter(Boolean).join('');

      skillsContainers.forEach(container => {
        container.innerHTML = skillsHtml;
      });
    }

    // 8. Social Links
    if (profile.github_url) {
      document.querySelectorAll('.cms-github-link').forEach(el => {
        el.href = profile.github_url;
      });
    }

    if (profile.linkedin_url) {
      document.querySelectorAll('.cms-linkedin-link').forEach(el => {
        el.href = profile.linkedin_url;
      });
    }

    if (profile.email) {
      document.querySelectorAll('.cms-email-link').forEach(el => {
        if (el.tagName === 'A') {
          el.href = `mailto:${profile.email}`;
        }
        if (el.hasAttribute('data-copy')) {
          el.setAttribute('data-copy', profile.email);
        }
      });
    }

    if (profile.resume_url) {
      document.querySelectorAll('.cms-resume-link').forEach(el => {
        el.href = profile.resume_url;
        el.setAttribute('download', 'Arul_David_Resume.pdf');
      });
    }

    // 9. Dynamic Education Journey in about.html
    const eduTimelineContainer = document.getElementById('cms-education-timeline');
    if (eduTimelineContainer && Array.isArray(profile.education_journey)) {
      const visibleJourney = profile.education_journey.filter(item => item.isVisible !== false);
      if (visibleJourney.length === 0) {
        eduTimelineContainer.innerHTML = `
          <div class="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            No education milestones currently set to visible.
          </div>
        `;
      } else {
        eduTimelineContainer.innerHTML = visibleJourney.map((item) => {
          return `
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl text-blue-700 flex-shrink-0">
                  <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="badge-blue px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">${item.level || 'Academic Milestone'}</span>
                  </div>
                  <h4 class="text-base font-bold text-slate-900">${item.institution || ''}</h4>
                  <p class="text-xs text-slate-600 leading-relaxed max-w-2xl">${item.details || ''}</p>
                </div>
              </div>
              <div class="flex flex-col sm:items-end text-xs font-mono flex-shrink-0">
                <span class="text-blue-700 font-bold bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100">${item.year || ''}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (err) {
    console.warn("Notice in initLiveSiteProfileSync:", err);
  }
}
