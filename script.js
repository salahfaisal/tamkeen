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
     مودال أعمالنا فقط
  ========================= */
  const modal = document.getElementById("portfolioModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalViewer = document.getElementById("modalViewer");
  const portfolioOpenButtons = document.querySelectorAll(".portfolio-open");

  const clearModalContent = () => {
    if (!modalViewer) return;
    modalViewer.innerHTML = "";
  };

  const preventRightClick = (element) => {
    if (!element) return;
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  };

  const openModalShell = (title, desc) => {
    if (!modal || !modalTitle || !modalDesc || !modalViewer) return false;
    clearModalContent();
    modalTitle.textContent = title || "عرض المحتوى";
    modalDesc.textContent = desc || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
    return true;
  };

  const openInlinePdf = (title, desc, pdfUrl) => {
    if (!openModalShell(title, desc)) return;

    const iframe = document.createElement("iframe");
    iframe.className = "modal-pdf-frame";
    iframe.src = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
    iframe.setAttribute("title", title || "PDF Viewer");
    iframe.setAttribute("loading", "lazy");

    modalViewer.appendChild(iframe);
    preventRightClick(modalViewer);
  };

  const openInlineImage = (title, desc, imageUrl) => {
    if (!openModalShell(title, desc)) return;

    const img = document.createElement("img");
    img.className = "modal-image-preview";
    img.src = imageUrl;
    img.alt = title || "معاينة";
    img.draggable = false;

    modalViewer.appendChild(img);
    preventRightClick(img);
    preventRightClick(modalViewer);
  };

  if (portfolioOpenButtons.length) {
    portfolioOpenButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const viewerType = button.dataset.viewerType || "image";
        const title = button.dataset.title || "تفاصيل";
        const desc = button.dataset.desc || "";
        const img = button.dataset.img || "";
        const link = button.dataset.link || "";

        if (viewerType === "pdf" && link) {
          openInlinePdf(title, desc, link);
        } else {
          openInlineImage(title, desc, img || "images2/hero.jpg");
        }
      });
    });
  }

  const closeModalFn = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
    clearModalContent();
  };

  if (modalClose) modalClose.addEventListener("click", closeModalFn);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModalFn);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModalFn();
      closeMobileNav();
    }
  });

  /* =========================
     بيانات خدمات المعلمين
  ========================= */
  const teacherServices = [
    { title: "ملف إنجاز إلكتروني", type: "pdf", category: "ملفات الإنجاز", desc: "ملف مهني منظم لتوثيق الإنجازات والخبرات التعليمية إلكترونيًا.", link: "pdfs/teachers/e-portfolio-file.pdf", icon: "📄" },
    { title: "ملف إنجاز ورقي", type: "pdf", category: "ملفات الإنجاز", desc: "نسخة منظمة للطباعة والتوثيق الورقي للإنجازات المهنية.", link: "pdfs/teachers/print-portfolio-file.pdf", icon: "📄" },
    { title: "ملف نافس", type: "pdf", category: "ملفات الإنجاز", desc: "ملف خاص بأعمال الاختبارات الوطنية ومتابعة متطلباتها.", link: "pdfs/teachers/nafis-file.pdf", icon: "📄" },
    { title: "ملفات نافس", type: "pdf", category: "ملفات الإنجاز", desc: "مجموعة ملفات تدريبية وتنظيمية مرتبطة ببرامج نافس.", link: "pdfs/teachers/nafis-files.pdf", icon: "📄" },
    { title: "ملف الموهوبات", type: "pdf", category: "ملفات الإنجاز", desc: "ملف توثيقي وتنظيمي خاص ببرامج الطالبات الموهوبات.", link: "pdfs/teachers/gifted-students-file.pdf", icon: "📄" },
    { title: "ملف تحدي القراءة", type: "pdf", category: "ملفات الإنجاز", desc: "ملف مخصص لتنظيم وتوثيق أعمال وبرامج تحدي القراءة.", link: "pdfs/teachers/reading-challenge-file.pdf", icon: "📄" },
    { title: "ملف الانضباط", type: "pdf", category: "ملفات الإنجاز", desc: "ملف متابعة وتوثيق الانضباط المدرسي بأسلوب واضح ومنظم.", link: "pdfs/teachers/discipline-file.pdf", icon: "📄" },

    { title: "نماذج تدريب نافس", type: "pdf", category: "نماذج تدريبية", desc: "نماذج تدريبية تساعد على قياس الاستعداد ومتابعة الأداء.", link: "pdfs/teachers/nafis-training-models.pdf", icon: "📄" },
    { title: "أسئلة محاكية", type: "pdf", category: "نماذج تدريبية", desc: "أسئلة تدريبية محاكية تساعد في التهيئة ورفع مستوى الجاهزية.", link: "pdfs/teachers/mock-questions.pdf", icon: "📄" },
    { title: "نماذج تدريب إلكترونية عبر Microsoft Forms", type: "pdf", category: "نماذج تدريبية", desc: "نماذج إلكترونية حديثة للتدريب والمتابعة والقياس التفاعلي.", link: "pdfs/teachers/microsoft-forms-training-models.pdf", icon: "📄" },

    { title: "خطة برنامج أهلاً رمضان", type: "pdf", category: "خطط وبرامج", desc: "خطة تنفيذية منظمة لبرنامج أهلاً رمضان بصياغة جاهزة للاستخدام.", link: "pdfs/teachers/ahlan-ramadan-plan.pdf", icon: "📄" },
    { title: "خطة تنفيذ تطوير الذات", type: "pdf", category: "خطط وبرامج", desc: "خطة عملية مهنية تدعم تنمية الذات ورفع كفاءة الأداء.", link: "pdfs/teachers/self-development-plan.pdf", icon: "📄" },
    { title: "برنامج غرسة", type: "pdf", category: "خطط وبرامج", desc: "برنامج تربوي منظم قابل للتطبيق داخل البيئة المدرسية.", link: "pdfs/teachers/gharsa-program.pdf", icon: "📄" },
    { title: "دورة البيئة", type: "pdf", category: "خطط وبرامج", desc: "محتوى منظم لدورة البيئة ضمن البرامج والأنشطة التعليمية.", link: "pdfs/teachers/environment-course.pdf", icon: "📄" },
    { title: "دورة العمل التطوعي", type: "pdf", category: "خطط وبرامج", desc: "ملف منظم لدعم برامج التوعية والتدريب على العمل التطوعي.", link: "pdfs/teachers/volunteer-work-course.pdf", icon: "📄" },
    { title: "سلوكي مسؤوليتي", type: "pdf", category: "خطط وبرامج", desc: "برنامج مدرسي يدعم الانضباط والسلوك الإيجابي داخل المدرسة.", link: "pdfs/teachers/my-behavior-my-responsibility.pdf", icon: "📄" },
    { title: "مسابقة تحدي القراءة", type: "pdf", category: "خطط وبرامج", desc: "ملف جاهز لتنظيم وتنفيذ مسابقة تحدي القراءة.", link: "pdfs/teachers/reading-challenge-competition.pdf", icon: "📄" },

    { title: "أوراق عمل مادة الرياضيات", type: "pdf", category: "أوراق العمل", desc: "أوراق عمل تعليمية منظمة وقابلة للاستخدام داخل الصف مباشرة.", link: "pdfs/teachers/math-worksheets.pdf", icon: "📄" },
    { title: "أوراق عمل درس الأشكال الهندسية", type: "pdf", category: "أوراق العمل", desc: "ورقة عمل تعليمية منظمة لدرس الأشكال الهندسية.", link: "pdfs/teachers/geometric-shapes-worksheet.pdf", icon: "📄" },
    { title: "مطويات تعليمية", type: "pdf", category: "أوراق العمل", desc: "مطويات جاهزة بتنسيق حديث ومناسب للاستخدام التعليمي والتوعوي.", link: "pdfs/teachers/educational-brochures.pdf", icon: "📄" },

    { title: "خطط علاجية", type: "pdf", category: "خطط علاجية", desc: "خطط علاجية منظمة لمعالجة جوانب الضعف ودعم التحسن التدريجي.", link: "pdfs/teachers/remedial-plans.pdf", icon: "📄" },
    { title: "خطط إثرائية", type: "pdf", category: "خطط علاجية", desc: "خطط إثرائية لدعم التميز وتوسيع الخبرات التعليمية.", link: "pdfs/teachers/enrichment-plans.pdf", icon: "📄" },
    { title: "بحوث إجرائية", type: "pdf", category: "بحوث وتطوير", desc: "ملفات بحوث إجرائية بصياغة عملية ومهنية.", link: "pdfs/teachers/action-research.pdf", icon: "📄" },
    { title: "مشاريع تخرج", type: "pdf", category: "بحوث وتطوير", desc: "ملفات مشاريع تخرج مرتبة وجاهزة للعرض أو التوثيق.", link: "pdfs/teachers/graduation-projects.pdf", icon: "📄" },

    { title: "سجل الشراكة المجتمعية", type: "pdf", category: "شراكة مجتمعية", desc: "سجل توثيقي منظم لأنشطة ومشاركات الشراكة المجتمعية.", link: "pdfs/teachers/community-partnership-record.pdf", icon: "📄" },
    { title: "سجل العمل التطوعي", type: "pdf", category: "شراكة مجتمعية", desc: "سجل مرتب لتوثيق أعمال ومشاركات العمل التطوعي.", link: "pdfs/teachers/volunteer-work-record.pdf", icon: "📄" },
    { title: "خطة الشراكة", type: "pdf", category: "شراكة مجتمعية", desc: "خطة عمل منظمة لتفعيل الشراكة المجتمعية داخل المدرسة.", link: "pdfs/teachers/partnership-plan.pdf", icon: "📄" },
    { title: "ميثاق الشراكة والتطوع", type: "pdf", category: "شراكة مجتمعية", desc: "ميثاق واضح ومرتب لتنظيم الشراكة والتطوع.", link: "pdfs/teachers/partnership-volunteering-charter.pdf", icon: "📄" },
    { title: "كتابة التقارير وإضافة الشواهد", type: "pdf", category: "شراكة مجتمعية", desc: "ملف منظم للتقارير وإضافة الشواهد الداعمة للتوثيق.", link: "pdfs/teachers/reports-and-evidence.pdf", icon: "📄" },
    { title: "عمل باركودات وروابط للميثاق وحصر الخبرات", type: "pdf", category: "شراكة مجتمعية", desc: "ملف منظم لإنشاء الباركودات والروابط وتوثيق الخبرات.", link: "pdfs/teachers/barcodes-links-experience-record.pdf", icon: "📄" },
    { title: "استبيان رضا المستفيد", type: "pdf", category: "شراكة مجتمعية", desc: "استبيان جاهز لقياس رضا المستفيدين وتحسين جودة التنفيذ.", link: "pdfs/teachers/beneficiary-satisfaction-survey.pdf", icon: "📄" },
    { title: "تحليل النتائج", type: "pdf", category: "شراكة مجتمعية", desc: "ملف يدعم عرض وقراءة وتحليل النتائج بصورة واضحة.", link: "pdfs/teachers/results-analysis.pdf", icon: "📄" },

    { title: "بروشورات", type: "pdf", category: "تصميمات رسمية", desc: "نماذج بروشورات بتصميم رسمي وحديث قابلة للعرض والطباعة.", link: "pdfs/teachers/brochures.pdf", icon: "📄" },
    { title: "شهادات تقدير", type: "pdf", category: "تصميمات رسمية", desc: "نماذج شهادات تقدير جاهزة للتخصيص والطباعة.", link: "pdfs/teachers/certificates-of-appreciation.pdf", icon: "📄" },
    { title: "شهادات تطوع", type: "pdf", category: "تصميمات رسمية", desc: "شهادات تطوع بتنسيق أنيق ومناسب للتوثيق والتحفيز.", link: "pdfs/teachers/volunteering-certificates.pdf", icon: "📄" },

    { title: "عمل فيديوهات", type: "video", category: "فيديوهات عامة", desc: "إنتاج فيديوهات تعليمية ومدرسية بمظهر حديث ومناسب للعرض والنشر.", link: "videos/teachers/video-production.mp4", icon: "🎬" },
    { title: "فيديوهات بالذكاء الاصطناعي", type: "video", category: "فيديوهات عامة", desc: "محتوى مرئي حديث يوظف أدوات الذكاء الاصطناعي بأسلوب جذاب.", link: "videos/teachers/ai-videos.mp4", icon: "🤖" },
    { title: "مونتاج فيديوهات تعليمية واحتفالية وتوعوية", type: "video", category: "فيديوهات عامة", desc: "مونتاج احترافي لمحتوى تعليمي واحتفالي وتوعوي بجودة عالية.", link: "videos/teachers/educational-event-awareness-editing.mp4", icon: "🎞️" },

    { title: "اليوم الوطني", type: "video", category: "مناسبات واحتفالات", desc: "فيديو احتفالي مدرسي بتصميم حديث ومونتاج أنيق للمناسبات الوطنية.", link: "videos/teachers/national-day.mp4", icon: "🎉" },
    { title: "رؤية 2030", type: "video", category: "مناسبات واحتفالات", desc: "فيديو توعوي واحتفالي يعرض مفاهيم رؤية 2030 بأسلوب بصري جذاب.", link: "videos/teachers/vision-2030.mp4", icon: "🎯" },
    { title: "يوم المدير العالمي", type: "video", category: "مناسبات واحتفالات", desc: "فيديو احتفالي مخصص للمناسبات التقديرية داخل المدرسة.", link: "videos/teachers/world-principals-day.mp4", icon: "🏆" },
    { title: "العودة إلى المدرسة", type: "video", category: "مناسبات واحتفالات", desc: "فيديو ترحيبي وتحفيزي مناسب لبداية العام الدراسي.", link: "videos/teachers/back-to-school.mp4", icon: "🏫" },
    { title: "الموهبة", type: "video", category: "مناسبات واحتفالات", desc: "فيديو مدرسي يبرز الموهبة والتميز بأسلوب بصري حديث.", link: "videos/teachers/talent.mp4", icon: "⭐" },

    { title: "الأمن والسلامة", type: "video", category: "إذاعات مدرسية", desc: "إذاعة مدرسية أو فيديو توعوي بالذكاء الاصطناعي عن الأمن والسلامة.", link: "videos/teachers/safety-and-security-broadcast.mp4", icon: "🛡️" },
    { title: "اليوم العالمي للغة العربية", type: "video", category: "إذاعات مدرسية", desc: "إذاعة مدرسية مرئية أو مسموعة عن اليوم العالمي للغة العربية.", link: "videos/teachers/arabic-language-day-broadcast.mp4", icon: "📝" },

    { title: "حماة العزة والفخر", type: "video", category: "استعراضات مرئية", desc: "استعراض مدرسي مرئي بأسلوب حماسي وجذاب.", link: "videos/teachers/guardians-of-pride-and-honor.mp4", icon: "🎖️" },
    { title: "الكوارث الطبيعية", type: "video", category: "استعراضات مرئية", desc: "عرض مرئي توعوي عن الكوارث الطبيعية بأسلوب مشوق.", link: "videos/teachers/natural-disasters-showcase.mp4", icon: "🌪️" },

    { title: "أهمية القراءة", type: "video", category: "إعلانات مدرسية", desc: "إعلان مدرسي بصياغة مرئية جذابة لتعزيز ثقافة القراءة.", link: "videos/teachers/importance-of-reading-ad.mp4", icon: "📚" },
    { title: "فارسة الانضباط", type: "video", category: "إعلانات مدرسية", desc: "إعلان أو فيديو تحفيزي مدرسي يبرز قيمة الانضباط بأسلوب جذاب.", link: "videos/teachers/discipline-champion-ad.mp4", icon: "🌟" },
    { title: "الاختبارات الوطنية – نافس", type: "video", category: "إعلانات مدرسية", desc: "إعلان مدرسي مرئي خاص بالاختبارات الوطنية ونافس.", link: "videos/teachers/nafis-national-exams-ad.mp4", icon: "📢" },

    { title: "صلاحيات قادة المدارس", type: "guide", category: "أدلة ومواثيق", desc: "دليل تنظيمي يوضح المهام والصلاحيات داخل البيئة المدرسية.", link: "pdfs/teachers/school-leaders-authorities.pdf", icon: "📘" },
    { title: "دليل مكافحة الفساد لدى الموظف", type: "guide", category: "أدلة ومواثيق", desc: "دليل توعوي وتنظيمي يوضح الجوانب الأخلاقية والإجرائية المهمة.", link: "pdfs/teachers/anti-corruption-guide.pdf", icon: "📘" },
    { title: "ميثاق أخلاقيات الموظف", type: "guide", category: "أدلة ومواثيق", desc: "ميثاق أخلاقي منظم ومناسب للعرض والاستخدام المؤسسي.", link: "pdfs/teachers/employee-code-of-ethics.pdf", icon: "📘" },
    { title: "الدليل التنظيمي للمدارس", type: "guide", category: "أدلة ومواثيق", desc: "دليل مؤسسي شامل لتنظيم الجوانب الإدارية والتعليمية داخل المدرسة.", link: "pdfs/teachers/schools-organizational-guide.pdf", icon: "📘" }
  ];

  const teacherServicesGrid = document.getElementById("teacherServicesGrid");

  const getTypeLabel = (type) => {
    if (type === "video") return "فيديو";
    if (type === "guide") return "دليل";
    return "ملف PDF";
  };

  const renderInlinePreview = (item) => {
    if (item.type === "video") {
      return `
        <div class="teacher-service-preview">
          <video
            controls
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablepictureinpicture
            playsinline
            preload="metadata"
            oncontextmenu="return false;">
            <source src="${item.link}" type="video/mp4">
            المتصفح لا يدعم تشغيل الفيديو.
          </video>
        </div>
      `;
    }

    return `
      <div class="teacher-service-preview" oncontextmenu="return false;">
        <iframe
          src="${item.link}#toolbar=0&navpanes=0&scrollbar=1&view=FitH"
          loading="lazy"
          referrerpolicy="no-referrer"
          title="${item.title}">
        </iframe>
      </div>
    `;
  };

  const renderTeacherServices = (filter = "all") => {
    if (!teacherServicesGrid) return;

    const filtered = teacherServices.filter((item) => {
      if (filter === "all") return true;
      return item.type === filter;
    });

    teacherServicesGrid.innerHTML = filtered
      .map((item) => {
        return `
          <article class="teacher-service-card reveal" data-teacher-type="${item.type}">
            ${renderInlinePreview(item)}
            <div class="teacher-service-body">
              <div class="teacher-service-meta">
                <span class="teacher-service-type ${item.type}">${getTypeLabel(item.type)}</span>
                <span class="teacher-service-category">${item.category}</span>
              </div>
              <h3 class="teacher-service-title">${item.title}</h3>
              <p class="teacher-service-desc">${item.desc}</p>
              <div class="teacher-inline-note">
                يتم عرض المحتوى مباشرة داخل الصفحة.
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    const newRevealItems = teacherServicesGrid.querySelectorAll(".reveal");
    newRevealItems.forEach((item) => item.classList.add("visible"));

    teacherServicesGrid.querySelectorAll("video").forEach((video) => {
      video.addEventListener("contextmenu", (e) => e.preventDefault());
    });
  };

  renderTeacherServices();

  /* =========================
     فلترة خدمات المعلمين
  ========================= */
  const teacherFilterButtons = document.querySelectorAll(".teacher-filter");
  if (teacherFilterButtons.length) {
    teacherFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.teacherFilter;
        teacherFilterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        renderTeacherServices(filter);
      });
    });
  }
});
