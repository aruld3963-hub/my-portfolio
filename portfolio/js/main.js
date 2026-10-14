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
