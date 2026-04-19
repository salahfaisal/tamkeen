document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* =========================
     بيانات خدمات المعلمين
  ========================= */
  const teacherServices = [
    { title: "ملف إنجاز إلكتروني", type: "pdf", group: "portfolio", category: "ملفات الإنجاز", desc: "ملف مهني منظم لتوثيق الإنجازات والخبرات التعليمية إلكترونيًا.", link: "pdfs/teachers/e-portfolio-file.pdf", icon: "📄" },
    { title: "ملف إنجاز ورقي", type: "pdf", group: "portfolio", category: "ملفات الإنجاز", desc: "نسخة منظمة للطباعة والتوثيق الورقي للإنجازات المهنية.", link: "pdfs/teachers/print-portfolio-file.pdf", icon: "📄" },
    { title: "ملف نافس", type: "pdf", group: "nafis", category: "ملفات الإنجاز", desc: "ملف خاص بأعمال الاختبارات الوطنية ومتابعة متطلباتها.", link: "pdfs/teachers/nafis-file.pdf", icon: "📄" },
    { title: "ملفات نافس", type: "pdf", group: "nafis", category: "ملفات الإنجاز", desc: "مجموعة ملفات تدريبية وتنظيمية مرتبطة ببرامج نافس.", link: "pdfs/teachers/nafis-files.pdf", icon: "📄" },
    { title: "ملف الموهوبات", type: "pdf", group: "portfolio", category: "ملفات الإنجاز", desc: "ملف توثيقي وتنظيمي خاص ببرامج الطالبات الموهوبات.", link: "pdfs/teachers/gifted-students-file.pdf", icon: "📄" },
    { title: "ملف تحدي القراءة", type: "pdf", group: "portfolio", category: "ملفات الإنجاز", desc: "ملف مخصص لتنظيم وتوثيق أعمال وبرامج تحدي القراءة.", link: "pdfs/teachers/reading-challenge-file.pdf", icon: "📄" },
    { title: "ملف الانضباط", type: "pdf", group: "discipline", category: "ملفات الإنجاز", desc: "ملف متابعة وتوثيق الانضباط المدرسي بأسلوب واضح ومنظم.", link: "pdfs/teachers/discipline-file.pdf", icon: "📄" },

    { title: "نماذج تدريب نافس", type: "pdf", group: "training", category: "نماذج تدريبية", desc: "نماذج تدريبية تساعد على قياس الاستعداد ومتابعة الأداء.", link: "pdfs/teachers/nafis-training-models.pdf", icon: "📄" },
    { title: "أسئلة محاكية", type: "pdf", group: "training", category: "نماذج تدريبية", desc: "أسئلة تدريبية محاكية تساعد في التهيئة ورفع مستوى الجاهزية.", link: "pdfs/teachers/mock-questions.pdf", icon: "📄" },
    { title: "نماذج تدريب إلكترونية عبر Microsoft Forms", type: "pdf", group: "training", category: "نماذج تدريبية", desc: "نماذج إلكترونية حديثة للتدريب والمتابعة والقياس التفاعلي.", link: "pdfs/teachers/microsoft-forms-training-models.pdf", icon: "📄" },

    { title: "خطة برنامج أهلاً رمضان", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "خطة تنفيذية منظمة لبرنامج أهلاً رمضان بصياغة جاهزة للاستخدام.", link: "pdfs/teachers/ahlan-ramadan-plan.pdf", icon: "📄" },
    { title: "خطة تنفيذ تطوير الذات", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "خطة عملية مهنية تدعم تنمية الذات ورفع كفاءة الأداء.", link: "pdfs/teachers/self-development-plan.pdf", icon: "📄" },
    { title: "برنامج غرسة", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "برنامج تربوي منظم قابل للتطبيق داخل البيئة المدرسية.", link: "pdfs/teachers/gharsa-program.pdf", icon: "📄" },
    { title: "دورة البيئة", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "محتوى منظم لدورة البيئة ضمن البرامج والأنشطة التعليمية.", link: "pdfs/teachers/environment-course.pdf", icon: "📄" },
    { title: "دورة العمل التطوعي", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "ملف منظم لدعم برامج التوعية والتدريب على العمل التطوعي.", link: "pdfs/teachers/volunteer-work-course.pdf", icon: "📄" },
    { title: "سلوكي مسؤوليتي", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "برنامج مدرسي يدعم الانضباط والسلوك الإيجابي داخل المدرسة.", link: "pdfs/teachers/my-behavior-my-responsibility.pdf", icon: "📄" },
    { title: "مسابقة تحدي القراءة", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "ملف جاهز لتنظيم وتنفيذ مسابقة تحدي القراءة.", link: "pdfs/teachers/reading-challenge-competition.pdf", icon: "📄" },

    { title: "أوراق عمل مادة الرياضيات", type: "pdf", group: "worksheets", category: "أوراق العمل", desc: "أوراق عمل تعليمية منظمة وقابلة للاستخدام داخل الصف مباشرة.", link: "pdfs/teachers/math-worksheets.pdf", icon: "📄" },
    { title: "أوراق عمل درس الأشكال الهندسية", type: "pdf", group: "worksheets", category: "أوراق العمل", desc: "ورقة عمل تعليمية منظمة لدرس الأشكال الهندسية.", link: "pdfs/teachers/geometric-shapes-worksheet.pdf", icon: "📄" },
    { title: "مطويات تعليمية", type: "pdf", group: "worksheets", category: "أوراق العمل", desc: "مطويات جاهزة بتنسيق حديث ومناسب للاستخدام التعليمي والتوعوي.", link: "pdfs/teachers/educational-brochures.pdf", icon: "📄" },

    { title: "خطط علاجية", type: "pdf", group: "plans", category: "خطط علاجية", desc: "خطط علاجية منظمة لمعالجة جوانب الضعف ودعم التحسن التدريجي.", link: "pdfs/teachers/remedial-plans.pdf", icon: "📄" },
    { title: "خطط إثرائية", type: "pdf", group: "plans", category: "خطط علاجية", desc: "خطط إثرائية لدعم التميز وتوسيع الخبرات التعليمية.", link: "pdfs/teachers/enrichment-plans.pdf", icon: "📄" },
    { title: "بحوث إجرائية", type: "pdf", group: "training", category: "بحوث وتطوير", desc: "ملفات بحوث إجرائية بصياغة عملية ومهنية.", link: "pdfs/teachers/action-research.pdf", icon: "📄" },
    { title: "مشاريع تخرج", type: "pdf", group: "training", category: "بحوث وتطوير", desc: "ملفات مشاريع تخرج مرتبة وجاهزة للعرض أو التوثيق.", link: "pdfs/teachers/graduation-projects.pdf", icon: "📄" },

    { title: "سجل الشراكة المجتمعية", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "سجل توثيقي منظم لأنشطة ومشاركات الشراكة المجتمعية.", link: "pdfs/teachers/community-partnership-record.pdf", icon: "📄" },
    { title: "سجل العمل التطوعي", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "سجل مرتب لتوثيق أعمال ومشاركات العمل التطوعي.", link: "pdfs/teachers/volunteer-work-record.pdf", icon: "📄" },
    { title: "خطة الشراكة", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "خطة عمل منظمة لتفعيل الشراكة المجتمعية داخل المدرسة.", link: "pdfs/teachers/partnership-plan.pdf", icon: "📄" },
    { title: "ميثاق الشراكة والتطوع", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "ميثاق واضح ومرتب لتنظيم الشراكة والتطوع.", link: "pdfs/teachers/partnership-volunteering-charter.pdf", icon: "📄" },
    { title: "كتابة التقارير وإضافة الشواهد", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "ملف منظم للتقارير وإضافة الشواهد الداعمة للتوثيق.", link: "pdfs/teachers/reports-and-evidence.pdf", icon: "📄" },
    { title: "عمل باركودات وروابط للميثاق وحصر الخبرات", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "ملف منظم لإنشاء الباركودات والروابط وتوثيق الخبرات.", link: "pdfs/teachers/barcodes-links-experience-record.pdf", icon: "📄" },
    { title: "استبيان رضا المستفيد", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "استبيان جاهز لقياس رضا المستفيدين وتحسين جودة التنفيذ.", link: "pdfs/teachers/beneficiary-satisfaction-survey.pdf", icon: "📄" },
    { title: "تحليل النتائج", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "ملف يدعم عرض وقراءة وتحليل النتائج بصورة واضحة.", link: "pdfs/teachers/results-analysis.pdf", icon: "📄" },

    { title: "بروشورات", type: "pdf", group: "design", category: "تصميمات رسمية", desc: "نماذج بروشورات بتصميم رسمي وحديث قابلة للعرض والطباعة.", link: "pdfs/teachers/brochures.pdf", icon: "📄" },
    { title: "شهادات تقدير", type: "pdf", group: "design", category: "تصميمات رسمية", desc: "نماذج شهادات تقدير جاهزة للتخصيص والطباعة.", link: "pdfs/teachers/certificates-of-appreciation.pdf", icon: "📄" },
    { title: "شهادات تطوع", type: "pdf", group: "design", category: "تصميمات رسمية", desc: "شهادات تطوع بتنسيق أنيق ومناسب للتوثيق والتحفيز.", link: "pdfs/teachers/volunteering-certificates.pdf", icon: "📄" },

    { title: "عمل فيديوهات", type: "video", group: "video", category: "فيديوهات عامة", desc: "إنتاج فيديوهات تعليمية ومدرسية بمظهر حديث ومناسب للعرض والنشر.", link: "videos/teachers/video-production.mp4", icon: "🎬" },
    { title: "فيديوهات بالذكاء الاصطناعي", type: "video", group: "video", category: "فيديوهات عامة", desc: "محتوى مرئي حديث يوظف أدوات الذكاء الاصطناعي بأسلوب جذاب.", link: "videos/teachers/ai-videos.mp4", icon: "🤖" },
    { title: "مونتاج فيديوهات تعليمية واحتفالية وتوعوية", type: "video", group: "video", category: "فيديوهات عامة", desc: "مونتاج احترافي لمحتوى تعليمي واحتفالي وتوعوي بجودة عالية.", link: "videos/teachers/educational-event-awareness-editing.mp4", icon: "🎞️" },
    { title: "اليوم الوطني", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو احتفالي مدرسي بتصميم حديث ومونتاج أنيق للمناسبات الوطنية.", link: "videos/teachers/national-day.mp4", icon: "🎉" },
    { title: "رؤية 2030", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو توعوي واحتفالي يعرض مفاهيم رؤية 2030 بأسلوب بصري جذاب.", link: "videos/teachers/vision-2030.mp4", icon: "🎯" },
    { title: "يوم المدير العالمي", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو احتفالي مخصص للمناسبات التقديرية داخل المدرسة.", link: "videos/teachers/world-principals-day.mp4", icon: "🏆" },
    { title: "العودة إلى المدرسة", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو ترحيبي وتحفيزي مناسب لبداية العام الدراسي.", link: "videos/teachers/back-to-school.mp4", icon: "🏫" },
    { title: "الموهبة", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو مدرسي يبرز الموهبة والتميز بأسلوب بصري حديث.", link: "videos/teachers/talent.mp4", icon: "⭐" },
    { title: "الأمن والسلامة", type: "video", group: "video", category: "إذاعات مدرسية", desc: "إذاعة مدرسية أو فيديو توعوي بالذكاء الاصطناعي عن الأمن والسلامة.", link: "videos/teachers/safety-and-security-broadcast.mp4", icon: "🛡️" },
    { title: "اليوم العالمي للغة العربية", type: "video", group: "video", category: "إذاعات مدرسية", desc: "إذاعة مدرسية مرئية أو مسموعة عن اليوم العالمي للغة العربية.", link: "videos/teachers/arabic-language-day-broadcast.mp4", icon: "📝" },
    { title: "حماة العزة والفخر", type: "video", group: "video", category: "استعراضات مرئية", desc: "استعراض مدرسي مرئي بأسلوب حماسي وجذاب.", link: "videos/teachers/guardians-of-pride-and-honor.mp4", icon: "🎖️" },
    { title: "الكوارث الطبيعية", type: "video", group: "video", category: "استعراضات مرئية", desc: "عرض مرئي توعوي عن الكوارث الطبيعية بأسلوب مشوق.", link: "videos/teachers/natural-disasters-showcase.mp4", icon: "🌪️" },
    { title: "أهمية القراءة", type: "video", group: "video", category: "إعلانات مدرسية", desc: "إعلان مدرسي بصياغة مرئية جذابة لتعزيز ثقافة القراءة.", link: "videos/teachers/importance-of-reading-ad.mp4", icon: "📚" },
    { title: "فارسة الانضباط", type: "video", group: "video", category: "إعلانات مدرسية", desc: "إعلان أو فيديو تحفيزي مدرسي يبرز قيمة الانضباط بأسلوب جذاب.", link: "videos/teachers/discipline-champion-ad.mp4", icon: "🌟" },
    { title: "الاختبارات الوطنية – نافس", type: "video", group: "video", category: "إعلانات مدرسية", desc: "إعلان مدرسي مرئي خاص بالاختبارات الوطنية ونافس.", link: "videos/teachers/nafis-national-exams-ad.mp4", icon: "📢" },

    { title: "صلاحيات قادة المدارس", type: "guide", group: "guides", category: "أدلة ومواثيق", desc: "دليل تنظيمي يوضح المهام والصلاحيات داخل البيئة المدرسية.", link: "pdfs/teachers/school-leaders-authorities.pdf", icon: "📘" },
    { title: "دليل مكافحة الفساد لدى الموظف", type: "guide", group: "guides", category: "أدلة ومواثيق", desc: "دليل توعوي وتنظيمي يوضح الجوانب الأخلاقية والإجرائية المهمة.", link: "pdfs/teachers/anti-corruption-guide.pdf", icon: "📘" },
    { title: "ميثاق أخلاقيات الموظف", type: "guide", group: "guides", category: "أدلة ومواثيق", desc: "ميثاق أخلاقي منظم ومناسب للعرض والاستخدام المؤسسي.", link: "pdfs/teachers/employee-code-of-ethics.pdf", icon: "📘" },
    { title: "الدليل التنظيمي للمدارس", type: "guide", group: "guides", category: "أدلة ومواثيق", desc: "دليل مؤسسي شامل لتنظيم الجوانب الإدارية والتعليمية داخل المدرسة.", link: "pdfs/teachers/schools-organizational-guide.pdf", icon: "📘" }
  ];

  const groupLabels = {
    portfolio: "ملفات الإنجاز المهنية",
    nafis: "ملفات نافس",
    discipline: "ملف الانضباط",
    training: "النماذج التدريبية",
    plans: "الخطط والبرامج",
    worksheets: "أوراق العمل",
    partnership: "الشراكة المجتمعية",
    design: "الشهادات والبروشورات",
    video: "الفيديوهات والمونتاج",
    guides: "الأدلة والمواثيق"
  };

  let currentFilter = "all";
  let currentGroup = "portfolio";
  let currentFeaturedIndex = 0;

  const teacherFeaturedViewer = document.getElementById("teacherFeaturedViewer");
  const teacherFeaturedTitle = document.getElementById("teacherFeaturedTitle");
  const teacherFeaturedDesc = document.getElementById("teacherFeaturedDesc");
  const teacherFeaturedType = document.getElementById("teacherFeaturedType");
  const teacherCardsGrid = document.getElementById("teacherCardsGrid");
  const teacherGroupsTabs = document.getElementById("teacherGroupsTabs");
  const teacherFilterButtons = document.querySelectorAll(".teacher-filter");

  const groupOrder = ["portfolio", "nafis", "discipline", "training", "plans", "worksheets", "partnership", "design", "video", "guides"];

  const getTypeLabel = (type) => {
    if (type === "video") return "فيديو";
    if (type === "guide") return "دليل";
    return "ملف PDF";
  };

  const createPreviewMarkup = (item, featured = false) => {
    const heightClass = featured ? "featured" : "card";

    if (item.type === "video") {
      return `
        <video
          class="${heightClass}"
          controls
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablepictureinpicture
          playsinline
          preload="metadata"
          oncontextmenu="return false;">
          <source src="${item.link}" type="video/mp4">
          المتصفح لا يدعم تشغيل الفيديو.
        </video>
      `;
    }

    if (item.type === "pdf" || item.type === "guide") {
      return `
        <div class="${featured ? "featured-placeholder" : "card-placeholder"}">
          <div class="${featured ? "featured-placeholder-icon" : "card-placeholder-icon"}">${item.icon}</div>
          <div>${item.title}</div>
          <div>${item.type === "guide" ? "دليل تنظيمي معروض داخل المنصة" : "ملف معروض داخل المنصة"}</div>
        </div>
      `;
    }

    return "";
  };

  const getFilteredServices = () => {
    return teacherServices.filter((item) => {
      const filterOk = currentFilter === "all" || item.type === currentFilter;
      const groupOk = item.group === currentGroup;
      return filterOk && groupOk;
    });
  };

  const updateFeatured = (items) => {
    if (!items.length) {
      teacherFeaturedViewer.innerHTML = `
        <div class="featured-placeholder">
          <div class="featured-placeholder-icon">📁</div>
          <div>لا توجد عناصر مطابقة</div>
        </div>
      `;
      teacherFeaturedTitle.textContent = "لا توجد عناصر";
      teacherFeaturedDesc.textContent = "جرّب تغيير نوع الفلترة أو اختيار مجموعة أخرى.";
      teacherFeaturedType.textContent = "محتوى";
      return;
    }

    if (currentFeaturedIndex >= items.length) currentFeaturedIndex = 0;
    const item = items[currentFeaturedIndex];

    teacherFeaturedViewer.innerHTML = createPreviewMarkup(item, true);
    teacherFeaturedTitle.textContent = item.title;
    teacherFeaturedDesc.textContent = item.desc;
    teacherFeaturedType.textContent = getTypeLabel(item.type);
  };

  const renderCards = (items) => {
    teacherCardsGrid.innerHTML = items
      .map((item, index) => {
        return `
          <article class="teacher-card reveal" data-index="${index}">
            <div class="teacher-card-preview">
              ${createPreviewMarkup(item, false)}
            </div>
            <div class="teacher-card-body">
              <div class="teacher-card-meta">
                <span class="teacher-badge ${item.type}">${getTypeLabel(item.type)}</span>
                <span class="teacher-category">${item.category}</span>
              </div>
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
            </div>
          </article>
        `;
      })
      .join("");

    teacherCardsGrid.querySelectorAll(".teacher-card").forEach((card) => {
      card.classList.add("visible");
      card.addEventListener("click", () => {
        currentFeaturedIndex = Number(card.dataset.index) || 0;
        updateFeatured(items);
        teacherFeaturedViewer.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  };

  const renderGroups = () => {
    teacherGroupsTabs.innerHTML = groupOrder
      .map((group) => {
        return `
          <button class="group-tab ${group === currentGroup ? "active" : ""}" data-group="${group}">
            ${groupLabels[group]}
          </button>
        `;
      })
      .join("");

    teacherGroupsTabs.querySelectorAll(".group-tab").forEach((button) => {
      button.addEventListener("click", () => {
        currentGroup = button.dataset.group;
        currentFeaturedIndex = 0;
        renderTeacherSection();
      });
    });
  };

  const renderTeacherSection = () => {
    const items = getFilteredServices();
    renderGroups();
    updateFeatured(items);
    renderCards(items);
  };

  renderTeacherSection();

  teacherFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      currentFeaturedIndex = 0;
      teacherFilterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderTeacherSection();
    });
  });

  document.querySelectorAll("[data-group-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const group = link.dataset.groupLink;
      if (group) {
        currentGroup = group;
        currentFeaturedIndex = 0;
        renderTeacherSection();
      }
    });
  });

  /* =========================
     القائمة الجانبية
  ========================= */
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const navToggle = document.getElementById("navToggle");
  const closeDrawer = document.getElementById("closeDrawer");

  const openDrawer = () => {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.add("show");
    drawerOverlay.classList.add("show");
    mobileDrawer.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  };

  const closeDrawerFn = () => {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.remove("show");
    drawerOverlay.classList.remove("show");
    mobileDrawer.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  };

  if (navToggle) navToggle.addEventListener("click", openDrawer);
  if (closeDrawer) closeDrawer.addEventListener("click", closeDrawerFn);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawerFn);

  document.querySelectorAll(".mobile-drawer-links a").forEach((link) => {
    link.addEventListener("click", closeDrawerFn);
  });

  /* =========================
     ظهور العناصر
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
     زر العودة للأعلى
  ========================= */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
      if (window.scrollY > 260) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    });
  }

  /* =========================
     تبديل المظهر
  ========================= */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
    });
  }

  /* =========================
     نموذج التواصل
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
      }, 3500);
    });
  }

  /* =========================
     ESC
  ========================= */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawerFn();
    }
  });
});
