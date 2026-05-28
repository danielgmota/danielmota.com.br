// Translation Manager for Daniel Mota's portfolio website
// Integrates with js/translations.js to apply Portuguese, English, and Spanish text dynamically

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
});

function initI18n() {
  const defaultLang = 'pt';
  const supportedLangs = ['pt', 'en', 'es'];
  
  // 1. Detect language (localStorage -> browser language -> default)
  let currentLang = localStorage.getItem('preferred-language');
  
  if (!currentLang || !supportedLangs.includes(currentLang)) {
    const browserLang = (navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
    currentLang = supportedLangs.includes(browserLang) ? browserLang : defaultLang;
  }
  
  // 2. Initial translation
  applyTranslations(currentLang);
  
  // 3. Set up Language Selector UI dropdown interaction
  setupLangSwitcher(currentLang);
}

// Function to translate the page elements
function applyTranslations(lang) {
  if (!translations || !translations[lang]) return;
  
  const dict = translations[lang];
  
  // Update document language tag
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  
  // Translate standard textContent elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (dict[key]) {
      element.textContent = dict[key];
    }
  });
  
  // Translate elements requiring innerHTML (like bold tags, line breaks)
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const key = element.getAttribute('data-i18n-html');
    if (dict[key]) {
      element.innerHTML = dict[key];
    }
  });
  
  // Translate alt attributes for images
  document.querySelectorAll('[data-i18n-alt]').forEach(element => {
    const key = element.getAttribute('data-i18n-alt');
    if (dict[key]) {
      element.setAttribute('alt', dict[key]);
    }
  });
  
  // Translate aria-label attributes for accessibility
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria-label');
    if (dict[key]) {
      element.setAttribute('aria-label', dict[key]);
    }
  });
  
  // Update browser document title
  if (dict['meta-title']) {
    document.title = dict['meta-title'];
  }
  
  // Update meta tags for SEO/Social Sharing
  updateMetaDescription(dict['meta-description'], dict['meta-title']);
}

// Helper to update SEO description and other tags dynamically
function updateMetaDescription(description, title) {
  if (!description) return;
  
  // Standard Meta Tags
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);
  
  const metaTitle = document.querySelector('meta[name="title"]');
  if (metaTitle && title) metaTitle.setAttribute('content', title);
  
  // Open Graph
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);
  
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) ogTitle.setAttribute('content', title);
  
  // Twitter
  const twitterDesc = document.querySelector('meta[property="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', description);
  
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle && title) twitterTitle.setAttribute('content', title);
}

// Function to handle the selector dropdown behavior
function setupLangSwitcher(activeLang) {
  const switcher = document.querySelector('.lang-switcher');
  const btn = document.getElementById('lang-btn');
  const dropdown = document.getElementById('lang-dropdown');
  const currentLabel = document.querySelector('.lang-current');
  const options = document.querySelectorAll('.lang-option');
  
  if (!switcher || !btn || !dropdown) return;
  
  // Update button label & active option styling based on loaded lang
  const updateDropdownUI = (lang) => {
    currentLabel.textContent = lang.toUpperCase();
    
    options.forEach(opt => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  };
  
  // Initial state setup
  updateDropdownUI(activeLang);
  
  // Toggle dropdown visibility
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });
  
  // Select language logic
  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedLang = option.getAttribute('data-lang');
      
      // Save, apply translations and update UI
      localStorage.setItem('preferred-language', selectedLang);
      applyTranslations(selectedLang);
      updateDropdownUI(selectedLang);
      
      // Close dropdown
      switcher.classList.remove('open');
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (switcher.classList.contains('open')) {
      switcher.classList.remove('open');
    }
  });
}
