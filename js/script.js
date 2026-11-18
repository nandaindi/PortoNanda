(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];

  const supportsObserver = "IntersectionObserver" in window;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ================================
  // NAVBAR: efek saat di-scroll
  // ================================
  function initNavbarScroll() {
    const navbar = $("#mainNavbar");
    if (!navbar) return;

    const update = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  // ================================
  // NAVBAR: tutup menu mobile setelah klik link
  // ================================
  function initMobileNavClose() {
    const menu = $("#navbarContent");
    if (!menu || !window.bootstrap) return;

    $$(".navbar-nav .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (menu.classList.contains("show")) {
          bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      });
    });
  }

  // ================================
  // NAVBAR: link aktif sesuai section
  // ================================
  function initActiveNav() {
    if (!supportsObserver) return;

    const sections = $$("main > section[id]");
    const links = $$('.navbar-nav a[href^="#"]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentHash = `#${entry.target.id}`;
          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === currentHash,
            );
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ================================
  // SERTIFIKAT: tombol "More / Show Less"
  // ================================
  function initCertificateToggle() {
    const button = $("#moreCertBtn");
    const extras = $$(".extra-certificate");
    if (!button || extras.length === 0) return;

    const label = $(".button-text", button);
    const icon = $("i", button);

    button.addEventListener("click", () => {
      const expand = button.getAttribute("aria-expanded") !== "true";

      extras.forEach((item) => item.classList.toggle("show", expand));
      button.setAttribute("aria-expanded", String(expand));

      if (label) {
        label.textContent = expand ? "Show Less" : "More Certifications";
      }

      if (icon) {
        icon.classList.toggle("fa-arrow-right", !expand);
        icon.classList.toggle("fa-arrow-up", expand);
      }
    });
  }

  // ================================
  // PROYEK: filter kategori
  // ================================
  function initProjectFilter() {
    const buttons = $$(".filter-btn");
    const items = $$(".project-item");
    if (buttons.length === 0) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        buttons.forEach((btn) => {
          const isActive = btn === button;
          btn.classList.toggle("active", isActive);
          btn.setAttribute("aria-pressed", String(isActive));
        });

        items.forEach((item) => {
          const matches = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("hide", !matches);
        });
      });
    });
  }

  // ================================
  // ANIMASI: muncul saat di-scroll
  // ================================
  function initScrollReveal() {
    const targets = $$(
      [
        ".section-heading",
        ".about-image-wrapper",
        ".about-content",
        ".skill-card",
        ".certificate-card",
        ".project-card",
        ".contact-top",
      ].join(", "),
    );

    targets.forEach((el) => el.classList.add("reveal"));

    // Tanpa animasi: langsung tampilkan semuanya
    if (!supportsObserver || prefersReducedMotion) {
      targets.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    targets.forEach((el) => observer.observe(el));
  }

  // ================================
  // INIT
  // ================================
  initNavbarScroll();
  initMobileNavClose();
  initActiveNav();
  initCertificateToggle();
  initProjectFilter();
  initScrollReveal();

  document.addEventListener("DOMContentLoaded", function () {
    const roleText = document.getElementById("roleText");

    if (!roleText) return;

    const roles = [
      "UI/UX Designer",
      "Web Developer",
      "Administration & Data Management",
    ];

    let currentIndex = 0;

    setInterval(function () {
      roleText.classList.add("fade-out");

      setTimeout(function () {
        currentIndex = (currentIndex + 1) % roles.length;

        roleText.textContent = roles[currentIndex];

        roleText.classList.remove("fade-out");
        roleText.classList.add("fade-in");

        setTimeout(function () {
          roleText.classList.remove("fade-in");
        }, 400);
      }, 400);
    }, 2500);
  });

  /* ================= INFINITE CERTIFICATE CAROUSEL ================= */

  document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("certificateTrack");
    const prevBtn = document.getElementById("prevCertificate");
    const nextBtn = document.getElementById("nextCertificate");
    const indicators = document.querySelectorAll("#certificateIndicators span");

    if (!track || !prevBtn || !nextBtn) return;

    // Ambil enam sertifikat asli
    const originalSlides = Array.from(
      track.querySelectorAll(".certificate-slide"),
    );

    const totalSlides = originalSlides.length;

    if (totalSlides <= 1) return;

    // Buat duplikat untuk efek infinite loop
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

    firstClone.classList.add("certificate-clone");
    lastClone.classList.add("certificate-clone");

    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);

    const slides = Array.from(track.querySelectorAll(".certificate-slide"));

    // Posisi awal: sertifikat pertama
    let activeIndex = 0;
    let scrollTimer;

    function updateActiveSlide() {
      const trackCenter =
        track.getBoundingClientRect().left + track.clientWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const distance = Math.abs(trackCenter - slideCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      // Ubah posisi clone menjadi indeks sertifikat asli
      if (closestIndex === 0) {
        activeIndex = totalSlides - 1;
      } else if (closestIndex === totalSlides + 1) {
        activeIndex = 0;
      } else {
        activeIndex = closestIndex - 1;
      }

      slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === closestIndex);
      });

      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === activeIndex);
      });
    }

    function goToSlide(index, smooth = true) {
      const target = slides[index + 1];

      if (!target) return;

      const position =
        target.offsetLeft + target.offsetWidth / 2 - track.clientWidth / 2;

      track.scrollTo({
        left: position,
        behavior: smooth ? "smooth" : "instant",
      });
    }

    function handleInfiniteLoop() {
      const trackCenter =
        track.getBoundingClientRect().left + track.clientWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(trackCenter - (rect.left + rect.width / 2));

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      // Jika berada di clone terakhir, pindah ke sertifikat asli terakhir
      if (closestIndex === 0) {
        goToSlide(totalSlides - 1, false);
      }

      // Jika berada di clone pertama, pindah ke sertifikat asli pertama
      if (closestIndex === totalSlides + 1) {
        goToSlide(0, false);
      }

      updateActiveSlide();
    }

    // Tombol berikutnya
    nextBtn.addEventListener("click", function () {
      if (activeIndex === totalSlides - 1) {
        // Menuju clone pertama
        const target = slides[totalSlides + 1];

        track.scrollTo({
          left:
            target.offsetLeft + target.offsetWidth / 2 - track.clientWidth / 2,
          behavior: "smooth",
        });
      } else {
        goToSlide(activeIndex + 1);
      }
    });

    // Tombol sebelumnya
    prevBtn.addEventListener("click", function () {
      if (activeIndex === 0) {
        // Menuju clone terakhir
        const target = slides[0];

        track.scrollTo({
          left:
            target.offsetLeft + target.offsetWidth / 2 - track.clientWidth / 2,
          behavior: "smooth",
        });
      } else {
        goToSlide(activeIndex - 1);
      }
    });

    // Klik indikator
    indicators.forEach((indicator, index) => {
      indicator.style.cursor = "pointer";

      indicator.addEventListener("click", function () {
        goToSlide(index);
      });
    });

    // Deteksi saat geser manual atau swipe
    track.addEventListener("scroll", function () {
      updateActiveSlide();

      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(function () {
        handleInfiniteLoop();
      }, 150);
    });

    window.addEventListener("resize", function () {
      goToSlide(activeIndex, false);
    });

    // Atur posisi awal
    requestAnimationFrame(function () {
      goToSlide(0, false);
      updateActiveSlide();
    });
  });
})();
