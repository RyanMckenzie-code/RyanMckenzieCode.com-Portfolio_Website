const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('[data-reveal]');
const yearElement = document.getElementById('year');
const projectsGrid = document.querySelector('.projects-grid');
const projectCards = document.querySelectorAll('.project-card[data-project-category]');
const projectFilters = document.querySelectorAll('[data-project-filter]');
const systemsToggle = document.querySelector('[data-systems-toggle]');
const demoSection = document.getElementById('tower-defense-demo');
const mediaToggles = document.querySelectorAll('[data-media-toggle]');
const mediaSection = document.getElementById('swim-media');
const pixelCloud = document.querySelector('.pixel-cloud');
const sitePreviewCards = document.querySelectorAll('.site-preview-card');
const demoCarousel = document.querySelector('[data-demo-carousel]');
const demoRuntimes = document.querySelectorAll('[data-demo-runtime]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  document.documentElement.classList.remove('is-loading');
});

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (revealItems.length > 0) {
  revealItems.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${(index % 6) * 70}ms`);
  });
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

if (projectFilters.length > 0 && projectCards.length > 0) {
  const applyProjectFilter = (category) => {
    projectFilters.forEach((filterButton) => {
      filterButton.classList.toggle('is-active', filterButton.dataset.projectFilter === category);
    });

    projectCards.forEach((card) => {
      const matches = category === 'all' || card.dataset.projectCategory === category;
      card.classList.toggle('is-hidden', !matches);
    });

    if (demoSection) {
      const showDemos = category === 'all' || category === 'games';
      demoSection.classList.toggle('is-hidden', !showDemos);

      if (!showDemos) {
        demoRuntimes.forEach((shell) => {
          const frame = shell.querySelector('iframe[data-demo-src]');

          if (frame && frame.src) {
            frame.src = 'about:blank';
          }

          shell.classList.remove('is-active', 'is-loaded');
        });

        demoCarousel?.classList.remove('is-demo-running');
      }
    }
  };

  projectFilters.forEach((filterButton) => {
    filterButton.addEventListener('click', () => {
      applyProjectFilter(filterButton.dataset.projectFilter || 'all');
    });
  });

  applyProjectFilter('all');
}

if (systemsToggle && projectsGrid) {
  systemsToggle.addEventListener('click', () => {
    const nextPressed = systemsToggle.getAttribute('aria-pressed') !== 'true';
    systemsToggle.setAttribute('aria-pressed', String(nextPressed));
    systemsToggle.classList.toggle('is-active', nextPressed);
    projectsGrid.classList.toggle('is-systems-view', nextPressed);
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

const syncCarouselRuntimeState = () => {
  if (!demoCarousel) {
    return;
  }

  const hasRunningDemo = Array.from(demoRuntimes).some((shell) => shell.classList.contains('is-loaded'));
  demoCarousel.classList.toggle('is-demo-running', hasRunningDemo);
};

const unloadEmbeddedDemos = (activeShell = null) => {
  demoRuntimes.forEach((shell) => {
    if (shell === activeShell) {
      return;
    }

    unloadDemoFrame(shell.querySelector('iframe[data-demo-src]'), shell);
  });

  syncCarouselRuntimeState();
};

const loadEmbeddedDemo = (shell) => {
  const frame = shell.querySelector('iframe[data-demo-src]');

  if (!frame || !frame.dataset.demoSrc) {
    return;
  }

  unloadEmbeddedDemos(shell);

  if (frame.src !== frame.dataset.demoSrc) {
    frame.addEventListener('load', () => {
      shell.classList.add('is-loaded');
      syncCarouselRuntimeState();
    }, { once: true });
    frame.src = frame.dataset.demoSrc;
  } else {
    shell.classList.add('is-loaded');
    syncCarouselRuntimeState();
  }

  shell.classList.add('is-active');
};

const getCircularOffset = (index, activeIndex, total) => {
  let delta = index - activeIndex;

  if (delta > total / 2) {
    delta -= total;
  }

  if (delta < -total / 2) {
    delta += total;
  }

  return delta;
};

const initCarousel = ({
  root,
  slideSelector,
  prevSelector,
  nextSelector,
  currentSelector,
  totalSelector,
  captionSelector = null,
  updateSlide,
  onAfterUpdate = null,
}) => {
  if (!root) {
    return null;
  }

  const slides = Array.from(root.querySelectorAll(slideSelector));
  const prevButton = root.querySelector(prevSelector);
  const nextButton = root.querySelector(nextSelector);
  const currentLabel = root.querySelector(currentSelector);
  const totalLabel = root.querySelector(totalSelector);
  const captionLabel = captionSelector ? root.querySelector(captionSelector) : null;
  let activeIndex = 0;

  const update = () => {
    slides.forEach((slide, index) => {
      const offset = getCircularOffset(index, activeIndex, slides.length);
      updateSlide(slide, index, offset, activeIndex);
    });

    if (currentLabel) {
      currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
    }

    if (totalLabel) {
      totalLabel.textContent = String(slides.length).padStart(2, '0');
    }

    if (captionLabel) {
      captionLabel.textContent = slides[activeIndex]?.dataset.carouselCaption || '';
    }

    onAfterUpdate?.(slides, activeIndex);
  };

  prevButton?.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    update();
  });

  nextButton?.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % slides.length;
    update();
  });

  update();

  return {
    update,
    getActiveIndex: () => activeIndex,
  };
};

if (demoCarousel) {
  const demoSlides = Array.from(demoCarousel.querySelectorAll('[data-demo-slide]'));
  const demoDetails = Array.from(document.querySelectorAll('[data-demo-detail]'));

  const unloadInactiveSlides = () => {
    demoSlides.forEach((slide, index) => {
      const isActive = slide.classList.contains('is-active');

      if (isActive) {
        return;
      }

      slide.querySelectorAll('[data-demo-runtime]').forEach((shell) => {
        unloadDemoFrame(shell.querySelector('iframe[data-demo-src]'), shell);
      });
    });
  };

  initCarousel({
    root: demoCarousel,
    slideSelector: '[data-demo-slide]',
    prevSelector: '[data-demo-prev]',
    nextSelector: '[data-demo-next]',
    currentSelector: '[data-demo-current]',
    totalSelector: '[data-demo-total]',
    updateSlide: (slide, index, offset, activeIndex) => {
      const absOffset = Math.abs(offset);

      slide.classList.toggle('is-active', index === activeIndex);
      slide.setAttribute('aria-hidden', String(index !== activeIndex));

      if (Math.abs(offset) < 0.01) {
        slide.style.transform = 'translateX(-50%) translateZ(0) rotateY(0deg) scale(1)';
        slide.style.zIndex = '3';
      } else if (offset < 0) {
        slide.style.transform =
          `translateX(calc(-50% - ${12 + absOffset * 4}rem)) translateZ(-${absOffset * 140}px) rotateY(28deg) scale(${Math.max(0.82, 1 - absOffset * 0.06)})`;
        slide.style.zIndex = String(3 - absOffset);
      } else {
        slide.style.transform =
          `translateX(calc(-50% + ${12 + absOffset * 4}rem)) translateZ(-${absOffset * 140}px) rotateY(-28deg) scale(${Math.max(0.82, 1 - absOffset * 0.06)})`;
        slide.style.zIndex = String(3 - absOffset);
      }
    },
    onAfterUpdate: (_slides, activeIndex) => {
      demoDetails.forEach((detail, index) => {
        detail.classList.toggle('is-active', index === activeIndex);
      });

      unloadInactiveSlides();
      syncCarouselRuntimeState();
    },
  });
}

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

      if (!nextExpanded) {
        mediaSection.querySelectorAll('video').forEach((video) => {
          video.pause();
        });
      }

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
        document.body.dataset.activeSection = activeId || '';

        sections.forEach((section) => {
          section.classList.toggle('is-current', section === entry.target);
        });

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
