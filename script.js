/* Caring Hearts Bermuda - Interactive Legal Portal JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const docSections = document.querySelectorAll('.doc-section');
  const themeToggleBtn = document.getElementById('themeToggle');
  const searchInput = document.getElementById('searchInput');
  const printBtn = document.getElementById('printBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const toast = document.getElementById('toast');
  const privacyToc = document.getElementById('privacyToc');
  const termsToc = document.getElementById('termsToc');

  // Initialize Theme
  const savedTheme = localStorage.getItem('ch_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Theme Toggle Listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ch_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <span>Light Mode</span>
      `;
    } else {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <span>Dark Mode</span>
      `;
    }
  }

  // Handle Tab Switch
  function switchTab(tabId, updateHash = true) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    docSections.forEach(sec => {
      if (sec.id === tabId) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Toggle TOC visibility
    if (tabId === 'privacy-policy') {
      privacyToc.style.display = 'block';
      termsToc.style.display = 'none';
      if (updateHash) history.replaceState(null, null, '#privacy');
    } else if (tabId === 'terms-conditions') {
      privacyToc.style.display = 'none';
      termsToc.style.display = 'block';
      if (updateHash) history.replaceState(null, null, '#terms');
    }

    // Scroll back top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateActiveTocOnScroll();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Check initial hash
  const currentHash = window.location.hash.toLowerCase();
  if (currentHash.includes('terms')) {
    switchTab('terms-conditions', false);
  } else {
    switchTab('privacy-policy', false);
  }

  // Hash change handling
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('terms')) {
      switchTab('terms-conditions', false);
    } else if (hash.includes('privacy')) {
      switchTab('privacy-policy', false);
    }
  });

  // Table of Contents Highlighting on Scroll
  function updateActiveTocOnScroll() {
    const activeSection = document.querySelector('.doc-section.active');
    if (!activeSection) return;

    const blocks = activeSection.querySelectorAll('.legal-block');
    const scrollPos = window.scrollY + 140;

    let currentBlockId = '';

    blocks.forEach(block => {
      const top = block.offsetTop;
      const height = block.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentBlockId = block.id;
      }
    });

    const activeToc = activeSection.id === 'privacy-policy' ? privacyToc : termsToc;
    const tocLinks = activeToc.querySelectorAll('.toc-link');

    tocLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentBlockId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveTocOnScroll);

  // Search Filter Functionality
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const activeSection = document.querySelector('.doc-section.active');
      if (!activeSection) return;

      const blocks = activeSection.querySelectorAll('.legal-block');

      blocks.forEach(block => {
        const text = block.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          block.style.display = 'block';
        } else {
          block.style.display = 'none';
        }
      });
    });
  }

  // Print button
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Copy Link Button
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(() => {
        showToast('Link copied to clipboard!');
      }).catch(err => {
        showToast('Failed to copy link.');
      });
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});
