// Image Zoom Modal Functionality for Project Previews
// Using modern native <dialog> element, CSS transitions, and accessibility best practices

document.addEventListener('DOMContentLoaded', () => {
  initImageZoom();
});

function initImageZoom() {
  const dialog = document.getElementById('image-zoom-dialog');
  const zoomImg = document.getElementById('zoom-img');
  const zoomCaption = document.getElementById('zoom-caption');
  const closeBtn = document.getElementById('zoom-close-btn');
  
  if (!dialog || !zoomImg || !zoomCaption || !closeBtn) return;
  
  // Track the element that triggered the modal to restore focus on close (A11y best practice)
  let lastFocusedElement = null;

  // Find all images within project mockups
  const projectImages = document.querySelectorAll('.project-preview img');
  
  // Set up accessibility labels and keyboard features
  projectImages.forEach(img => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    
    // Click trigger
    img.addEventListener('click', () => {
      openZoomModal(img);
    });

    // Keyboard trigger (Enter or Space)
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openZoomModal(img);
      }
    });
  });

  // Calculate and update aria-labels based on current active language
  function updateAriaLabels() {
    const currentLang = localStorage.getItem('preferred-language') || 'pt';
    let zoomHint = 'Clique para ampliar a imagem';
    if (currentLang === 'en') zoomHint = 'Click to zoom image';
    if (currentLang === 'es') zoomHint = 'Haga clic para ampliar la imagen';
    
    projectImages.forEach(img => {
      const altText = img.getAttribute('alt') || '';
      img.setAttribute('aria-label', `${altText} (${zoomHint})`);
    });
  }

  // Initial call to set labels
  updateAriaLabels();

  // Listen to language switcher clicks to update alt texts and aria-labels dynamically
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Timeout allows i18n.js to run its update first
      setTimeout(() => {
        updateAriaLabels();
      }, 50);
    });
  });

  // Open the zoom modal
  function openZoomModal(imgElement) {
    lastFocusedElement = document.activeElement;
    
    // Set image source and alt attributes
    zoomImg.src = imgElement.src;
    zoomImg.alt = imgElement.alt;
    
    // Sync translated caption text and attributes
    const i18nKey = imgElement.getAttribute('data-i18n-alt');
    if (i18nKey) {
      zoomCaption.setAttribute('data-i18n', i18nKey);
      zoomImg.setAttribute('data-i18n-alt', i18nKey);
      
      // Look up current translation safely from the global translations scope
      const currentLang = localStorage.getItem('preferred-language') || 'pt';
      const dict = (typeof translations !== 'undefined') ? translations : (window.translations || null);
      
      if (dict && dict[currentLang] && dict[currentLang][i18nKey]) {
        zoomCaption.textContent = dict[currentLang][i18nKey];
      } else {
        zoomCaption.textContent = imgElement.alt;
      }
    } else {
      zoomCaption.removeAttribute('data-i18n');
      zoomImg.removeAttribute('data-i18n-alt');
      zoomCaption.textContent = imgElement.alt;
    }

    // Open native dialog modal
    dialog.showModal();
    
    // Focus the close button for keyboard users
    setTimeout(() => {
      closeBtn.focus();
    }, 50);
  }

  // Close the zoom modal
  function closeZoomModal() {
    dialog.close();
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Bind close button click
  closeBtn.addEventListener('click', closeZoomModal);

  // Close dialog on close event (e.g. Esc key pressed)
  dialog.addEventListener('close', () => {
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  });

  // Light dismiss fallback (clicking outside the dialog content closes the dialog)
  dialog.addEventListener('click', (event) => {
    // If clicking directly on the dialog element itself (which stretches to cover backdrop)
    if (event.target === dialog) {
      closeZoomModal();
      return;
    }

    // Coordinate-based check to verify if the click was outside the dialog content box
    const content = dialog.querySelector('.zoom-dialog-content');
    if (content) {
      const rect = content.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      if (!isDialogContent) {
        closeZoomModal();
      }
    }
  });
}
