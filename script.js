// script.js for Gen AI Global redesigned site

/*
 * Toggles between custom light and dark themes.  The light theme is named
 * 'mytheme' and the dark theme is named 'mytheme-dark'.  These theme
 * variables are defined in the root CSS of each page.  When the toggle
 * button is clicked the function switches the data‑theme attribute on
 * the HTML element accordingly.  DaisyUI automatically updates all
 * components when the attribute changes.  The currently active theme
 * is also persisted in localStorage so subsequent visits honour the
 * user’s preference.
 */
export function toggleDarkMode() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme');
  const nextTheme = current === 'mytheme' ? 'mytheme-dark' : 'mytheme';
  root.setAttribute('data-theme', nextTheme);
  try {
    localStorage.setItem('theme', nextTheme);
  } catch (err) {
    // localStorage may be unavailable in some environments
  }
}

// On page load, apply persisted theme if available
(() => {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (err) {
    // ignore persistence errors
  }
})();

/*
 * Loads resource entries from the JSON dataset and populates the
 * resources page.  The JSON file lives in the `data` directory
 * alongside the HTML files.  Each entry contains a title,
 * description, author, date and a URL to the full article.  A
 * dropdown list of unique tags is automatically constructed to
 * allow filtering.  When the user selects a tag the list is
 * filtered to show only matching resources.  If the file cannot
 * be fetched an error is logged to the console; the page will
 * remain empty in this scenario.
 */
export function initResources() {
  const dropdown = document.getElementById('tagDropdown');
  const list = document.getElementById('resourcesList');
  if (!dropdown || !list) return;
  fetch('data/resources-data.json')
    .then((resp) => resp.json())
    .then((data) => {
      // Build sorted list of unique tags
      const tags = Array.from(new Set(data.map((item) => item.tag))).sort();
      tags.forEach((tag) => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        dropdown.appendChild(option);
      });
      // Render resource cards for a given tag
      const render = (tag) => {
        list.innerHTML = '';
        (tag === 'all' ? data : data.filter((item) => item.tag === tag)).forEach(
          (item) => {
            const card = document.createElement('article');
            card.className =
              'border border-base-300 rounded-box p-4 bg-base-200 shadow-sm';
            const date = new Date(item.date).toLocaleDateString();
            card.innerHTML = `\
              <h3 class="text-lg font-bold mb-2">${item.title}</h3>
              <p class="mb-2">${item.description}</p>
              <div class="text-sm opacity-70 mb-2">
                <span><strong>Author:</strong> ${item.author}</span> ·
                <span><strong>Date:</strong> ${date}</span>
              </div>
              <a href="${item.resource_url}" target="_blank" class="btn btn-sm btn-primary">Read More</a>
            `;
            list.appendChild(card);
          }
        );
      };
      // Initial render
      render('all');
      // Dropdown change handler
      dropdown.addEventListener('change', (e) => render(e.target.value));
    })
    .catch((err) => console.error('Failed to load resources-data.json', err));
}