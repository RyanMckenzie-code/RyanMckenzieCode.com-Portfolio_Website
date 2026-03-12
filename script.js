const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('[data-reveal]');
const yearElement = document.getElementById('year');
const demoModal = document.getElementById('demo-modal');
const demoModalFrame = demoModal ? demoModal.querySelector('.demo-modal-frame') : null;
const demoExpandTriggers = document.querySelectorAll('[data-demo-expand]');
const demoCloseTriggers = document.querySelectorAll('[data-demo-close]');
const mediaToggles = document.querySelectorAll('[data-media-toggle]');
const mediaSection = document.getElementById('swim-media');
const pixelCloud = document.querySelector('.pixel-cloud');
const sitePreviewCards = document.querySelectorAll('.site-preview-card');
const demoRuntimes = document.querySelectorAll('[data-demo-runtime]');
const extraDemoGroups = document.querySelectorAll('[data-extra-demos]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  document.documentElement.classList.remove('is-loading');
});

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

if (sitePreviewCards.length > 0) {
  sitePreviewCards.forEach((card) => {
    const frame = card.querySelector('.site-preview-frame');
    const placeholderLabel = card.querySelector('.site-preview-placeholder p');
    let hasStartedLoading = false;

    if (!frame) {
      return;
    }

    const startPreviewLoad = () => {
      if (hasStartedLoading) {
        return;
      }

      hasStartedLoading = true;

      if (placeholderLabel) {
        placeholderLabel.textContent = 'Loading live preview...';
      }

      if (frame.dataset.src) {
        frame.src = frame.dataset.src;
      }
    };

    frame.addEventListener('load', () => {
      window.setTimeout(() => {
        card.classList.add('is-loaded');
      }, 250);
    });

    card.addEventListener('mouseenter', startPreviewLoad, { once: true });
    card.addEventListener('focusin', startPreviewLoad, { once: true });
    card.addEventListener('touchstart', startPreviewLoad, { once: true });
  });
}

const unloadDemoFrame = (frame, shell = null) => {
  if (!frame) {
    return;
  }

  if (frame.src) {
    frame.src = 'about:blank';
  }

  if (shell) {
    shell.classList.remove('is-active', 'is-loaded');
  }
};

const unloadEmbeddedDemos = (activeShell = null) => {
  demoRuntimes.forEach((shell) => {
    if (shell === activeShell) {
      return;
    }

    unloadDemoFrame(shell.querySelector('iframe[data-demo-src]'), shell);
  });
};

const loadEmbeddedDemo = (shell) => {
  const frame = shell.querySelector('iframe[data-demo-src]');

  if (!frame || !frame.dataset.demoSrc) {
    return;
  }

  unloadEmbeddedDemos(shell);
  unloadDemoFrame(demoModalFrame);

  if (frame.src !== frame.dataset.demoSrc) {
    frame.addEventListener('load', () => {
      shell.classList.add('is-loaded');
    }, { once: true });
    frame.src = frame.dataset.demoSrc;
  } else {
    shell.classList.add('is-loaded');
  }

  shell.classList.add('is-active');
};

if (demoRuntimes.length > 0) {
  demoRuntimes.forEach((shell) => {
    const launchTriggers = shell.querySelectorAll('[data-demo-launch]');

    launchTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        loadEmbeddedDemo(shell);
      });
    });
  });
}

if (extraDemoGroups.length > 0) {
  extraDemoGroups.forEach((group) => {
    group.addEventListener('toggle', () => {
      if (group.open) {
        return;
      }

      group.querySelectorAll('[data-demo-runtime]').forEach((shell) => {
        unloadDemoFrame(shell.querySelector('iframe[data-demo-src]'), shell);
      });
    });
  });
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
    unloadEmbeddedDemos();

    if (demoModalFrame && demoModalFrame.dataset.demoSrc && demoModalFrame.src !== demoModalFrame.dataset.demoSrc) {
      demoModalFrame.src = demoModalFrame.dataset.demoSrc;
    }

    demoModal.classList.add('is-open');
    demoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeDemoModal = () => {
    unloadDemoFrame(demoModalFrame);
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
