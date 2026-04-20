document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* =========================
     mobile nav
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

  navToggle?.addEventListener("click", () => {
    if (mobileNav.classList.contains("show")) closeMobileNav();
    else openMobileNav();
  });

  mobileNavClose?.addEventListener("click", closeMobileNav);
  mobileNavOverlay?.addEventListener("click", closeMobileNav);
  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  /* =========================
     header + progress + top button
  ========================= */
  const header = document.getElementById("header");
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  const backToTop = document.getElementById("backToTop");

  const updateOnScroll = () => {
    if (header) {
      if (window.scrollY > 14) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }

    if (backToTop) {
      if (window.scrollY > 260) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    }

    if (scrollProgressBar) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${progress}%`;
    }
  };

  updateOnScroll();
  window.addEventListener("scroll", updateOnScroll);
  window.addEventListener("resize", updateOnScroll);

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =========================
     reveal
  ========================= */
  const activateReveal = (elements = document.querySelectorAll(".reveal")) => {
    if (!("IntersectionObserver" in window)) {
      elements.forEach((item) => item.classList.add("visible"));
      return;
    }

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

    elements.forEach((item) => revealObserver.observe(item));
  };

  activateReveal();

  /* =========================
     forms
  ========================= */
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");
  const orderForm = document.getElementById("orderForm");
  const orderSuccess = document.getElementById("orderSuccess");

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    contactSuccess.style.display = "block";
    contactForm.reset();
    setTimeout(() => {
      contactSuccess.style.display = "none";
    }, 3500);
  });

  orderForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    orderSuccess.style.display = "block";
    orderForm.reset();
    setTimeout(() => {
      orderSuccess.style.display = "none";
    }, 3500);
  });

  /* =========================
     portfolio filter
  ========================= */
  const filterButtons = document.querySelectorAll(".catalog-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      portfolioItems.forEach((item) => {
        const shouldShow = filter === "all" || item.dataset.category === filter;
        item.style.display = shouldShow ? "flex" : "none";
      });
    });
  });

  /* =========================
     modal
  ========================= */
  const modal = document.getElementById("portfolioModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalImg = document.getElementById("modalImg");
  const modalImgWrap = document.querySelector(".modal-img-wrap");
  const modalActionsRow = document.getElementById("modalActionsRow");

  const clearModalContent = () => {
    modalActionsRow.innerHTML = "";
    modalImg.style.display = "block";
    if (modalImgWrap) modalImgWrap.style.display = "block";
  };

  const openModal = ({ title, desc, img, pdf }) => {
    clearModalContent();
    modalTitle.textContent = title || "تفاصيل";
    modalDesc.textContent = desc || "";
    modalImg.src = img || "";
    modalImg.alt = title || "";

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

  const openResourceModal = ({ title, desc, kind, link }) => {
    clearModalContent();
    modalTitle.textContent = title || "تفاصيل الخدمة";
    modalDesc.textContent = desc || "";

    if (kind === "video") {
      modalImg.style.display = "none";
      if (modalImgWrap) modalImgWrap.style.display = "none";

      const wrapper = document.createElement("div");
      wrapper.className = "modal-rich-content";

      const video = document.createElement("video");
      video.className = "modal-video-player";
      video.controls = true;
      video.src = link;

      wrapper.appendChild(video);
      modalActionsRow.appendChild(wrapper);

      const actionLink = document.createElement("a");
      actionLink.href = link;
      actionLink.target = "_blank";
      actionLink.className = "btn btn-primary";
      actionLink.textContent = "فتح الفيديو";
      modalActionsRow.appendChild(actionLink);
    } else {
      modalImg.src = "images2/hero.jpg";
      modalImg.alt = title || "معاينة";

      const actionLink = document.createElement("a");
      actionLink.href = link;
      actionLink.target = "_blank";
      actionLink.className = "btn btn-primary";
      actionLink.textContent = kind === "guide" ? "فتح الدليل" : "فتح الملف";
      modalActionsRow.appendChild(actionLink);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  };

  const closeModalFn = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
    clearModalContent();
  };

  document.querySelectorAll(".portfolio-open").forEach((button) => {
    button.addEventListener("click", () => {
      openModal({
        title: button.dataset.title,
        desc: button.dataset.desc,
        img: button.dataset.img,
        pdf: button.dataset.pdf
      });
    });
  });

  modalClose?.addEventListener("click", closeModalFn);
  modalBackdrop?.addEventListener("click", closeModalFn);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModalFn();
      closeMobileNav();
    }
  });

  /* =========================
     data
  ========================= */
  const studentServices = [
    {
      title: "بحوث ومشاريع تخرج هندسية",
      type: "pdf",
      group: "engineering",
      sectionLabel: "كلية الهندسة",
      desc: "إعداد وتنظيم بحوث ومشاريع التخرج الهندسية بأسلوب أكاديمي احترافي.",
      link: "pdfs/students/engineering/engineering-research-and-graduation-projects.pdf",
      icon: "⚙️"
    },
    {
      title: "مشاريع هندسية في جميع التخصصات",
      type: "pdf",
      group: "engineering",
      sectionLabel: "كلية الهندسة",
      desc: "تنفيذ وتنظيم مشاريع هندسية متخصصة لمختلف الأقسام والتخصصات.",
      link: "pdfs/students/engineering/specialized-engineering-projects.pdf",
      icon: "🛠️"
    },
    {
      title: "تقارير وتجارب معملية مع المحاكاة",
      type: "pdf",
      group: "engineering",
      sectionLabel: "كلية الهندسة",
      desc: "إعداد لابات وتقارير عملية مع المحاكاة باستخدام البرامج المناسبة.",
      link: "pdfs/students/engineering/lab-reports-and-simulation.pdf",
      icon: "🧪"
    },
    {
      title: "رسم هندسي يدوي وبالبرامج",
      type: "pdf",
      group: "engineering",
      sectionLabel: "كلية الهندسة",
      desc: "رسم هندسي يدوي ورقمي باستخدام البرامج المتخصصة بصورة دقيقة ومنظمة.",
      link: "pdfs/students/engineering/manual-and-software-engineering-drawing.pdf",
      icon: "📐"
    },
    {
      title: "عروض تقديمية هندسية",
      type: "pdf",
      group: "engineering",
      sectionLabel: "كلية الهندسة",
      desc: "تصميم عروض تقديمية هندسية حديثة وجذابة لعرض الأفكار والمشاريع.",
      link: "pdfs/students/engineering/engineering-presentations.pdf",
      icon: "📊"
    },
    {
      title: "ترجمة وتلخيص وشرح المقررات الهندسية",
      type: "pdf",
      group: "engineering",
      sectionLabel: "كلية الهندسة",
      desc: "خدمة مساندة للمقررات الهندسية تشمل الترجمة والتلخيص والشرح الأكاديمي.",
      link: "pdfs/students/engineering/engineering-courses-translation-summary-explanation.pdf",
      icon: "📘"
    },

    {
      title: "بحوث ومشاريع تخرج",
      type: "pdf",
      group: "business",
      sectionLabel: "كلية العلوم الإدارية والاقتصادية",
      desc: "إعداد بحوث ومشاريع أكاديمية منظمة لطلبة التخصصات الإدارية والاقتصادية.",
      link: "pdfs/students/business/research-and-graduation-projects.pdf",
      icon: "📚"
    },
    {
      title: "دراسات جدوى",
      type: "pdf",
      group: "business",
      sectionLabel: "كلية العلوم الإدارية والاقتصادية",
      desc: "إعداد دراسات جدوى عملية وأكاديمية بصياغة واضحة واحترافية.",
      link: "pdfs/students/business/feasibility-studies.pdf",
      icon: "💹"
    },
    {
      title: "دراسات حالة",
      type: "pdf",
      group: "business",
      sectionLabel: "كلية العلوم الإدارية والاقتصادية",
      desc: "إعداد وتحليل دراسات الحالة وفق متطلبات المقررات الجامعية.",
      link: "pdfs/students/business/case-studies.pdf",
      icon: "📑"
    },
    {
      title: "عروض تقديمية احترافية",
      type: "pdf",
      group: "business",
      sectionLabel: "كلية العلوم الإدارية والاقتصادية",
      desc: "تصميم عروض تقديمية احترافية للمشاريع والأفكار الإدارية والاقتصادية.",
      link: "pdfs/students/business/professional-presentations.pdf",
      icon: "🖥️"
    },
    {
      title: "إعداد التكاليف والتقارير",
      type: "pdf",
      group: "business",
      sectionLabel: "كلية العلوم الإدارية والاقتصادية",
      desc: "تنظيم وإعداد التكاليف والتقارير الأكاديمية بأسلوب مهني واضح.",
      link: "pdfs/students/business/costing-and-reports.pdf",
      icon: "🧾"
    },
    {
      title: "ترجمة وتلخيص وشرح المقررات",
      type: "pdf",
      group: "business",
      sectionLabel: "كلية العلوم الإدارية والاقتصادية",
      desc: "مساندة أكاديمية للمقررات عبر الترجمة والتلخيص والشرح المبسط.",
      link: "pdfs/students/business/courses-translation-summary-explanation.pdf",
      icon: "📖"
    },

    {
      title: "بحوث وتقارير طبية",
      type: "pdf",
      group: "medical",
      sectionLabel: "كلية الطب",
      desc: "إعداد بحوث وتقارير طبية منظمة بأسلوب أكاديمي مناسب لطلبة الطب.",
      link: "pdfs/students/medical/medical-research-and-reports.pdf",
      icon: "🩺"
    },
    {
      title: "مشاريع وتقارير أكاديمية",
      type: "pdf",
      group: "medical",
      sectionLabel: "كلية الطب",
      desc: "تنسيق مشاريع وتقارير أكاديمية لطلبة التخصصات الطبية والصحية.",
      link: "pdfs/students/medical/academic-projects-and-reports.pdf",
      icon: "📋"
    },
    {
      title: "دراسة حالات",
      type: "pdf",
      group: "medical",
      sectionLabel: "كلية الطب",
      desc: "إعداد دراسات الحالات الطبية والأكاديمية بصياغة منظمة وواضحة.",
      link: "pdfs/students/medical/case-studies.pdf",
      icon: "🧬"
    },
    {
      title: "عروض تقديمية طبية",
      type: "pdf",
      group: "medical",
      sectionLabel: "كلية الطب",
      desc: "تصميم عروض تقديمية طبية حديثة ومناسبة للشرح والعرض العلمي.",
      link: "pdfs/students/medical/medical-presentations.pdf",
      icon: "🖼️"
    },
    {
      title: "ترجمة وتلخيص طبي",
      type: "pdf",
      group: "medical",
      sectionLabel: "كلية الطب",
      desc: "خدمة ترجمة وتلخيص للمحتوى الطبي والمقررات والمواد العلمية.",
      link: "pdfs/students/medical/medical-translation-and-summary.pdf",
      icon: "💊"
    },
    {
      title: "شرح المقررات الطبية",
      type: "pdf",
      group: "medical",
      sectionLabel: "كلية الطب",
      desc: "شرح أكاديمي منظم ومبسط للمقررات الطبية المختلفة.",
      link: "pdfs/students/medical/medical-courses-explanation.pdf",
      icon: "📕"
    },

    {
      title: "بحوثات تخرج",
      type: "pdf",
      group: "other",
      sectionLabel: "الكليات الأخرى",
      desc: "إعداد بحوثات تخرج لمختلف التخصصات الجامعية الأخرى.",
      link: "pdfs/students/other-colleges/graduation-research.pdf",
      icon: "🎓"
    },
    {
      title: "مشاريع تخرج مع الدوكمنت",
      type: "pdf",
      group: "other",
      sectionLabel: "الكليات الأخرى",
      desc: "تنسيق مشاريع التخرج مع التوثيق والدوكمنت الكامل.",
      link: "pdfs/students/other-colleges/graduation-projects-with-documentation.pdf",
      icon: "📁"
    },
    {
      title: "حل الواجبات والأنشطة",
      type: "pdf",
      group: "other",
      sectionLabel: "الكليات الأخرى",
      desc: "مساندة أكاديمية في حل الواجبات والأنشطة بأسلوب مرتب وواضح.",
      link: "pdfs/students/other-colleges/homework-and-activities.pdf",
      icon: "✍️"
    },
    {
      title: "إعداد التكاليف والتقارير",
      type: "pdf",
      group: "other",
      sectionLabel: "الكليات الأخرى",
      desc: "إعداد وتنظيم التكاليف والتقارير الأكاديمية لعدة تخصصات.",
      link: "pdfs/students/other-colleges/costing-and-reports.pdf",
      icon: "📄"
    },
    {
      title: "عروض تقديمية",
      type: "pdf",
      group: "other",
      sectionLabel: "الكليات الأخرى",
      desc: "تصميم عروض تقديمية أكاديمية حديثة تناسب مختلف التخصصات.",
      link: "pdfs/students/other-colleges/presentations.pdf",
      icon: "📽️"
    },
    {
      title: "تفريغ فيديوهات",
      type: "pdf",
      group: "other",
      sectionLabel: "الكليات الأخرى",
      desc: "تفريغ محتوى الفيديوهات والمحاضرات إلى نصوص أو ملفات مرتبة.",
      link: "pdfs/students/other-colleges/video-transcription.pdf",
      icon: "🎥"
    },
    {
      title: "ترجمة وتلخيص وشرح المقررات",
      type: "pdf",
      group: "other",
      sectionLabel: "الكليات الأخرى",
      desc: "خدمة شاملة لترجمة وتلخيص وشرح المقررات لمختلف الكليات الأخرى.",
      link: "pdfs/students/other-colleges/courses-translation-summary-explanation.pdf",
      icon: "📚"
    }
  ];

  const teacherServices = [
    {
      title: "ملف إنجاز إلكتروني",
      type: "pdf",
      category: "portfolio",
      sectionLabel: "ملفات الإنجاز والملفات المهنية",
      desc: "ملف مهني منظم لتوثيق الإنجازات والخبرات التعليمية إلكترونيًا.",
      link: "pdfs/teachers/e-portfolio-file.pdf",
      icon: "📄"
    },
    {
      title: "ملف إنجاز ورقي",
      type: "pdf",
      category: "portfolio",
      sectionLabel: "ملفات الإنجاز والملفات المهنية",
      desc: "نسخة منظمة للطباعة والتوثيق الورقي للإنجازات المهنية.",
      link: "pdfs/teachers/print-portfolio-file.pdf",
      icon: "📄"
    },
    {
      title: "ملف نافس",
      type: "pdf",
      category: "portfolio",
      sectionLabel: "ملفات الإنجاز والملفات المهنية",
      desc: "ملف خاص بأعمال الاختبارات الوطنية ومتابعة متطلباتها.",
      link: "pdfs/teachers/nafis-file.pdf",
      icon: "📄"
    },
    {
      title: "ملفات نافس",
      type: "pdf",
      category: "portfolio",
      sectionLabel: "ملفات الإنجاز والملفات المهنية",
      desc: "مجموعة ملفات تدريبية وتنظيمية مرتبطة ببرامج نافس.",
      link: "pdfs/teachers/nafis-files.pdf",
      icon: "📄"
    },
    {
      title: "ملف الموهوبات",
      type: "pdf",
      category: "portfolio",
      sectionLabel: "ملفات الإنجاز والملفات المهنية",
      desc: "ملف توثيقي وتنظيمي خاص ببرامج الطالبات الموهوبات.",
      link: "pdfs/teachers/gifted-students-file.pdf",
      icon: "📄"
    },
    {
      title: "ملف تحدي القراءة",
      type: "pdf",
      category: "portfolio",
      sectionLabel: "ملفات الإنجاز والملفات المهنية",
      desc: "ملف مخصص لتنظيم وتوثيق أعمال وبرامج تحدي القراءة.",
      link: "pdfs/teachers/reading-challenge-file.pdf",
      icon: "📄"
    },
    {
      title: "ملف الانضباط",
      type: "pdf",
      category: "portfolio",
      sectionLabel: "ملفات الإنجاز والملفات المهنية",
      desc: "ملف متابعة وتوثيق الانضباط المدرسي بأسلوب واضح ومنظم.",
      link: "pdfs/teachers/discipline-file.pdf",
      icon: "📄"
    },

    {
      title: "نماذج تدريب نافس",
      type: "pdf",
      category: "training",
      sectionLabel: "النماذج التدريبية والتعليمية",
      desc: "نماذج تدريبية تساعد على قياس الاستعداد ومتابعة الأداء.",
      link: "pdfs/teachers/nafis-training-models.pdf",
      icon: "📄"
    },
    {
      title: "أسئلة محاكية",
      type: "pdf",
      category: "training",
      sectionLabel: "النماذج التدريبية والتعليمية",
      desc: "أسئلة تدريبية محاكية تساعد في التهيئة ورفع مستوى الجاهزية.",
      link: "pdfs/teachers/mock-questions.pdf",
      icon: "📄"
    },
    {
      title: "نماذج تدريب إلكترونية عبر Microsoft Forms",
      type: "pdf",
      category: "training",
      sectionLabel: "النماذج التدريبية والتعليمية",
      desc: "نماذج إلكترونية حديثة للتدريب والمتابعة والقياس التفاعلي.",
      link: "pdfs/teachers/microsoft-forms-training-models.pdf",
      icon: "📄"
    },

    {
      title: "خطة برنامج أهلاً رمضان",
      type: "pdf",
      category: "plans",
      sectionLabel: "الخطط والبرامج والمبادرات",
      desc: "خطة تنفيذية منظمة لبرنامج أهلاً رمضان بصياغة جاهزة للاستخدام.",
      link: "pdfs/teachers/ahlan-ramadan-plan.pdf",
      icon: "📄"
    },
    {
      title: "خطة تنفيذ تطوير الذات",
      type: "pdf",
      category: "plans",
      sectionLabel: "الخطط والبرامج والمبادرات",
      desc: "خطة عملية مهنية تدعم تنمية الذات ورفع كفاءة الأداء.",
      link: "pdfs/teachers/self-development-plan.pdf",
      icon: "📄"
    },
    {
      title: "برنامج غرسة",
      type: "pdf",
      category: "plans",
      sectionLabel: "الخطط والبرامج والمبادرات",
      desc: "برنامج تربوي منظم قابل للتطبيق داخل البيئة المدرسية.",
      link: "pdfs/teachers/gharsa-program.pdf",
      icon: "📄"
    },
    {
      title: "دورة البيئة",
      type: "pdf",
      category: "plans",
      sectionLabel: "الخطط والبرامج والمبادرات",
      desc: "محتوى منظم لدورة البيئة ضمن البرامج والأنشطة التعليمية.",
      link: "pdfs/teachers/environment-course.pdf",
      icon: "📄"
    },
    {
      title: "دورة العمل التطوعي",
      type: "pdf",
      category: "plans",
      sectionLabel: "الخطط والبرامج والمبادرات",
      desc: "ملف منظم لدعم برامج التوعية والتدريب على العمل التطوعي.",
      link: "pdfs/teachers/volunteer-work-course.pdf",
      icon: "📄"
    },
    {
      title: "سلوكي مسؤوليتي",
      type: "pdf",
      category: "plans",
      sectionLabel: "الخطط والبرامج والمبادرات",
      desc: "برنامج مدرسي يدعم الانضباط والسلوك الإيجابي داخل المدرسة.",
      link: "pdfs/teachers/my-behavior-my-responsibility.pdf",
      icon: "📄"
    },
    {
      title: "مسابقة تحدي القراءة",
      type: "pdf",
      category: "plans",
      sectionLabel: "الخطط والبرامج والمبادرات",
      desc: "ملف جاهز لتنظيم وتنفيذ مسابقة تحدي القراءة.",
      link: "pdfs/teachers/reading-challenge-competition.pdf",
      icon: "📄"
    },

    {
      title: "أوراق عمل مادة الرياضيات",
      type: "pdf",
      category: "worksheets",
      sectionLabel: "أوراق العمل والأنشطة التعليمية",
      desc: "أوراق عمل تعليمية منظمة وقابلة للاستخدام داخل الصف مباشرة.",
      link: "pdfs/teachers/math-worksheets.pdf",
      icon: "📄"
    },
    {
      title: "أوراق عمل درس الأشكال الهندسية",
      type: "pdf",
      category: "worksheets",
      sectionLabel: "أوراق العمل والأنشطة التعليمية",
      desc: "ورقة عمل تعليمية منظمة لدرس الأشكال الهندسية.",
      link: "pdfs/teachers/geometric-shapes-worksheet.pdf",
      icon: "📄"
    },
    {
      title: "مطويات تعليمية",
      type: "pdf",
      category: "worksheets",
      sectionLabel: "أوراق العمل والأنشطة التعليمية",
      desc: "مطويات جاهزة بتنسيق حديث ومناسب للاستخدام التعليمي والتوعوي.",
      link: "pdfs/teachers/educational-brochures.pdf",
      icon: "📄"
    },

    {
      title: "خطط علاجية",
      type: "pdf",
      category: "research-support",
      sectionLabel: "الخطط العلاجية والإثرائية والبحوث",
      desc: "خطط علاجية منظمة لمعالجة جوانب الضعف ودعم التحسن التدريجي.",
      link: "pdfs/teachers/remedial-plans.pdf",
      icon: "📄"
    },
    {
      title: "خطط إثرائية",
      type: "pdf",
      category: "research-support",
      sectionLabel: "الخطط العلاجية والإثرائية والبحوث",
      desc: "خطط إثرائية لدعم التميز وتوسيع الخبرات التعليمية.",
      link: "pdfs/teachers/enrichment-plans.pdf",
      icon: "📄"
    },
    {
      title: "بحوث إجرائية",
      type: "pdf",
      category: "research-support",
      sectionLabel: "الخطط العلاجية والإثرائية والبحوث",
      desc: "ملفات بحوث إجرائية بصياغة عملية ومهنية.",
      link: "pdfs/teachers/action-research.pdf",
      icon: "📄"
    },
    {
      title: "مشاريع تخرج",
      type: "pdf",
      category: "research-support",
      sectionLabel: "الخطط العلاجية والإثرائية والبحوث",
      desc: "ملفات مشاريع تخرج مرتبة وجاهزة للعرض أو التوثيق.",
      link: "pdfs/teachers/graduation-projects.pdf",
      icon: "📄"
    },

    {
      title: "سجل الشراكة المجتمعية",
      type: "pdf",
      category: "partnership",
      sectionLabel: "الشراكة المجتمعية والعمل التطوعي",
      desc: "سجل توثيقي منظم لأنشطة ومشاركات الشراكة المجتمعية.",
      link: "pdfs/teachers/community-partnership-record.pdf",
      icon: "📄"
    },
    {
      title: "سجل العمل التطوعي",
      type: "pdf",
      category: "partnership",
      sectionLabel: "الشراكة المجتمعية والعمل التطوعي",
      desc: "سجل مرتب لتوثيق أعمال ومشاركات العمل التطوعي.",
      link: "pdfs/teachers/volunteer-work-record.pdf",
      icon: "📄"
    },
    {
      title: "خطة الشراكة",
      type: "pdf",
      category: "partnership",
      sectionLabel: "الشراكة المجتمعية والعمل التطوعي",
      desc: "خطة عمل منظمة لتفعيل الشراكة المجتمعية داخل المدرسة.",
      link: "pdfs/teachers/partnership-plan.pdf",
      icon: "📄"
    },
    {
      title: "ميثاق الشراكة والتطوع",
      type: "pdf",
      category: "partnership",
      sectionLabel: "الشراكة المجتمعية والعمل التطوعي",
      desc: "ميثاق واضح ومرتب لتنظيم الشراكة والتطوع.",
      link: "pdfs/teachers/partnership-volunteering-charter.pdf",
      icon: "📄"
    },
    {
      title: "كتابة التقارير وإضافة الشواهد",
      type: "pdf",
      category: "partnership",
      sectionLabel: "الشراكة المجتمعية والعمل التطوعي",
      desc: "ملف منظم للتقارير وإضافة الشواهد الداعمة للتوثيق.",
      link: "pdfs/teachers/reports-and-evidence.pdf",
      icon: "📄"
    },
    {
      title: "عمل باركودات وروابط للميثاق وحصر الخبرات",
      type: "pdf",
      category: "partnership",
      sectionLabel: "الشراكة المجتمعية والعمل التطوعي",
      desc: "ملف منظم لإنشاء الباركودات والروابط وتوثيق الخبرات.",
      link: "pdfs/teachers/barcodes-links-experience-record.pdf",
      icon: "📄"
    },
    {
      title: "استبيان رضا المستفيد",
      type: "pdf",
      category: "partnership",
      sectionLabel: "الشراكة المجتمعية والعمل التطوعي",
      desc: "استبيان جاهز لقياس رضا المستفيدين وتحسين جودة التنفيذ.",
      link: "pdfs/teachers/beneficiary-satisfaction-survey.pdf",
      icon: "📄"
    },
    {
      title: "تحليل النتائج",
      type: "pdf",
      category: "partnership",
      sectionLabel: "الشراكة المجتمعية والعمل التطوعي",
      desc: "ملف يدعم عرض وقراءة وتحليل النتائج بصورة واضحة.",
      link: "pdfs/teachers/results-analysis.pdf",
      icon: "📄"
    },

    {
      title: "بروشورات",
      type: "pdf",
      category: "designs",
      sectionLabel: "التصميمات والمخرجات الرسمية",
      desc: "نماذج بروشورات بتصميم رسمي وحديث قابلة للعرض والطباعة.",
      link: "pdfs/teachers/brochures.pdf",
      icon: "📄"
    },
    {
      title: "شهادات تقدير",
      type: "pdf",
      category: "designs",
      sectionLabel: "التصميمات والمخرجات الرسمية",
      desc: "نماذج شهادات تقدير جاهزة للتخصيص والطباعة.",
      link: "pdfs/teachers/certificates-of-appreciation.pdf",
      icon: "📄"
    },
    {
      title: "شهادات تطوع",
      type: "pdf",
      category: "designs",
      sectionLabel: "التصميمات والمخرجات الرسمية",
      desc: "شهادات تطوع بتنسيق أنيق ومناسب للتوثيق والتحفيز.",
      link: "pdfs/teachers/volunteering-certificates.pdf",
      icon: "📄"
    },

    {
      title: "عمل فيديوهات",
      type: "video",
      category: "videos",
      sectionLabel: "الفيديوهات والمونتاج",
      desc: "إنتاج فيديوهات تعليمية ومدرسية بمظهر حديث ومناسب للعرض والنشر.",
      link: "videos/teachers/video-production.mp4",
      icon: "🎬"
    },
    {
      title: "فيديوهات بالذكاء الاصطناعي",
      type: "video",
      category: "videos",
      sectionLabel: "الفيديوهات والمونتاج",
      desc: "محتوى مرئي حديث يوظف أدوات الذكاء الاصطناعي بأسلوب جذاب.",
      link: "videos/teachers/ai-videos.mp4",
      icon: "🤖"
    },
    {
      title: "مونتاج فيديوهات تعليمية واحتفالية وتوعوية",
      type: "video",
      category: "videos",
      sectionLabel: "الفيديوهات والمونتاج",
      desc: "مونتاج احترافي لمحتوى تعليمي واحتفالي وتوعوي بجودة عالية.",
      link: "videos/teachers/educational-event-awareness-editing.mp4",
      icon: "🎞️"
    },
    {
      title: "اليوم الوطني",
      type: "video",
      category: "videos",
      sectionLabel: "الفيديوهات والمونتاج",
      desc: "فيديو احتفالي مدرسي بتصميم حديث ومونتاج أنيق للمناسبات الوطنية.",
      link: "videos/teachers/national-day.mp4",
      icon: "🎉"
    },
    {
      title: "رؤية 2030",
      type: "video",
      category: "videos",
      sectionLabel: "الفيديوهات والمونتاج",
      desc: "فيديو توعوي واحتفالي يعرض مفاهيم رؤية 2030 بأسلوب بصري جذاب.",
      link: "videos/teachers/vision-2030.mp4",
      icon: "🎯"
    },
    {
      title: "يوم المدير العالمي",
      type: "video",
      category: "videos",
      sectionLabel: "الفيديوهات والمونتاج",
      desc: "فيديو احتفالي مخصص للمناسبات التقديرية داخل المدرسة.",
      link: "videos/teachers/world-principals-day.mp4",
      icon: "🏆"
    },
    {
      title: "العودة إلى المدرسة",
      type: "video",
      category: "videos",
      sectionLabel: "الفيديوهات والمونتاج",
      desc: "فيديو ترحيبي وتحفيزي مناسب لبداية العام الدراسي.",
      link: "videos/teachers/back-to-school.mp4",
      icon: "🏫"
    },
    {
      title: "الموهبة",
      type: "video",
      category: "videos",
      sectionLabel: "الفيديوهات والمونتاج",
      desc: "فيديو مدرسي يبرز الموهبة والتميز بأسلوب بصري حديث.",
      link: "videos/teachers/talent.mp4",
      icon: "⭐"
    },

    {
      title: "صلاحيات قادة المدارس",
      type: "guide",
      category: "guides",
      sectionLabel: "الأدلة والمواثيق والمحتوى التنظيمي",
      desc: "دليل تنظيمي يوضح المهام والصلاحيات داخل البيئة المدرسية.",
      link: "pdfs/teachers/school-leaders-authorities.pdf",
      icon: "📘"
    },
    {
      title: "دليل مكافحة الفساد لدى الموظف",
      type: "guide",
      category: "guides",
      sectionLabel: "الأدلة والمواثيق والمحتوى التنظيمي",
      desc: "دليل توعوي وتنظيمي يوضح الجوانب الأخلاقية والإجرائية المهمة.",
      link: "pdfs/teachers/anti-corruption-guide.pdf",
      icon: "📘"
    },
    {
      title: "ميثاق أخلاقيات الموظف",
      type: "guide",
      category: "guides",
      sectionLabel: "الأدلة والمواثيق والمحتوى التنظيمي",
      desc: "ميثاق أخلاقي منظم ومناسب للعرض والاستخدام المؤسسي.",
      link: "pdfs/teachers/employee-code-of-ethics.pdf",
      icon: "📘"
    },
    {
      title: "الدليل التنظيمي للمدارس",
      type: "guide",
      category: "guides",
      sectionLabel: "الأدلة والمواثيق والمحتوى التنظيمي",
      desc: "دليل مؤسسي شامل لتنظيم الجوانب الإدارية والتعليمية داخل المدرسة.",
      link: "pdfs/teachers/schools-organizational-guide.pdf",
      icon: "📘"
    }
  ];

  const researcherServices = [
    {
      title: "تنسيق الرسائل العلمية",
      type: "pdf",
      category: "researchers-all",
      sectionLabel: "خدمات الباحثين",
      desc: "تنسيق الرسائل والأبحاث بأسلوب أكاديمي احترافي ومنظم.",
      link: "#",
      icon: "📚"
    },
    {
      title: "مراجعة لغوية",
      type: "pdf",
      category: "researchers-all",
      sectionLabel: "خدمات الباحثين",
      desc: "مراجعة لغوية وصياغية للمحتوى الأكاديمي والبحثي.",
      link: "#",
      icon: "📝"
    },
    {
      title: "تنظيم المراجع",
      type: "pdf",
      category: "researchers-all",
      sectionLabel: "خدمات الباحثين",
      desc: "إعادة ترتيب وتنسيق المراجع والمصادر بطريقة أكاديمية سليمة.",
      link: "#",
      icon: "🔖"
    }
  ];

  const extraServices = [
    {
      title: "تصميم عروض وبروشورات",
      type: "pdf",
      category: "extras-all",
      sectionLabel: "خدمات إضافية",
      desc: "تصميم مخرجات بصرية احترافية للعرض والطباعة.",
      link: "#",
      icon: "🎨"
    },
    {
      title: "مونتاج الفيديو",
      type: "video",
      category: "extras-all",
      sectionLabel: "خدمات إضافية",
      desc: "تحرير ومونتاج الفيديوهات التعليمية والتوعوية والاحتفالية.",
      link: "#",
      icon: "🎬"
    },
    {
      title: "إنشاء مواقع إلكترونية",
      type: "pdf",
      category: "extras-all",
      sectionLabel: "خدمات إضافية",
      desc: "بناء واجهات ومواقع إلكترونية حديثة ومنظمة.",
      link: "#",
      icon: "💻"
    }
  ];

  const studentsSections = [
    { key: "engineering", label: "كلية الهندسة", hash: "students-engineering", desc: "خدمات أكاديمية متخصصة لطلبة التخصصات الهندسية." },
    { key: "business", label: "كلية العلوم الإدارية والاقتصادية", hash: "students-business", desc: "خدمات لطلبة التخصصات الإدارية والاقتصادية." },
    { key: "medical", label: "كلية الطب", hash: "students-medical", desc: "خدمات أكاديمية وتقارير وعروض لطلبة التخصصات الطبية." },
    { key: "other", label: "الكليات الأخرى", hash: "students-other", desc: "خدمات عامة لبقية التخصصات والكليات." }
  ];

  const teachersSections = [
    { key: "portfolio", label: "ملفات الإنجاز والملفات المهنية", hash: "teachers-portfolio", desc: "ملفات مهنية وتنظيمية يحتاجها المعلم أو المعلمة." },
    { key: "training", label: "النماذج التدريبية والتعليمية", hash: "teachers-training", desc: "نماذج تدريب وأسئلة محاكية وتدريب إلكتروني." },
    { key: "plans", label: "الخطط والبرامج والمبادرات", hash: "teachers-plans", desc: "خطط تنفيذية وبرامج ومبادرات مدرسية." },
    { key: "worksheets", label: "أوراق العمل والأنشطة التعليمية", hash: "teachers-worksheets", desc: "أوراق عمل ومطويات وأنشطة صفية." },
    { key: "research-support", label: "الخطط العلاجية والإثرائية والبحوث", hash: "teachers-research", desc: "خطط علاجية وإثرائية وبحوث ومشاريع." },
    { key: "partnership", label: "الشراكة المجتمعية والعمل التطوعي", hash: "teachers-partnership", desc: "سجلات وخطط وتقارير الشراكة والتطوع." },
    { key: "designs", label: "التصميمات والمخرجات الرسمية", hash: "teachers-designs", desc: "بروشورات وشهادات ومخرجات رسمية." },
    { key: "videos", label: "الفيديوهات والمونتاج", hash: "teachers-videos", desc: "فيديوهات ومونتاج وإعلانات وإذاعات مدرسية." },
    { key: "guides", label: "الأدلة والمواثيق والمحتوى التنظيمي", hash: "teachers-guides", desc: "أدلة تنظيمية ومواثيق ومحتوى مؤسسي." }
  ];

  const researchersSections = [
    { key: "researchers-all", label: "خدمات الباحثين", hash: "researchers-services", desc: "تنسيق ومراجعة وتنظيم المراجع." }
  ];

  const extrasSections = [
    { key: "extras-all", label: "الخدمات الإضافية", hash: "extras-services", desc: "تصميم، مونتاج، وإنشاء مواقع إلكترونية." }
  ];

  const libraryMainBadge = document.getElementById("libraryMainBadge");
  const libraryMainTitle = document.getElementById("libraryMainTitle");
  const libraryMainDesc = document.getElementById("libraryMainDesc");
  const libraryCount = document.getElementById("libraryCount");
  const librarySectionsCount = document.getElementById("librarySectionsCount");
  const librarySidebarTitle = document.getElementById("librarySidebarTitle");
  const librarySidebarLinks = document.getElementById("librarySidebarLinks");
  const servicesLandingGrid = document.getElementById("servicesLandingGrid");
  const servicePagesContainer = document.getElementById("servicePagesContainer");
  const libraryMainTabs = document.querySelectorAll(".library-main-tab");

  const libraryConfig = {
    students: {
      badge: "خدمات الطلاب",
      title: "الخدمات الطلابية",
      desc: "خدمات أكاديمية وجامعية متنوعة مرتبة حسب الكليات والتخصصات.",
      sidebarTitle: "أقسام خدمات الطلاب",
      sections: studentsSections,
      getItems: (key) => studentServices.filter((item) => item.group === key)
    },
    teachers: {
      badge: "خدمات المعلمين",
      title: "الخدمات الخاصة بالمعلمين",
      desc: "مكتبة منظمة لفئات المعلمين تشمل الملفات المهنية، الخطط، النماذج، الفيديوهات، والأدلة التنظيمية.",
      sidebarTitle: "أقسام خدمات المعلمين",
      sections: teachersSections,
      getItems: (key) => teacherServices.filter((item) => item.category === key)
    },
    researchers: {
      badge: "خدمات الباحثين",
      title: "خدمات الباحثين",
      desc: "خدمات مساندة للباحثين تشمل التنسيق والمراجعة وتنظيم المراجع.",
      sidebarTitle: "أقسام خدمات الباحثين",
      sections: researchersSections,
      getItems: (key) => researcherServices.filter((item) => item.category === key)
    },
    extras: {
      badge: "خدمات إضافية",
      title: "الخدمات الإضافية",
      desc: "تصميم، مونتاج، وترجمة وإنشاء مواقع إلكترونية بأسلوب منظم وحديث.",
      sidebarTitle: "الأقسام الإضافية",
      sections: extrasSections,
      getItems: (key) => extraServices.filter((item) => item.category === key)
    }
  };

  let currentLibraryTab = "students";

  const getTypeLabel = (type) => {
    if (type === "video") return "فيديو";
    if (type === "guide") return "دليل";
    return "ملف PDF";
  };

  const buildLibraryCard = (item) => {
    const openText = item.type === "video" ? "مشاهدة" : item.type === "guide" ? "عرض الدليل" : "عرض الملف";

    return `
      <article class="library-card reveal">
        <div class="library-card-icon">${item.icon}</div>
        <div class="library-card-content">
          <div class="library-card-meta">
            <span class="library-type ${item.type}">${getTypeLabel(item.type)}</span>
            <span class="library-category">${item.sectionLabel || ""}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <div class="library-card-actions">
            <button
              class="btn btn-primary library-resource-open"
              data-kind="${item.type}"
              data-title="${item.title}"
              data-desc="${item.desc}"
              data-link="${item.link}">
              ${openText}
            </button>
            <a href="${item.link}" target="_blank" class="btn btn-soft">فتح مباشر</a>
          </div>
        </div>
      </article>
    `;
  };

  const bindLibraryResourceButtons = () => {
    document.querySelectorAll(".library-resource-open").forEach((button) => {
      button.addEventListener("click", () => {
        openResourceModal({
          title: button.dataset.title,
          desc: button.dataset.desc,
          kind: button.dataset.kind,
          link: button.dataset.link
        });
      });
    });
  };

  const scrollToHashSection = () => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;

    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const renderLandingGrid = (config) => {
    servicesLandingGrid.innerHTML = config.sections
      .map((section) => {
        const items = config.getItems(section.key);
        return `
          <a class="landing-card reveal" href="#${section.hash}">
            <div class="landing-card-badge">${items.length} خدمة</div>
            <h4>${section.label}</h4>
            <p>${section.desc}</p>
          </a>
        `;
      })
      .join("");

    activateReveal(servicesLandingGrid.querySelectorAll(".reveal"));
  };

  const renderPages = (config) => {
    let total = 0;

    servicePagesContainer.innerHTML = config.sections
      .map((section) => {
        const items = config.getItems(section.key);
        total += items.length;

        return `
          <section class="service-page reveal" id="${section.hash}">
            <div class="service-page-head">
              <div>
                <span class="mini-badge">${config.badge}</span>
                <h3>${section.label}</h3>
                <p>${section.desc}</p>
              </div>
              <div class="service-page-count">
                <strong>${items.length}</strong>
                <span>خدمة</span>
              </div>
            </div>

            <div class="service-page-grid">
              ${items.map(buildLibraryCard).join("")}
            </div>
          </section>
        `;
      })
      .join("");

    libraryCount.textContent = total;
    bindLibraryResourceButtons();
    activateReveal(servicePagesContainer.querySelectorAll(".reveal"));
  };

  const renderSidebar = (config) => {
    librarySidebarLinks.innerHTML = config.sections
      .map((section) => {
        return `
          <a class="library-sidebar-link" href="#${section.hash}" data-hash="${section.hash}">
            ${section.label}
          </a>
        `;
      })
      .join("");
  };

  const renderLibrary = (tabKey) => {
    const config = libraryConfig[tabKey];
    if (!config) return;

    currentLibraryTab = tabKey;

    libraryMainTabs.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.libraryTab === tabKey);
    });

    libraryMainBadge.textContent = config.badge;
    libraryMainTitle.textContent = config.title;
    libraryMainDesc.textContent = config.desc;
    librarySidebarTitle.textContent = config.sidebarTitle;
    librarySectionsCount.textContent = config.sections.length;

    renderSidebar(config);
    renderLandingGrid(config);
    renderPages(config);
    scrollToHashSection();
  };

  libraryMainTabs.forEach((button) => {
    button.addEventListener("click", () => {
      renderLibrary(button.dataset.libraryTab);
    });
  });

  const handleHashDrivenTab = () => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    if (hash.startsWith("students-")) {
      renderLibrary("students");
    } else if (hash.startsWith("teachers-")) {
      renderLibrary("teachers");
    } else if (hash.startsWith("researchers-")) {
      renderLibrary("researchers");
    } else if (hash.startsWith("extras-")) {
      renderLibrary("extras");
    }
  };

  window.addEventListener("hashchange", handleHashDrivenTab);

  handleHashDrivenTab();
  if (!location.hash || location.hash === "#services") {
    renderLibrary("students");
  }
});
