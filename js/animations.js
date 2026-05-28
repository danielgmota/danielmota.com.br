document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();
  setupCounterAnimation();
  setupCardMouseEffect();
  setupTimelineFallback();
});

// Reveal elements on scroll using IntersectionObserver
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport completely
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // If stagger element, animate its children if needed or stop observing
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => observer.observe(element));
}

// Animate numeric counters in the About section
function setupCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = easeOutExpo(progress);
      
      const currentVal = Math.floor(ease * target);
      counter.textContent = currentVal + '+';

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = target + '+';
      }
    };

    window.requestAnimationFrame(step);
  };

  // Easing function for smooth numeric increase
  const easeOutExpo = (x) => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  };

  // Observe statistics container
  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(counter => animateCounter(counter));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }
}

// Interactive Premium Touch: Card background lighting following mouse cursor
function setupCardMouseEffect() {
  const cards = document.querySelectorAll('.card, .stack-card, .contact-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Timeline progressive animation fallback for browsers without scroll-driven animations (e.g. Firefox, Safari < 19)
function setupTimelineFallback() {
  const isScrollTimelineSupported = CSS.supports('animation-timeline', 'view(block)') && CSS.supports('animation-range', '0% 100%');
  
  if (isScrollTimelineSupported) return; // Let native CSS handle it

  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -20% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.timeline-content').style.opacity = '1';
        entry.target.querySelector('.timeline-content').style.transform = 'translateY(0)';
        entry.target.querySelector('.timeline-dot').style.transform = 'scale(1)';
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => {
    const content = item.querySelector('.timeline-content');
    const dot = item.querySelector('.timeline-dot');
    
    // Set initial state for JS animation fallback
    if (content) {
      content.style.opacity = '0.3';
      content.style.transform = 'translateY(15px)';
      content.style.transition = 'opacity 0.6s var(--ease-out-expo), transform 0.6s var(--ease-out-expo)';
    }
    
    observer.observe(item);
  });
}
