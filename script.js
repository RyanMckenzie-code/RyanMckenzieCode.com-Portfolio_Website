const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('[data-reveal]');
const yearElement = document.getElementById('year');
const demoModal = document.getElementById('demo-modal');
const demoExpandTriggers = document.querySelectorAll('[data-demo-expand]');
const demoCloseTriggers = document.querySelectorAll('[data-demo-close]');
const mediaToggles = document.querySelectorAll('[data-media-toggle]');
const mediaSection = document.getElementById('swim-media');
const pixelCloud = document.querySelector('.pixel-cloud');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (pixelCloud) {
  const pixelCount = prefersReducedMotion ? 18 : 54;

  for (let index = 0; index < pixelCount; index += 1) {
    const pixel = document.createElement('span');
    pixel.style.setProperty('--left', `${Math.random() * 100}%`);
    pixel.style.setProperty('--top', `${Math.random() * 100}%`);
    pixel.style.setProperty('--size', `${2 + Math.random() * 5}px`);
    pixel.style.setProperty('--duration', `${2.5 + Math.random() * 4}s`);
    pixel.style.setProperty('--delay', `${Math.random() * -5}s`);
    pixelCloud.appendChild(pixel);
  }
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    nav.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if (demoModal) {
  const openDemoModal = () => {
    demoModal.classList.add('is-open');
    demoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeDemoModal = () => {
    demoModal.classList.remove('is-open');
    demoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  demoExpandTriggers.forEach((trigger) => {
    trigger.addEventListener('click', openDemoModal);
  });

  demoCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closeDemoModal);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && demoModal.classList.contains('is-open')) {
      closeDemoModal();
    }
  });
}

if (mediaToggles.length > 0 && mediaSection) {
  const updateMediaToggles = (isExpanded) => {
    mediaToggles.forEach((toggle) => {
      toggle.setAttribute('aria-expanded', String(isExpanded));
      toggle.textContent = isExpanded ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
    });
  };

  updateMediaToggles(false);

  mediaToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !isExpanded;

      mediaSection.hidden = !nextExpanded;
      updateMediaToggles(nextExpanded);

      if (nextExpanded) {
        mediaSection.classList.add('is-visible');
        mediaSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
}

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if ('IntersectionObserver' in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeId = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${activeId}`;
          link.classList.toggle('is-active', isActive);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: '-15% 0px -45% 0px',
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
