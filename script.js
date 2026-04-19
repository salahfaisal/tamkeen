(function () {
  "use strict";

  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    const body = document.body;

    const teacherServices = [
      { title: "ملف إنجاز إلكتروني", type: "pdf", group: "portfolio", category: "ملفات الإنجاز", desc: "ملف مهني منظم لتوثيق الإنجازات والخبرات التعليمية إلكترونيًا.", link: "pdfs/teachers/e-portfolio-file.pdf", icon: "📄", thumb: "images2/teacher-portfolio-electronic.jpg" },
      { title: "ملف إنجاز ورقي", type: "pdf", group: "portfolio", category: "ملفات الإنجاز", desc: "نسخة منظمة للطباعة والتوثيق الورقي للإنجازات المهنية.", link: "pdfs/teachers/print-portfolio-file.pdf", icon: "📄", thumb: "images2/teacher-portfolio-print.jpg" },
      { title: "ملف نافس", type: "pdf", group: "nafis", category: "ملفات الإنجاز", desc: "ملف خاص بأعمال الاختبارات الوطنية ومتابعة متطلباتها.", link: "pdfs/teachers/nafis-file.pdf", icon: "📄", thumb: "images2/nafis-file.jpg" },
      { title: "ملفات نافس", type: "pdf", group: "nafis", category: "ملفات الإنجاز", desc: "مجموعة ملفات تدريبية وتنظيمية مرتبطة ببرامج نافس.", link: "pdfs/teachers/nafis-files.pdf", icon: "📄", thumb: "images2/nafis-files.jpg" },
      { title: "ملف الموهوبات", type: "pdf", group: "portfolio", category: "ملفات الإنجاز", desc: "ملف توثيقي وتنظيمي خاص ببرامج الطالبات الموهوبات.", link: "pdfs/teachers/gifted-students-file.pdf", icon: "📄", thumb: "images2/gifted-file.jpg" },
      { title: "ملف تحدي القراءة", type: "pdf", group: "portfolio", category: "ملفات الإنجاز", desc: "ملف مخصص لتنظيم وتوثيق أعمال وبرامج تحدي القراءة.", link: "pdfs/teachers/reading-challenge-file.pdf", icon: "📄", thumb: "images2/reading-challenge-file.jpg" },
      { title: "ملف الانضباط", type: "pdf", group: "discipline", category: "ملفات الإنجاز", desc: "ملف متابعة وتوثيق الانضباط المدرسي بأسلوب واضح ومنظم.", link: "pdfs/teachers/discipline-file.pdf", icon: "📄", thumb: "images2/discipline-file.jpg" },

      { title: "نماذج تدريب نافس", type: "pdf", group: "training", category: "نماذج تدريبية", desc: "نماذج تدريبية تساعد على قياس الاستعداد ومتابعة الأداء.", link: "pdfs/teachers/nafis-training-models.pdf", icon: "📄", thumb: "images2/nafis-training.jpg" },
      { title: "أسئلة محاكية", type: "pdf", group: "training", category: "نماذج تدريبية", desc: "أسئلة تدريبية محاكية تساعد في التهيئة ورفع مستوى الجاهزية.", link: "pdfs/teachers/mock-questions.pdf", icon: "📄", thumb: "images2/mock-questions.jpg" },
      { title: "نماذج تدريب إلكترونية عبر Microsoft Forms", type: "pdf", group: "training", category: "نماذج تدريبية", desc: "نماذج إلكترونية حديثة للتدريب والمتابعة والقياس التفاعلي.", link: "pdfs/teachers/microsoft-forms-training-models.pdf", icon: "📄", thumb: "images2/forms-training.jpg" },

      { title: "خطة برنامج أهلاً رمضان", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "خطة تنفيذية منظمة لبرنامج أهلاً رمضان بصياغة جاهزة للاستخدام.", link: "pdfs/teachers/ahlan-ramadan-plan.pdf", icon: "📄", thumb: "images2/ramadan-plan.jpg" },
      { title: "خطة تنفيذ تطوير الذات", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "خطة عملية مهنية تدعم تنمية الذات ورفع كفاءة الأداء.", link: "pdfs/teachers/self-development-plan.pdf", icon: "📄", thumb: "images2/self-development-plan.jpg" },
      { title: "برنامج غرسة", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "برنامج تربوي منظم قابل للتطبيق داخل البيئة المدرسية.", link: "pdfs/teachers/gharsa-program.pdf", icon: "📄", thumb: "images2/gharsa-program.jpg" },
      { title: "دورة البيئة", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "محتوى منظم لدورة البيئة ضمن البرامج والأنشطة التعليمية.", link: "pdfs/teachers/environment-course.pdf", icon: "📄", thumb: "images2/environment-course.jpg" },
      { title: "دورة العمل التطوعي", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "ملف منظم لدعم برامج التوعية والتدريب على العمل التطوعي.", link: "pdfs/teachers/volunteer-work-course.pdf", icon: "📄", thumb: "images2/volunteer-course.jpg" },
      { title: "سلوكي مسؤوليتي", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "برنامج مدرسي يدعم الانضباط والسلوك الإيجابي داخل المدرسة.", link: "pdfs/teachers/my-behavior-my-responsibility.pdf", icon: "📄", thumb: "images2/behavior-program.jpg" },
      { title: "مسابقة تحدي القراءة", type: "pdf", group: "plans", category: "خطط وبرامج", desc: "ملف جاهز لتنظيم وتنفيذ مسابقة تحدي القراءة.", link: "pdfs/teachers/reading-challenge-competition.pdf", icon: "📄", thumb: "images2/reading-competition.jpg" },

      { title: "أوراق عمل مادة الرياضيات", type: "pdf", group: "worksheets", category: "أوراق العمل", desc: "أوراق عمل تعليمية منظمة وقابلة للاستخدام داخل الصف مباشرة.", link: "pdfs/teachers/math-worksheets.pdf", icon: "📄", thumb: "images2/math-worksheets.jpg" },
      { title: "أوراق عمل درس الأشكال الهندسية", type: "pdf", group: "worksheets", category: "أوراق العمل", desc: "ورقة عمل تعليمية منظمة لدرس الأشكال الهندسية.", link: "pdfs/teachers/geometric-shapes-worksheet.pdf", icon: "📄", thumb: "images2/shapes-worksheet.jpg" },
      { title: "مطويات تعليمية", type: "pdf", group: "worksheets", category: "أوراق العمل", desc: "مطويات جاهزة بتنسيق حديث ومناسب للاستخدام التعليمي والتوعوي.", link: "pdfs/teachers/educational-brochures.pdf", icon: "📄", thumb: "images2/educational-brochures.jpg" },

      { title: "خطط علاجية", type: "pdf", group: "plans", category: "خطط علاجية", desc: "خطط علاجية منظمة لمعالجة جوانب الضعف ودعم التحسن التدريجي.", link: "pdfs/teachers/remedial-plans.pdf", icon: "📄", thumb: "images2/remedial-plans.jpg" },
      { title: "خطط إثرائية", type: "pdf", group: "plans", category: "خطط علاجية", desc: "خطط إثرائية لدعم التميز وتوسيع الخبرات التعليمية.", link: "pdfs/teachers/enrichment-plans.pdf", icon: "📄", thumb: "images2/enrichment-plans.jpg" },
      { title: "بحوث إجرائية", type: "pdf", group: "training", category: "بحوث وتطوير", desc: "ملفات بحوث إجرائية بصياغة عملية ومهنية.", link: "pdfs/teachers/action-research.pdf", icon: "📄", thumb: "images2/action-research.jpg" },
      { title: "مشاريع تخرج", type: "pdf", group: "training", category: "بحوث وتطوير", desc: "ملفات مشاريع تخرج مرتبة وجاهزة للعرض أو التوثيق.", link: "pdfs/teachers/graduation-projects.pdf", icon: "📄", thumb: "images2/graduation-projects.jpg" },

      { title: "سجل الشراكة المجتمعية", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "سجل توثيقي منظم لأنشطة ومشاركات الشراكة المجتمعية.", link: "pdfs/teachers/community-partnership-record.pdf", icon: "📄", thumb: "images2/community-partnership.jpg" },
      { title: "سجل العمل التطوعي", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "سجل مرتب لتوثيق أعمال ومشاركات العمل التطوعي.", link: "pdfs/teachers/volunteer-work-record.pdf", icon: "📄", thumb: "images2/volunteer-record.jpg" },
      { title: "خطة الشراكة", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "خطة عمل منظمة لتفعيل الشراكة المجتمعية داخل المدرسة.", link: "pdfs/teachers/partnership-plan.pdf", icon: "📄", thumb: "images2/partnership-plan.jpg" },
      { title: "ميثاق الشراكة والتطوع", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "ميثاق واضح ومرتب لتنظيم الشراكة والتطوع.", link: "pdfs/teachers/partnership-volunteering-charter.pdf", icon: "📄", thumb: "images2/partnership-charter.jpg" },
      { title: "كتابة التقارير وإضافة الشواهد", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "ملف منظم للتقارير وإضافة الشواهد الداعمة للتوثيق.", link: "pdfs/teachers/reports-and-evidence.pdf", icon: "📄", thumb: "images2/reports-evidence.jpg" },
      { title: "عمل باركودات وروابط للميثاق وحصر الخبرات", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "ملف منظم لإنشاء الباركودات والروابط وتوثيق الخبرات.", link: "pdfs/teachers/barcodes-links-experience-record.pdf", icon: "📄", thumb: "images2/barcodes-links.jpg" },
      { title: "استبيان رضا المستفيد", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "استبيان جاهز لقياس رضا المستفيدين وتحسين جودة التنفيذ.", link: "pdfs/teachers/beneficiary-satisfaction-survey.pdf", icon: "📄", thumb: "images2/beneficiary-survey.jpg" },
      { title: "تحليل النتائج", type: "pdf", group: "partnership", category: "شراكة مجتمعية", desc: "ملف يدعم عرض وقراءة وتحليل النتائج بصورة واضحة.", link: "pdfs/teachers/results-analysis.pdf", icon: "📄", thumb: "images2/results-analysis.jpg" },

      { title: "بروشورات", type: "pdf", group: "design", category: "تصميمات رسمية", desc: "نماذج بروشورات بتصميم رسمي وحديث قابلة للعرض والطباعة.", link: "pdfs/teachers/brochures.pdf", icon: "📄", thumb: "images2/brochures.jpg" },
      { title: "شهادات تقدير", type: "pdf", group: "design", category: "تصميمات رسمية", desc: "نماذج شهادات تقدير جاهزة للتخصيص والطباعة.", link: "pdfs/teachers/certificates-of-appreciation.pdf", icon: "📄", thumb: "images2/certificates-appreciation.jpg" },
      { title: "شهادات تطوع", type: "pdf", group: "design", category: "تصميمات رسمية", desc: "شهادات تطوع بتنسيق أنيق ومناسب للتوثيق والتحفيز.", link: "pdfs/teachers/volunteering-certificates.pdf", icon: "📄", thumb: "images2/volunteer-certificates.jpg" },

      { title: "عمل فيديوهات", type: "video", group: "video", category: "فيديوهات عامة", desc: "إنتاج فيديوهات تعليمية ومدرسية بمظهر حديث ومناسب للعرض والنشر.", link: "videos/teachers/video-production.mp4", icon: "🎬", thumb: "images2/video-production.jpg" },
      { title: "فيديوهات بالذكاء الاصطناعي", type: "video", group: "video", category: "فيديوهات عامة", desc: "محتوى مرئي حديث يوظف أدوات الذكاء الاصطناعي بأسلوب جذاب.", link: "videos/teachers/ai-videos.mp4", icon: "🤖", thumb: "images2/ai-videos.jpg" },
      { title: "مونتاج فيديوهات تعليمية واحتفالية وتوعوية", type: "video", group: "video", category: "فيديوهات عامة", desc: "مونتاج احترافي لمحتوى تعليمي واحتفالي وتوعوي بجودة عالية.", link: "videos/teachers/educational-event-awareness-editing.mp4", icon: "🎞️", thumb: "images2/video-editing.jpg" },
      { title: "اليوم الوطني", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو احتفالي مدرسي بتصميم حديث ومونتاج أنيق للمناسبات الوطنية.", link: "videos/teachers/national-day.mp4", icon: "🎉", thumb: "images2/national-day.jpg" },
      { title: "رؤية 2030", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو توعوي واحتفالي يعرض مفاهيم رؤية 2030 بأسلوب بصري جذاب.", link: "videos/teachers/vision-2030.mp4", icon: "🎯", thumb: "images2/vision-2030.jpg" },
      { title: "يوم المدير العالمي", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو احتفالي مخصص للمناسبات التقديرية داخل المدرسة.", link: "videos/teachers/world-principals-day.mp4", icon: "🏆", thumb: "images2/principal-day.jpg" },
      { title: "العودة إلى المدرسة", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو ترحيبي وتحفيزي مناسب لبداية العام الدراسي.", link: "videos/teachers/back-to-school.mp4", icon: "🏫", thumb: "images2/back-to-school.jpg" },
      { title: "الموهبة", type: "video", group: "video", category: "مناسبات واحتفالات", desc: "فيديو مدرسي يبرز الموهبة والتميز بأسلوب بصري حديث.", link: "videos/teachers/talent.mp4", icon: "⭐", thumb: "images2/talent.jpg" },
      { title: "الأمن والسلامة", type: "video", group: "video", category: "إذاعات مدرسية", desc: "إذاعة مدرسية أو فيديو توعوي بالذكاء الاصطناعي عن الأمن والسلامة.", link: "videos/teachers/safety-and-security-broadcast.mp4", icon: "🛡️", thumb: "images2/safety-broadcast.jpg" },
      { title: "اليوم العالمي للغة العربية", type: "video", group: "video", category: "إذاعات مدرسية", desc: "إذاعة مدرسية مرئية أو مسموعة عن اليوم العالمي للغة العربية.", link: "videos/teachers/arabic-language-day-broadcast.mp4", icon: "📝", thumb: "images2/arabic-day.jpg" },
      { title: "حماة العزة والفخر", type: "video", group: "video", category: "استعراضات مرئية", desc: "استعراض مدرسي مرئي بأسلوب حماسي وجذاب.", link: "videos/teachers/guardians-of-pride-and-honor.mp4", icon: "🎖️", thumb: "images2/pride-honor.jpg" },
      { title: "الكوارث الطبيعية", type: "video", group: "video", category: "استعراضات مرئية", desc: "عرض مرئي توعوي عن الكوارث الطبيعية بأسلوب مشوق.", link: "videos/teachers/natural-disasters-showcase.mp4", icon: "🌪️", thumb: "images2/natural-disasters.jpg" },
      { title: "أهمية القراءة", type: "video", group: "video", category: "إعلانات مدرسية", desc: "إعلان مدرسي بصياغة مرئية جذابة لتعزيز ثقافة القراءة.", link: "videos/teachers/importance-of-reading-ad.mp4", icon: "📚", thumb: "images2/importance-reading.jpg" },
      { title: "فارسة الانضباط", type: "video", group: "video", category: "إعلانات مدرسية", desc: "إعلان أو فيديو تحفيزي مدرسي يبرز قيمة الانضباط بأسلوب جذاب.", link: "videos/teachers/discipline-champion-ad.mp4", icon: "🌟", thumb: "images2/discipline-champion.jpg" },
      { title: "الاختبارات الوطنية – نافس", type: "video", group: "video", category: "إعلانات مدرسية", desc: "إعلان مدرسي مرئي خاص بالاختبارات الوطنية ونافس.", link: "videos/teachers/nafis-national-exams-ad.mp4", icon: "📢", thumb: "images2/nafis-exams.jpg" },

      { title: "صلاحيات قادة المدارس", type: "guide", group: "guides", category: "أدلة ومواثيق", desc: "دليل تنظيمي يوضح المهام والصلاحيات داخل البيئة المدرسية.", link: "pdfs/teachers/school-leaders-authorities.pdf", icon: "📘", thumb: "images2/school-leaders-guide.jpg" },
      { title: "دليل مكافحة الفساد لدى الموظف", type: "guide", group: "guides", category: "أدلة ومواثيق", desc: "دليل توعوي وتنظيمي يوضح الجوانب الأخلاقية والإجرائية المهمة.", link: "pdfs/teachers/anti-corruption-guide.pdf", icon: "📘", thumb: "images2/anti-corruption.jpg" },
      { title: "ميثاق أخلاقيات الموظف", type: "guide", group: "guides", category: "أدلة ومواثيق", desc: "ميثاق أخلاقي منظم ومناسب للعرض والاستخدام المؤسسي.", link: "pdfs/teachers/employee-code-of-ethics.pdf", icon: "📘", thumb: "images2/employee-ethics.jpg" },
      { title: "الدليل التنظيمي للمدارس", type: "guide", group: "guides", category: "أدلة ومواثيق", desc: "دليل مؤسسي شامل لتنظيم الجوانب الإدارية والتعليمية داخل المدرسة.", link: "pdfs/teachers/schools-organizational-guide.pdf", icon: "📘", thumb: "images2/schools-organizational-guide.jpg" }
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

    const groupDescriptions = {
      portfolio: "كل ما يتعلق بملفات الإنجاز المهنية والتوثيق المنظم للمعلم والمعلمة.",
      nafis: "ملفات ونماذج مرتبطة ببرامج نافس والاختبارات الوطنية.",
      discipline: "تنظيم وعرض ملف الانضباط بأسلوب واضح واحترافي.",
      training: "نماذج تدريبية، أسئلة محاكية، وبحوث تطويرية.",
      plans: "خطط وبرامج ومبادرات وحلول علاجية وإثرائية.",
      worksheets: "أوراق عمل ومطويات وأنشطة تعليمية جاهزة.",
      partnership: "الشراكة المجتمعية، العمل التطوعي، التقارير وتحليل النتائج.",
      design: "الشهادات والبروشورات والمخرجات الرسمية.",
      video: "الفيديوهات، المونتاج، الإعلانات المدرسية، والمواد المرئية.",
      guides: "الأدلة التنظيمية والمواثيق والملفات المؤسسية."
    };

    const groupOrder = ["portfolio", "nafis", "discipline", "training", "plans", "worksheets", "partnership", "design", "video", "guides"];

    const heroFeaturedPool = [
      { title: "فيديو تعريفي بالخدمات", desc: "عرض مرئي متبدل تلقائيًا يقدم تجربة أقرب للمنصة المرجعية.", type: "video", link: "videos/teachers/video-production.mp4", thumb: "images2/hero.jpg", icon: "🎬" },
      { title: "ملف إنجاز إلكتروني", desc: "نموذج لعرض الملفات المهنية داخل الواجهة الرئيسية.", type: "pdf", link: "pdfs/teachers/e-portfolio-file.pdf", thumb: "images2/teacher-portfolio-electronic.jpg", icon: "📄" },
      { title: "فيديو رؤية 2030", desc: "مثال على الفيديوهات المعروضة داخل بطاقات وعارضات حديثة.", type: "video", link: "videos/teachers/vision-2030.mp4", thumb: "images2/vision-2030.jpg", icon: "🎯" }
    ];

    let currentFilter = "all";
    let currentGroup = "portfolio";
    let currentFeaturedIndex = 0;
    let heroViewerIndex = 0;
    let heroViewerTimer = null;

    const $ = (id) => document.getElementById(id);

    const teacherFeaturedViewer = $("teacherFeaturedViewer");
    const teacherFeaturedTitle = $("teacherFeaturedTitle");
    const teacherFeaturedDesc = $("teacherFeaturedDesc");
    const teacherFeaturedType = $("teacherFeaturedType");
    const teacherCardsGrid = $("teacherCardsGrid");
    const teacherGroupsTabs = $("teacherGroupsTabs");
    const teacherFilterButtons = document.querySelectorAll(".teacher-filter");
    const groupsIndexGrid = $("groupsIndexGrid");
    const groupSectionsContainer = $("groupSectionsContainer");

    const heroMainViewer = $("heroMainViewer");
    const heroViewerTitle = $("heroViewerTitle");
    const heroViewerDesc = $("heroViewerDesc");
    const heroViewerDots = $("heroViewerDots");

    const heroStatFiles = $("heroStatFiles");
    const heroStatVideos = $("heroStatVideos");
    const heroStatGroups = $("heroStatGroups");

    const getTypeLabel = (type) => {
      if (type === "video") return "فيديو";
      if (type === "guide") return "دليل";
      return "ملف PDF";
    };

    const thumbMarkup = (item, featured = false) => {
      const placeholderClass = featured ? "featured-placeholder" : "card-placeholder";
      const iconClass = featured ? "featured-placeholder-icon" : "card-placeholder-icon";

      if (item.type === "video") {
        return `
          <video
            controls
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablepictureinpicture
            playsinline
            preload="metadata"
            poster="${item.thumb || "images2/hero.jpg"}"
            oncontextmenu="return false;">
            <source src="${item.link}" type="video/mp4">
            المتصفح لا يدعم تشغيل الفيديو.
          </video>
        `;
      }

      if (item.thumb) {
        return `
          <img
            src="${item.thumb}"
            alt="${item.title}"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="${placeholderClass}" style="display:none;">
            <div class="${iconClass}">${item.icon}</div>
            <div>${item.title}</div>
            <div>${item.type === "guide" ? "دليل تنظيمي معروض داخل المنصة" : "ملف معروض داخل المنصة"}</div>
          </div>
        `;
      }

      return `
        <div class="${placeholderClass}">
          <div class="${iconClass}">${item.icon}</div>
          <div>${item.title}</div>
          <div>${item.type === "guide" ? "دليل تنظيمي معروض داخل المنصة" : "ملف معروض داخل المنصة"}</div>
        </div>
      `;
    };

    const getFilteredServices = () =>
      teacherServices.filter((item) => {
        const filterOk = currentFilter === "all" || item.type === currentFilter;
        const groupOk = item.group === currentGroup;
        return filterOk && groupOk;
      });

    const updateFeatured = (items) => {
      if (!teacherFeaturedViewer || !teacherFeaturedTitle || !teacherFeaturedDesc || !teacherFeaturedType) return;

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

      teacherFeaturedViewer.innerHTML = thumbMarkup(item, true);
      teacherFeaturedTitle.textContent = item.title;
      teacherFeaturedDesc.textContent = item.desc;
      teacherFeaturedType.textContent = getTypeLabel(item.type);
    };

    const renderCards = (items) => {
      if (!teacherCardsGrid) return;

      teacherCardsGrid.innerHTML = items
        .map((item, index) => `
          <article class="teacher-card reveal" data-index="${index}">
            <div class="teacher-card-preview">
              ${thumbMarkup(item, false)}
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
        `)
        .join("");

      teacherCardsGrid.querySelectorAll(".teacher-card").forEach((card) => {
        card.classList.add("visible");
        card.addEventListener("click", () => {
          currentFeaturedIndex = Number(card.dataset.index) || 0;
          updateFeatured(items);
          teacherFeaturedViewer?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });
    };

    const renderGroups = () => {
      if (!teacherGroupsTabs) return;

      teacherGroupsTabs.innerHTML = groupOrder
        .map((group) => `
          <button class="group-tab ${group === currentGroup ? "active" : ""}" data-group="${group}">
            ${groupLabels[group]}
          </button>
        `)
        .join("");

      teacherGroupsTabs.querySelectorAll(".group-tab").forEach((button) => {
        button.addEventListener("click", () => {
          currentGroup = button.dataset.group || "portfolio";
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

    const renderHeroViewer = () => {
      if (!heroMainViewer || !heroViewerTitle || !heroViewerDesc || !heroViewerDots) return;

      const item = heroFeaturedPool[heroViewerIndex];
      heroMainViewer.innerHTML = thumbMarkup(item, true);
      heroViewerTitle.textContent = item.title;
      heroViewerDesc.textContent = item.desc;

      heroViewerDots.innerHTML = heroFeaturedPool
        .map((_, index) => `<button class="viewer-dot ${index === heroViewerIndex ? "active" : ""}" data-hero-index="${index}" aria-label="عرض ${index + 1}"></button>`)
        .join("");

      heroViewerDots.querySelectorAll(".viewer-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
          heroViewerIndex = Number(dot.dataset.heroIndex) || 0;
          renderHeroViewer();
          restartHeroAutoRotate();
        });
      });
    };

    const startHeroAutoRotate = () => {
      if (heroViewerTimer) clearInterval(heroViewerTimer);
      heroViewerTimer = setInterval(() => {
        heroViewerIndex = (heroViewerIndex + 1) % heroFeaturedPool.length;
        renderHeroViewer();
      }, 4500);
    };

    const restartHeroAutoRotate = () => {
      startHeroAutoRotate();
    };

    const renderHeroStats = () => {
      if (!heroStatFiles || !heroStatVideos || !heroStatGroups) return;

      const filesCount = teacherServices.filter((item) => item.type === "pdf" || item.type === "guide").length;
      const videoCount = teacherServices.filter((item) => item.type === "video").length;
      heroStatFiles.textContent = `${filesCount}+`;
      heroStatVideos.textContent = `${videoCount}+`;
      heroStatGroups.textContent = `${groupOrder.length}`;
    };

    const renderGroupsIndex = () => {
      if (!groupsIndexGrid) return;

      groupsIndexGrid.innerHTML = groupOrder
        .map((group) => {
          const firstItem = teacherServices.find((item) => item.group === group);
          const count = teacherServices.filter((item) => item.group === group).length;

          return `
            <a class="group-index-card reveal" href="#group-${group}">
              <div class="group-index-preview">
                ${firstItem ? thumbMarkup(firstItem, false) : ""}
              </div>
              <div class="group-index-body">
                <span class="group-index-badge">${count} عنصر</span>
                <h3>${groupLabels[group]}</h3>
                <p>${groupDescriptions[group]}</p>
              </div>
            </a>
          `;
        })
        .join("");

      groupsIndexGrid.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
    };

    const renderGroupSections = () => {
      if (!groupSectionsContainer) return;

      groupSectionsContainer.innerHTML = groupOrder
        .map((group) => {
          const items = teacherServices.filter((item) => item.group === group);
          const firstItem = items[0];

          return `
            <section class="group-section reveal" id="group-${group}">
              <div class="group-section-head">
                <div>
                  <span class="section-chip">${groupLabels[group]}</span>
                  <h3>${groupLabels[group]}</h3>
                  <p>${groupDescriptions[group]}</p>
                </div>
                <div class="group-section-count">
                  <strong>${items.length}</strong>
                  <span>عنصر</span>
                </div>
              </div>

              <div class="group-section-layout">
                <div class="group-cards-grid">
                  ${items.map((item) => `
                    <article class="teacher-card reveal">
                      <div class="teacher-card-preview">
                        ${thumbMarkup(item, false)}
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
                  `).join("")}
                </div>

                <div class="group-viewer">
                  ${firstItem ? thumbMarkup(firstItem, true) : ""}
                </div>
              </div>
            </section>
          `;
        })
        .join("");

      groupSectionsContainer.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
    };

    renderTeacherSection();
    renderHeroViewer();
    renderHeroStats();
    renderGroupsIndex();
    renderGroupSections();
    startHeroAutoRotate();

    teacherFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentFilter = button.dataset.filter || "all";
        currentFeaturedIndex = 0;
        teacherFilterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        renderTeacherSection();
      });
    });

    const mobileDrawer = $("mobileDrawer");
    const drawerOverlay = $("drawerOverlay");
    const navToggle = $("navToggle");
    const closeDrawer = $("closeDrawer");

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

    navToggle?.addEventListener("click", openDrawer);
    closeDrawer?.addEventListener("click", closeDrawerFn);
    drawerOverlay?.addEventListener("click", closeDrawerFn);

    document.querySelectorAll(".mobile-drawer-links a").forEach((link) => {
      link.addEventListener("click", closeDrawerFn);
    });

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

    const backToTop = $("backToTop");
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      window.addEventListener("scroll", () => {
        if (window.scrollY > 260) backToTop.classList.add("show");
        else backToTop.classList.remove("show");
      });
    }

    const themeToggle = $("themeToggle");
    themeToggle?.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
    });

    const contactForm = $("contactForm");
    const contactSuccess = $("contactSuccess");

    contactForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (contactSuccess) contactSuccess.style.display = "block";
      contactForm.reset();

      setTimeout(() => {
        if (contactSuccess) contactSuccess.style.display = "none";
      }, 3500);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawerFn();
    });
  });
})();
