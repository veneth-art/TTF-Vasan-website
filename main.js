/* ============================================
   TTF VASAN — UNOFFICIAL FAN HUB
   Main JavaScript — Animations & Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Loading Screen ----------
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 800);
    });
    // Fallback in case load event already fired
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 2000);
  }

  // ---------- Navigation ----------
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  // Scroll effect for nav
  let lastScrollY = 0;
  const handleNavScroll = () => {
    const currentScrollY = window.scrollY;
    if (nav) {
      if (currentScrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navLinks?.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navLinks?.classList.remove('open');
      navOverlay?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- Scroll Reveal Animations ----------
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // ---------- Counter Animation ----------
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quad
          const eased = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(eased * target);
          counter.textContent = current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        };

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
  });

  // ---------- Parallax Effect (on hero) ----------
  const heroImg = document.querySelector('.hero-bg img');
  if (heroImg) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
        if (scrollY < heroHeight) {
          const parallaxOffset = scrollY * 0.3;
          heroImg.style.transform = `scale(1.05) translateY(${parallaxOffset}px)`;
        }
      }, { passive: true });
    }
  }

  // ---------- Back to Top Button ----------
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Smooth Anchor Scrolling ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight + 24 : 94;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---------- Lazy Loading for Iframes (Videos) ----------
  const lazyIframes = document.querySelectorAll('iframe[data-src]');
  const iframeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        iframe.src = iframe.getAttribute('data-src');
        iframe.removeAttribute('data-src');
        iframeObserver.unobserve(iframe);
      }
    });
  }, { rootMargin: '200px' });

  lazyIframes.forEach(iframe => iframeObserver.observe(iframe));

  // ---------- Tilt Effect on Cards ----------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    document.querySelectorAll('.card, .news-card, .video-card, .fan-quote, .value-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -3;
        const rotateY = (x - centerX) / centerX * 3;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---------- Typing Effect for Hero ----------
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const words = ['THE RIDE.', 'THE JOURNEY.', 'THE STORY.'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 300;
      }

      setTimeout(typeEffect, delay);
    }

    typeEffect();
  }

  // ---------- Particle Background ----------
  const canvas = document.getElementById('particles-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;

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
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 68, 68, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(240, 68, 68, ${0.05 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ---------- Image Lazy Loading ----------
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => imgObserver.observe(img));
  }

// ---------- Interactive Gallery & Album Modal (Cinematic Mosaic) ----------

// Modal album viewer - no more filters, just mosaic items
if (typeof SITE_CONTENT !== 'undefined' && SITE_CONTENT.photoAlbums) {
  const galleryModal = document.getElementById('gallery-modal');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modalCategoryBadge = document.getElementById('modal-category-badge');
  const modalTitle = document.getElementById('modal-album-title');
  const modalCounterPill = document.getElementById('modal-counter-pill');
  const modalMainImg = document.getElementById('modal-main-img');
  const modalImgTitle = document.getElementById('modal-img-title');
  const modalImgCaption = document.getElementById('modal-img-caption');
  const modalCtaBtn = document.getElementById('modal-img-source');
  const modalThumbsStrip = document.getElementById('modal-thumbs-strip');
  const modalEmojiWrap = document.getElementById('modal-emoji-wrap');
  const modalClose = document.getElementById('modal-close-btn');
  const modalPrev = document.getElementById('modal-prev-btn');
  const modalNext = document.getElementById('modal-next-btn');

  let currentAlbum = null;
  let currentImageIndex = 0;

  function renderActiveImage(index) {
    if (!currentAlbum || !currentAlbum.images[index]) return;
    currentImageIndex = index;
    const imgData = currentAlbum.images[index];

    modalMainImg.style.opacity = '0';
    setTimeout(() => {
      modalMainImg.src = imgData.src;
      modalMainImg.alt = imgData.title;
      modalMainImg.style.opacity = '1';
    }, 150);

    modalImgTitle.textContent = imgData.title;
    modalImgCaption.textContent = imgData.caption;
    if (modalCounterPill) {
      modalCounterPill.textContent = (index + 1) + ' of ' + currentAlbum.images.length;
    }
    if (modalCtaBtn && imgData.source) {
      modalCtaBtn.href = imgData.source;
      modalCtaBtn.style.display = 'inline-flex';
    } else if (modalCtaBtn) {
      modalCtaBtn.style.display = 'none';
    }

    // Render emoji overlay if present
    if (modalEmojiWrap && imgData.emojis) {
      modalEmojiWrap.innerHTML = imgData.emojis.map(e => '<span>' + e + '</span>').join('');
    } else if (modalEmojiWrap) {
      modalEmojiWrap.innerHTML = '';
    }

    // Update active thumb
    const thumbItems = modalThumbsStrip.querySelectorAll('.modal-thumb-item');
    thumbItems.forEach((t, i) => {
      if (i === index) {
        t.classList.add('active');
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        t.classList.remove('active');
      }
    });
  }

  function openAlbum(albumId) {
    const album = SITE_CONTENT.photoAlbums.find(a => a.id === albumId);
    if (!album) return;
    currentAlbum = album;
    modalTitle.textContent = album.title;
    if (modalCategoryBadge) {
      modalCategoryBadge.textContent = album.categoryName || 'Moments';
    }

    // Populate thumbnail strip
    modalThumbsStrip.innerHTML = '';
    album.images.forEach((img, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'modal-thumb-item ' + (idx === 0 ? 'active' : '');
      thumb.innerHTML = '<img src="' + img.src + '" alt="' + img.title + '" loading="lazy">';
      thumb.addEventListener('click', () => renderActiveImage(idx));
      modalThumbsStrip.appendChild(thumb);
    });

    renderActiveImage(0);
    galleryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  function closeModal() {
    galleryModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Gallery item clicks (mosaic cards)
  galleryItems.forEach(card => {
    card.addEventListener('click', () => {
      const albumId = card.getAttribute('data-album');
      openAlbum(albumId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const albumId = card.getAttribute('data-album');
        openAlbum(albumId);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) closeModal();
  });

  if (modalPrev) {
    modalPrev.addEventListener('click', () => {
      if (!currentAlbum) return;
      const newIdx = (currentImageIndex - 1 + currentAlbum.images.length) % currentAlbum.images.length;
      renderActiveImage(newIdx);
    });
  }

  if (modalNext) {
    modalNext.addEventListener('click', () => {
      if (!currentAlbum) return;
      const newIdx = (currentImageIndex + 1) % currentAlbum.images.length;
      renderActiveImage(newIdx);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && modalPrev) modalPrev.click();
    if (e.key === 'ArrowRight' && modalNext) modalNext.click();
  });
}
// ---------- Newsletter Form ----------
const newsletterForm = document.getElementById('newsletter-form');
const newsletterSuccess = document.getElementById('newsletter-success');
if (newsletterForm && newsletterSuccess) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput.value) {
      newsletterForm.style.display = 'none';
      newsletterSuccess.style.display = 'block';
    }
  });
}

});
