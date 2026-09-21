/* =========================================================
   NAUMAN SHAIKH — PORTFOLIO SCRIPT
   1. Setup / feature detection
   2. Custom cursor
   3. Sticky nav + mobile menu
   4. Scroll reveal (IntersectionObserver)
   5. Nav scrollspy
   6. Hero orb parallax
   7. 3D card tilt
   8. Contact form (frontend-only)
   ========================================================= */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;

  /* ---------- 2. CUSTOM CURSOR ---------- */
  (function initCursor() {
    if (isTouch) {
      document.body.classList.add('no-custom-cursor');
      return;
    }

    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-ready');

    var ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.transform = 'translate(' + targetX + 'px,' + targetY + 'px) translate(-50%,-50%)';
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
      requestAnimationFrame(animateRing);
    }
    if (!prefersReducedMotion) animateRing();

    var interactiveSelectors = 'a, button, input, textarea, [data-tilt]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelectors)) ring.classList.add('is-active');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelectors)) ring.classList.remove('is-active');
    });
  })();

  /* ---------- 3. STICKY NAV + MOBILE MENU ---------- */
  (function initNav() {
    var navbar = document.getElementById('navbar');
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (!navbar) return;

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toggle && menu) {
      function closeMenu() {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
      function openMenu() {
        menu.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
      });
      menu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });
    }
  })();

  /* ---------- 4. SCROLL REVEAL ---------- */
  (function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- 5. NAV SCROLLSPY ---------- */
  (function initScrollspy() {
    var sections = document.querySelectorAll('main section[id]');
    var links = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (link) {
      map[link.getAttribute('href').replace('#', '')] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  })();

  /* ---------- 6. HERO ORB PARALLAX ---------- */
  (function initOrb() {
    var scene = document.getElementById('orbScene');
    var stage = document.querySelector('.hero-object');
    if (!scene || !stage || isTouch || prefersReducedMotion) return;

    stage.addEventListener('mousemove', function (e) {
      var rect = stage.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      scene.style.transform = 'rotateY(' + (x * 16) + 'deg) rotateX(' + (y * -16) + 'deg)';
    });
    stage.addEventListener('mouseleave', function () {
      scene.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  })();

  /* ---------- 7. 3D CARD TILT ---------- */
  (function initTilt() {
    if (isTouch || prefersReducedMotion) return;
    var cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          'rotateY(' + (x * 10) + 'deg) rotateX(' + (y * -10) + 'deg) translateZ(0)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
      });
    });
  })();

  /* ---------- 8. PROJECT GALLERY (reusable component) ---------- */
  /*
    Add/remove/replace screenshots per project right here. Each key
    matches a data-gallery="<key>" attribute on a .project-gallery
    div in index.html. Drop your image files anywhere you like and
    just point the paths at them — arrays can be any length.
  */
  var PROJECT_IMAGES = {
    'makhmalifresh': [
      'projects/makhmalifresh/1.png',
      'projects/makhmalifresh/2.png',
      'projects/makhmalifresh/3.png'
    ],
    'streamguard': [
      'projects/streamguard/1.png',
      'projects/streamguard/2.png',
      'projects/streamguard/3.png'
    ],
    'skillora': [
      'projects/skillora/1.png',
      'projects/skillora/2.png',
      'projects/skillora/3.png'
    ],

  };

  var ProjectGallery = (function () {
    var lightbox, lightboxImg, lightboxCounter, prevBtn, nextBtn, closeBtn;
    var activeImages = [];
    var activeIndex = 0;
    var touchStartX = null;

    function buildLightbox() {
      if (lightbox) return;

      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Project image viewer');

      lightbox.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="Close">✕</button>' +
        '<button type="button" class="lightbox-prev" aria-label="Previous image">‹</button>' +
        '<button type="button" class="lightbox-next" aria-label="Next image">›</button>' +
        '<div class="lightbox-figure">' +
          '<img class="lightbox-img" alt="">' +
        '</div>' +
        '<div class="lightbox-counter"><span class="lightbox-current">1</span> / <span class="lightbox-total">1</span></div>';

      document.body.appendChild(lightbox);

      lightboxImg = lightbox.querySelector('.lightbox-img');
      lightboxCounter = lightbox.querySelector('.lightbox-current');
      var totalEl = lightbox.querySelector('.lightbox-total');
      prevBtn = lightbox.querySelector('.lightbox-prev');
      nextBtn = lightbox.querySelector('.lightbox-next');
      closeBtn = lightbox.querySelector('.lightbox-close');

      closeBtn.addEventListener('click', close);
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) close();
      });
      prevBtn.addEventListener('click', function () { show(activeIndex - 1); });
      nextBtn.addEventListener('click', function () { show(activeIndex + 1); });

      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(activeIndex - 1);
        if (e.key === 'ArrowRight') show(activeIndex + 1);
      });

      lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      lightbox.addEventListener('touchend', function (e) {
        if (touchStartX === null) return;
        var delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) {
          delta > 0 ? show(activeIndex - 1) : show(activeIndex + 1);
        }
        touchStartX = null;
      }, { passive: true });

      lightboxCounter._totalEl = totalEl;
    }

    function show(index) {
      var len = activeImages.length;
      activeIndex = (index + len) % len;

      lightboxImg.classList.remove('is-visible');
      window.setTimeout(function () {
        lightboxImg.src = activeImages[activeIndex];
        lightboxImg.alt = 'Project screenshot ' + (activeIndex + 1);
        lightboxImg.onload = function () { lightboxImg.classList.add('is-visible'); };
      }, 90);

      lightboxCounter.textContent = activeIndex + 1;
      lightboxCounter._totalEl.textContent = len;

      var multi = len > 1;
      prevBtn.style.display = multi ? '' : 'none';
      nextBtn.style.display = multi ? '' : 'none';
    }

    function open(images, startIndex) {
      buildLightbox();
      activeImages = images;
      document.body.style.overflow = 'hidden';
      lightbox.classList.add('is-open');
      show(startIndex);
    }

    function close() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      lightboxImg.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    function fallbackMarkup() {
      return '<div class="gallery-thumb-fallback">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="M21 15l-5.5-5.5L5 20"/></svg>' +
        '<span>Image not found</span></div>';
    }

    function renderInto(container, images) {
      container.innerHTML =
        '<div class="gallery-label">Project Gallery</div>' +
        '<div class="gallery-grid"></div>';
      var grid = container.querySelector('.gallery-grid');

      images.forEach(function (src, i) {
        var thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.className = 'gallery-thumb';
        thumb.setAttribute('aria-label', 'Open image ' + (i + 1) + ' of ' + images.length);

        var img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = function () {
          thumb.innerHTML = fallbackMarkup();
        };
        thumb.appendChild(img);

        thumb.addEventListener('click', function () { open(images, i); });
        grid.appendChild(thumb);
      });
    }

    function init() {
      var containers = document.querySelectorAll('.project-gallery[data-gallery]');
      containers.forEach(function (container) {
        var key = container.getAttribute('data-gallery');
        var images = PROJECT_IMAGES[key];
        if (!images || !images.length) {
          container.remove(); // no images configured for this project — skip cleanly
          return;
        }
        renderInto(container, images);
      });
    }

    return { init: init };
  })();

  ProjectGallery.init();

  /* ---------- 8b. CONTACT FORM (frontend-only) ---------- */
  (function initForm() {
    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = 'Please fill in every field before sending.';
        return;
      }

      status.textContent = 'Sending...';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '60ef7f87-c638-496f-907d-90c2ea98eb05',
          name: form.name.value,
          email: form.email.value,
          subject: form.subject.value,
          message: form.message.value
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            status.textContent = 'Thanks — your message has been sent!';
            form.reset();
          } else {
            status.textContent = 'Something went wrong. Please try again.';
          }
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please try again.';
        });
    });
  })();

})();
