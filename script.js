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

  if (mobileNavClose) mobileNavClose.addEventListener("click", closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener("click", closeMobileNav);

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
     نجاح النماذج
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
     بيانات خدمات المعلمين
  ========================= */
  const teacherServices = [
    /* ملفات الإنجاز والملفات المهنية */
    { title: "ملف إنجاز إلكتروني", type: "pdf", category: "ملفات الإنجاز والملفات المهنية", desc: "ملف مهني منظم لتوثيق الإنجازات والخبرات التعليمية إلكترونيًا.", link: "pdfs/teachers/e-portfolio-file.pdf", icon: "📄" },
    { title: "ملف إنجاز ورقي", type: "pdf", category: "ملفات الإنجاز والملفات المهنية", desc: "نسخة منظمة للطباعة والتوثيق الورقي للإنجازات المهنية.", link: "pdfs/teachers/print-portfolio-file.pdf", icon: "📄" },
    { title: "ملف نافس", type: "pdf", category: "ملفات الإنجاز والملفات المهنية", desc: "ملف خاص بأعمال الاختبارات الوطنية ومتابعة متطلباتها.", link: "pdfs/teachers/nafis-file.pdf", icon: "📄" },
    { title: "ملفات نافس", type: "pdf", category: "ملفات الإنجاز والملفات المهنية", desc: "مجموعة ملفات تدريبية وتنظيمية مرتبطة ببرامج نافس.", link: "pdfs/teachers/nafis-files.pdf", icon: "📄" },
    { title: "ملف الموهوبات", type: "pdf", category: "ملفات الإنجاز والملفات المهنية", desc: "ملف توثيقي وتنظيمي خاص ببرامج الطالبات الموهوبات.", link: "pdfs/teachers/gifted-students-file.pdf", icon: "📄" },
    { title: "ملف تحدي القراءة", type: "pdf", category: "ملفات الإنجاز والملفات المهنية", desc: "ملف مخصص لتنظيم وتوثيق أعمال وبرامج تحدي القراءة.", link: "pdfs/teachers/reading-challenge-file.pdf", icon: "📄" },
    { title: "ملف الانضباط", type: "pdf", category: "ملفات الإنجاز والملفات المهنية", desc: "ملف متابعة وتوثيق الانضباط المدرسي بأسلوب واضح ومنظم.", link: "pdfs/teachers/discipline-file.pdf", icon: "📄" },

    /* النماذج التدريبية والتعليمية */
    { title: "نماذج تدريب نافس", type: "pdf", category: "النماذج التدريبية والتعليمية", desc: "نماذج تدريبية تساعد على قياس الاستعداد ومتابعة الأداء.", link: "pdfs/teachers/nafis-training-models.pdf", icon: "📄" },
    { title: "أسئلة محاكية", type: "pdf", category: "النماذج التدريبية والتعليمية", desc: "أسئلة تدريبية محاكية تساعد في التهيئة ورفع مستوى الجاهزية.", link: "pdfs/teachers/mock-questions.pdf", icon: "📄" },
    { title: "نماذج تدريب إلكترونية عبر Microsoft Forms", type: "pdf", category: "النماذج التدريبية والتعليمية", desc: "نماذج إلكترونية حديثة للتدريب والمتابعة والقياس التفاعلي.", link: "pdfs/teachers/microsoft-forms-training-models.pdf", icon: "📄" },

    /* الخطط والبرامج والمبادرات */
    { title: "خطة برنامج أهلاً رمضان", type: "pdf", category: "الخطط والبرامج والمبادرات", desc: "خطة تنفيذية منظمة لبرنامج أهلاً رمضان بصياغة جاهزة للاستخدام.", link: "pdfs/teachers/ahlan-ramadan-plan.pdf", icon: "📄" },
    { title: "خطة تنفيذ تطوير الذات", type: "pdf", category: "الخطط والبرامج والمبادرات", desc: "خطة عملية مهنية تدعم تنمية الذات ورفع كفاءة الأداء.", link: "pdfs/teachers/self-development-plan.pdf", icon: "📄" },
    { title: "برنامج غرسة", type: "pdf", category: "الخطط والبرامج والمبادرات", desc: "برنامج تربوي منظم قابل للتطبيق داخل البيئة المدرسية.", link: "pdf
