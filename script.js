document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* =========================
     القائمة الجانبية للجوال
  ========================= */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const mobileNavClose = document.getElementById("mobileNavClose");

  const openMobileNav = () => {
    if (!mobileNav || !mobileNavOverlay || !navToggle) return;
    mobileNav.classList.add("show");
    mobileNavOverlay.classList.add("show");
    navToggle.setAttribute("aria-expanded", "true");
    mobileNav.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  };

  const closeMobileNav = () => {
    if (!mobileNav || !mobileNavOverlay || !navToggle) return;
    mobileNav.classList.remove("show");
    mobileNavOverlay.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.contains("show");
      if (isOpen) closeMobileNav();
      else openMobileNav();
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener("click", closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener("click", closeMobileNav);
  }

  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });
  }

  /* =========================
     الهيدر عند التمرير
  ========================= */
  const header = document.getElementById("header");
  const updateHeaderOnScroll = () => {
    if (!header) return;
    if (window.scrollY > 16) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll);

  /* =========================
     زر العودة للأعلى
  ========================= */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    });
  }

  /* =========================
     شريط تقدم التمرير
  ========================= */
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  const updateScrollProgress = () => {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;
  };
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress);
  window.addEventListener("resize", updateScrollProgress);

  /* =========================
     ظهور العناصر أثناء التمرير
  ========================= */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  /* =========================
     نجاح نموذج التواصل
  ========================= */
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");

  if (contactForm && contactSuccess) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactSuccess.style.display = "block";
      contactForm.reset();

      setTimeout(() => {
        contactSuccess.style.display = "none";
      }, 4000);
    });
  }

  /* =========================
     نجاح نموذج الطلب
  ========================= */
  const orderForm = document.getElementById("orderForm");
  const orderSuccess = document.getElementById("orderSuccess");

  if (orderForm && orderSuccess) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      orderSuccess.style.display = "block";
      orderForm.reset();

      setTimeout(() => {
        orderSuccess.style.display = "none";
      }, 4000);
    });
  }

  /* =========================
     فلترة الأعمال
  ========================= */
  const filterButtons = document.querySelectorAll(".catalog-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        portfolioItems.forEach((item) => {
          const category = item.dataset.category;
          const shouldShow = filter === "all" || category === filter;
          item.style.display = shouldShow ? "flex" : "none";
        });
      });
    });
  }

  /* =========================
     نافذة تفاصيل العمل
  ========================= */
  const modal = document.getElementById("portfolioModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalImg = document.getElementById("modalImg");
  const modalActionsRow = document.getElementById("modalActionsRow");
  const portfolioOpenButtons = document.querySelectorAll(".portfolio-open");

  const openModal = ({ title, desc, img, pdf }) => {
    if (!modal || !modalTitle || !modalDesc || !modalImg || !modalActionsRow) return;

    modalTitle.textContent = title || "تفاصيل العمل";
    modalDesc.textContent = desc || "";
    modalImg.src = img || "";
    modalImg.alt = title || "صورة العمل";

    modalActionsRow.innerHTML = "";

    if (pdf) {
      const pdfLink = document.createElement("a");
      pdfLink.href = pdf;
      pdfLink.target = "_blank";
      pdfLink.className = "btn btn-primary";
      pdfLink.textContent = "فتح ملف PDF";
      modalActionsRow.appendChild(pdfLink);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  };

  if (portfolioOpenButtons.length) {
    portfolioOpenButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openModal({
          title: button.dataset.title,
          desc: button.dataset.desc,
          img: button.dataset.img,
          pdf: button.dataset.pdf
        });
      });
    });
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeMobileNav();
    }
  });
});
