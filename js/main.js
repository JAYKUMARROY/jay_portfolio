/**
 * Jay Kumar Roy — Personal Portfolio
 * Vanilla JS: Navigation, theme toggling, interactive accordions, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTyping();
  initSpotlight();
  initServicesAccordion();
  initFaqAccordion();
  initScrollAnimations();
  initContactForm();
  initBackToTop();
});

/* Theme toggle & persistence */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('jay_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('jay_portfolio_theme', newTheme);
    });
  });
}

/* Navigation, scroll spy, and mobile drawer */
function initNavigation() {
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const navbarWrapper = document.getElementById('navbar-wrapper');
  const mobileNavHeader = document.getElementById('mobile-navbar-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggles = document.querySelectorAll('.mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');
  const smoothLinks = document.querySelectorAll('a[href^="#"]');

  // Top scroll progress
  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${scrollPercent}%`;
  }

  // Navbar background and active section highlighting
  let ticking = false;
  function handleScroll() {
    const scrollY = window.pageYOffset;

    if (navbarWrapper) {
      navbarWrapper.classList.toggle('scrolled', scrollY > 60);
    }
    if (mobileNavHeader) {
      mobileNavHeader.classList.toggle('scrolled', scrollY > 25);
    }

    let currentSectionId = '';
    const offset = 250;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-section') === currentSectionId);
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  updateScrollProgress();

  // Mobile drawer
  if (mobileToggles.length && mobileDrawer) {
    mobileToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileToggles.forEach((t) => t.classList.toggle('active', isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    });

    mobileDrawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggles.forEach((t) => t.classList.remove('active'));
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  smoothLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || !href) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Hero typing animation */
function initTyping() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'CS (AI & ML) Undergrad',
    'Aspiring Software Developer',
    'React Native & Mobile Builder',
    'Full-Stack Web Developer',
    'Problem Solver & Builder'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeCycle() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      typingElement.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeCycle, 2200);
        return;
      }
      setTimeout(typeCycle, 70);
    } else {
      charIndex--;
      typingElement.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeCycle, 400);
        return;
      }
      setTimeout(typeCycle, 35);
    }
  }

  typeCycle();
}

/* Interactive cursor spotlight */
function initSpotlight() {
  const cursorSpotlight = document.getElementById('cursor-spotlight');
  if (!cursorSpotlight) return;

  if (window.matchMedia('(pointer: fine)').matches) {
    let spotlightTicking = false;
    document.addEventListener('mousemove', (e) => {
      if (!spotlightTicking) {
        requestAnimationFrame(() => {
          cursorSpotlight.style.left = `${e.clientX}px`;
          cursorSpotlight.style.top = `${e.clientY}px`;
          spotlightTicking = false;
        });
        spotlightTicking = true;
      }
    }, { passive: true });
  } else {
    cursorSpotlight.style.display = 'none';
  }
}

/* Services accordion auto-cycling and scrolling */
function initServicesAccordion() {
  const serviceItems = document.querySelectorAll('.service-accordion-item');
  const servicesSection = document.getElementById('services');
  const servicesList = document.querySelector('.services-list');

  if (!serviceItems.length) return;

  const CYCLE_DURATION = 4500;
  let currentIndex = 0;
  let autoTimer = null;
  let isPaused = false;
  let isSectionInView = false;

  serviceItems.forEach((item, idx) => {
    if (item.classList.contains('active')) {
      currentIndex = idx;
    }
  });

  function scrollItemIntoViewIfNeeded(element) {
    if (!element || !isSectionInView) return;
    const rect = element.getBoundingClientRect();
    const topThreshold = 85;
    const bottomThreshold = window.innerHeight - 30;

    if (rect.top < topThreshold || rect.bottom > bottomThreshold) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  function activateService(index) {
    if (index < 0 || index >= serviceItems.length) return;
    currentIndex = index;

    serviceItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('active');
        item.classList.remove('timer-running');
        void item.offsetWidth;
        if (!isPaused && isSectionInView) {
          item.classList.add('timer-running');
        }
      } else {
        item.classList.remove('active');
        item.classList.remove('timer-running');
      }
    });

    scrollItemIntoViewIfNeeded(serviceItems[index]);
  }

  function nextService() {
    const nextIndex = (currentIndex + 1) % serviceItems.length;
    activateService(nextIndex);
  }

  function startTimer() {
    stopTimer();
    if (!isSectionInView || isPaused) return;

    const currentItem = serviceItems[currentIndex];
    if (currentItem) {
      currentItem.classList.add('timer-running');
    }

    autoTimer = setInterval(nextService, CYCLE_DURATION);
  }

  function stopTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    const currentItem = serviceItems[currentIndex];
    if (currentItem) {
      currentItem.classList.remove('timer-running');
    }
  }

  serviceItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      activateService(idx);
      stopTimer();
      startTimer();
    });
  });

  if (servicesList) {
    servicesList.addEventListener('mouseenter', () => {
      isPaused = true;
      servicesList.classList.add('is-paused');
      stopTimer();
    });

    servicesList.addEventListener('mouseleave', () => {
      isPaused = false;
      servicesList.classList.remove('is-paused');
      activateService(currentIndex);
      startTimer();
    });

    let touchTimeout = null;
    servicesList.addEventListener('touchstart', () => {
      isPaused = true;
      servicesList.classList.add('is-paused');
      stopTimer();
      if (touchTimeout) clearTimeout(touchTimeout);
    }, { passive: true });

    servicesList.addEventListener('touchend', () => {
      if (touchTimeout) clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        isPaused = false;
        servicesList.classList.remove('is-paused');
        activateService(currentIndex);
        startTimer();
      }, 2500);
    }, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else if (isSectionInView && !isPaused) {
      activateService(currentIndex);
      startTimer();
    }
  });

  if ('IntersectionObserver' in window && servicesSection) {
    const servicesObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isSectionInView = entry.isIntersecting;
        if (isSectionInView) {
          activateService(currentIndex);
          startTimer();
        } else {
          stopTimer();
        }
      });
    }, { threshold: 0.15 });

    servicesObserver.observe(servicesSection);
  } else {
    isSectionInView = true;
    activateService(currentIndex);
    startTimer();
  }
}

/* FAQ accordion toggle */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* Scroll reveal and metrics counter */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if ('IntersectionObserver' in window) {
    if (revealElements.length) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      });

      revealElements.forEach((el) => revealObserver.observe(el));
    }

    if (statNumbers.length) {
      const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 1200;
            const increment = Math.ceil(target / (duration / 40));

            const counter = setInterval(() => {
              count += increment;
              if (count >= target) {
                count = target;
                clearInterval(counter);
              }
              el.textContent = `${count}+`;
            }, 40);

            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      statNumbers.forEach((el) => statObserver.observe(el));
    }
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
}

/* Contact form submission */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success-message');
  const errorMsg = document.getElementById('form-error-message');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!submitBtn) return;
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>SENDING...</span> <i class="fas fa-spinner fa-spin"></i>';

    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        if (successMsg) successMsg.style.display = 'block';
        contactForm.reset();
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }
    } catch (err) {
      if (errorMsg) errorMsg.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });
}

/* Back to top scroll button */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.pageYOffset > 400);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
