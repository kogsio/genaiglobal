/*
 * Dynamic UI logic for the Gen AI Global redesign.  
 * This script loads content from `config.json`, populates navigation,
 * hero, mission and feature sections, manages dark-mode toggling and  
 * responsive navigation behavior.  
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load configuration and populate the page
  fetch('config.json')
    .then((res) => res.json())
    .then((config) => {
      // Site title
      const siteTitleEl = document.getElementById('site-title');
      if (siteTitleEl && config.siteTitle) {
        siteTitleEl.textContent = config.siteTitle;
      }

      // Navigation links
      const navContainer = document.getElementById('nav-links');
      if (navContainer && Array.isArray(config.nav)) {
        config.nav.forEach((item) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = item.url;
          a.textContent = item.name;
          // Apply subtle hover effect via Tailwind classes
          a.className = 'block px-4 py-2 hover:text-maroon transition-colors';
          li.appendChild(a);
          navContainer.appendChild(li);
        });
      }

      // Hero section
      const heroHeadline = document.getElementById('hero-headline');
      const heroSubheadline = document.getElementById('hero-subheadline');
      const heroCTA = document.getElementById('hero-cta');
      if (heroHeadline) heroHeadline.textContent = config.hero?.headline || '';
      if (heroSubheadline) heroSubheadline.textContent = config.hero?.subheadline || '';
      if (heroCTA && config.hero?.callToAction) {
        heroCTA.textContent = config.hero.callToAction.text;
        heroCTA.href = config.hero.callToAction.url;
      }

      // Mission section
      const missionHeading = document.querySelector('#mission h2');
      const missionText = document.getElementById('mission-text');
      if (missionHeading) missionHeading.textContent = config.mission?.title || '';
      if (missionText) missionText.textContent = config.mission?.text || '';

      // Features section
      const featuresParent = document.querySelector('#features > div');
      if (featuresParent && Array.isArray(config.features)) {
        config.features.forEach((feat) => {
          const card = document.createElement('div');
          card.className =
            'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:-translate-y-1 transform transition-all duration-300';
          const h3 = document.createElement('h3');
          h3.className = 'text-2xl font-semibold mb-2 text-maroon';
          h3.textContent = feat.title;
          const p = document.createElement('p');
          p.className = 'text-gray-700 dark:text-gray-300';
          p.textContent = feat.text;
          card.appendChild(h3);
          card.appendChild(p);
          featuresParent.appendChild(card);
        });
      }
    })
    .catch((err) => {
      console.error('Failed to load configuration:', err);
    });

  // Dark mode persistence and toggle logic
  const htmlEl = document.documentElement;
  const toggle = document.getElementById('dark-mode-toggle');

  // Apply saved preference if it exists
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    htmlEl.classList.add('dark');
    if (toggle) toggle.checked = true;
  }

  if (toggle) {
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        htmlEl.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        htmlEl.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Update current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Mobile navigation toggle
  const menuBtn = document.getElementById('menu-toggle');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const nav = document.getElementById('nav-links');
      if (!nav) return;
      // Toggle hidden/flex classes to show/hide the mobile menu
      nav.classList.toggle('hidden');
      nav.classList.toggle('flex');
    });
  }
});