document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. Typing Effect
  // ============================================================
  const typingElement = document.querySelector('.typing-text');
  const strings = [
    'Aspiring Software Developer',
    'CS (AI & ML) Student',
    'Full-Stack Enthusiast',
    'Problem Solver'
  ];
  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentString = strings[stringIndex];

    if (!isDeleting) {
      charIndex++;
      typingElement.textContent = currentString.substring(0, charIndex);

      if (charIndex === currentString.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 80);
    } else {
      charIndex--;
      typingElement.textContent = currentString.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, 40);
    }
  }

  if (typingElement) {
    type();
  }

  // ============================================================
  // 2. Navbar Scroll Effect (throttled with rAF)
  // ============================================================
  const navbar = document.querySelector('.navbar');
  let navbarTicking = false;

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    navbarTicking = false;
  }

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (!navbarTicking) {
        requestAnimationFrame(handleNavbarScroll);
        navbarTicking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // 3. Active Nav Link on Scroll
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let activeNavTicking = false;

  function highlightActiveNav() {
    let currentSectionId = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < 200) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSectionId) {
        link.classList.add('active');
      }
    });

    activeNavTicking = false;
  }

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      if (!activeNavTicking) {
        requestAnimationFrame(highlightActiveNav);
        activeNavTicking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // 4. Mobile Hamburger Menu
  // ============================================================
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // 5. Smooth Scroll
  // ============================================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================================
  // 6. Scroll Reveal Animation (Intersection Observer)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ============================================================
  // 7. Back to Top Button
  // ============================================================
  const backToTopBtn = document.querySelector('.back-to-top');
  let backToTopTicking = false;

  function handleBackToTopScroll() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    backToTopTicking = false;
  }

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (!backToTopTicking) {
        requestAnimationFrame(handleBackToTopScroll);
        backToTopTicking = true;
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }



  // ============================================================
  // 9. Skill Card Hover Tilt (micro-interaction)
  // ============================================================
  const skillCards = document.querySelectorAll('.skill-card');

  skillCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / (rect.width / 2)) * 5;
      const rotateX = -(mouseY / (rect.height / 2)) * 5;

      card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.3s ease';
      card.style.transform = 'none';
      setTimeout(() => {
        card.style.transition = '';
      }, 300);
    });
  });

  // ============================================================
  // 10. Parallax on Orbs (subtle mouse-driven)
  // ============================================================
  const orbs = document.querySelectorAll('.orb');
  let orbTicking = false;

  if (orbs.length) {
    document.addEventListener('mousemove', (e) => {
      if (!orbTicking) {
        requestAnimationFrame(() => {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const offsetX = (e.clientX - centerX) / 50;
          const offsetY = (e.clientY - centerY) / 50;

          orbs.forEach((orb) => {
            orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          });

          orbTicking = false;
        });
        orbTicking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // 11. Floating Particle System
  // ============================================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
        const colors = [
          'rgba(139, 92, 246,',  // violet
          'rgba(6, 182, 212,',   // cyan
          'rgba(244, 114, 182,', // pink
          'rgba(167, 139, 250,'  // light violet
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeDirection * 0.003;
        if (this.opacity >= 0.6 || this.opacity <= 0.05) {
          this.fadeDirection *= -1;
        }
        if (this.x < -10 || this.x > canvas.width + 10 ||
            this.y < -10 || this.y > canvas.height + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color + '0.3)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ============================================================
  // 12. Stat Counter Animation
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent.trim();
            const match = text.match(/^(\d+)/);
            if (match) {
              const target = parseInt(match[1], 10);
              const suffix = text.replace(match[1], '');
              let current = 0;
              const increment = Math.max(1, Math.ceil(target / 40));
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                el.textContent = current + suffix;
              }, 40);
            }
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));
  }

  // ============================================================
  // 13. Staggered Entrance for Skill & Project Cards
  // ============================================================
  const staggerElements = document.querySelectorAll('.skill-card, .project-card');

  if (staggerElements.length) {
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 80);
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    staggerElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      staggerObserver.observe(el);
    });
  }

  // ============================================================
  // 14. Contact Form Custom Submit Handler
  // ============================================================
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success-message');
  const errorMsg = document.getElementById('form-error-message');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btnSpan = submitBtn.querySelector('span');
      const btnIcon = submitBtn.querySelector('i');
      const originalText = btnSpan ? btnSpan.textContent : submitBtn.textContent;
      const originalIcon = btnIcon ? btnIcon.className : '';
      
      if (btnSpan) btnSpan.textContent = 'Sending...';
      if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
      submitBtn.disabled = true;

      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok) {
          // Show success message
          if (successMsg) successMsg.style.display = 'block';

          // Visually hide form inputs
          const formGroups = form.querySelectorAll('.form-group');
          formGroups.forEach((el) => {
            el.style.display = 'none';
          });
          submitBtn.style.display = 'none';

          // Reset after 5 seconds
          setTimeout(() => {
            form.reset();
            if (successMsg) successMsg.style.display = 'none';
            formGroups.forEach((el) => {
              el.style.display = '';
            });
            submitBtn.style.display = '';
            if (btnSpan) btnSpan.textContent = originalText;
            if (btnIcon) btnIcon.className = originalIcon;
            submitBtn.disabled = false;
          }, 5000);
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (err) {
        console.error('Form submission error:', err);
        if (errorMsg) errorMsg.style.display = 'block';
        if (btnSpan) btnSpan.textContent = originalText;
        if (btnIcon) btnIcon.className = originalIcon;
        submitBtn.disabled = false;
      }
    });
  }

});
