(() => {
  "use strict";

  const SECTION_MAP = [
    {
      key: "engineering",
      label: "كلية الهندسة",
      hash: "students-engineering",
      desc: "أعمال ومشروعات وملفات أكاديمية في التخصصات الهندسية."
    },
    {
      key: "business",
      label: "كلية العلوم الإدارية والاقتصادية",
      hash: "students-business",
      desc: "ملفات المحاسبة والتمويل والموارد البشرية واتخاذ القرار والسلوك التنظيمي."
    },
    {
      key: "medical",
      label: "كلية الطب والعلوم الصحية",
      hash: "students-medical",
      desc: "ملفات علم النفس والتقييم النفسي والإرشاد والعلاج."
    },
    {
      key: "other",
      label: "الكليات الأخرى",
      hash: "students-other",
      desc: "ملفات الحوسبة والأمن السيبراني والعلوم والأحياء والرياضيات."
    }
  ];

  const FOLDER_LABELS = {
    dynamic_systems_lab: "مختبر الأنظمة الديناميكية",
    electrical_engineering: "الهندسة الكهربائية",
    digital_signal_processing: "معالجة الإشارات الرقمية",
    electronic_circuits: "الدوائر الإلكترونية",
    matlab: "MATLAB",
    engineering_design: "التصميم الهندسي",
    accounting: "المحاسبة",
    decision_making: "اتخاذ القرار",
    finance: "التمويل",
    human_resources: "الموارد البشرية",
    hr_strategy: "استراتيجية الموارد البشرية",
    talent_management: "إدارة المواهب",
    organizational_behavior: "السلوك التنظيمي",
    psychology: "علم النفس",
    counseling_and_therapy: "الإرشاد والعلاج",
    psychological_assessment: "التقييم النفسي",
    computing: "الحوسبة",
    operating_systems_and_cybersecurity: "أنظمة التشغيل والأمن السيبراني",
    science: "العلوم",
    biology: "الأحياء",
    mathematics: "الرياضيات",
    calculus: "التفاضل والتكامل",
    other: "أخرى"
  };

  const ARABIC_FOLDER_MAP = {
    "مختبر الأنظمة الديناميكية": "Dynamic_Systems_Lab",
    "الأنظمة الديناميكية": "Dynamic_Systems_Lab",
    "الهندسة الكهربائية": "Electrical_Engineering",
    "معالجة الإشارات الرقمية": "Digital_Signal_Processing",
    "الدوائر الإلكترونية": "Electronic_Circuits",
    "ماتلاب": "MATLAB",
    "matlab": "MATLAB",
    "التصميم الهندسي": "Engineering_Design",
    "المحاسبة": "Accounting",
    "اتخاذ القرار": "Decision_Making",
    "التمويل": "Finance",
    "الموارد البشرية": "Human_Resources",
    "استراتيجية الموارد البشرية": "HR_Strategy",
    "إدارة المواهب": "Talent_Management",
    "السلوك التنظيمي": "Organizational_Behavior",
    "علم النفس": "Psychology",
    "الإرشاد والعلاج": "Counseling_and_Therapy",
    "الارشاد والعلاج": "Counseling_and_Therapy",
    "التقييم النفسي": "Psychological_Assessment",
    "الحوسبة": "Computing",
    "أنظمة التشغيل والأمن السيبراني": "Operating_Systems_and_Cybersecurity",
    "انظمة التشغيل والأمن السيبراني": "Operating_Systems_and_Cybersecurity",
    "العلوم": "Science",
    "الأحياء": "Biology",
    "الاحياء": "Biology",
    "الرياضيات": "Mathematics",
    "التفاضل والتكامل": "Calculus"
  };

  const CURRENT_FILE_FOLDERS = [
    [/financial[ _-]*statement[ _-]*analysis/i, ["Accounting"]],
    [/hospital[ _-]*site[ _-]*selection/i, ["Decision_Making"]],
    [/corporate[ _-]*finance[ _-]*stocks[ _-]*bonds/i, ["Finance"]],
    [/hr[ _-]*strategy[ _-]*structure/i, ["Human_Resources", "HR_Strategy"]],
    [/(king[ _-]*fahd|king[ _-]*faisal|nwc|red[ _-]*crescent).*talent[ _-]*management/i, ["Human_Resources", "Talent_Management"]],
    [/zatca[ _-]*organizational[ _-]*behavior/i, ["Organizational_Behavior"]],
    [/tensile[ _-]*test/i, ["Dynamic_Systems_Lab"]],
    [/dsp[ _-]*matlab[ _-]*labs/i, ["Electrical_Engineering", "Digital_Signal_Processing"]],
    [/(bjt[ _-]*logic[ _-]*families|kirchhoff[ _-]*laws|ohms?[ _-]*law|semiconductor[ _-]*diodes|sinusoidal[ _-]*ac[ _-]*analysis)/i, ["Electrical_Engineering", "Electronic_Circuits"]],
    [/matlab[ _-]*lab[ _-]*[567]/i, ["Electrical_Engineering", "MATLAB"]],
    [/pallet[ _-]*loading[ _-]*optimization/i, ["Engineering_Design"]],
    [/cbt[ _-]*mbsr[ _-]*case[ _-]*study/i, ["Psychology", "Counseling_and_Therapy"]],
    [/cognitive[ _-]*assessment[ _-]*(case|tools)/i, ["Psychology", "Psychological_Assessment"]],
    [/os[ _-]*cybersecurity[ _-]*policies/i, ["Computing", "Operating_Systems_and_Cybersecurity"]],
    [/biology[ _-]*summary/i, ["Science", "Biology"]],
    [/calculus[ _-]*summary/i, ["Science", "Mathematics", "Calculus"]]
  ];

  let neonItems = [];
  let loaded = false;
  let loadingPromise = null;

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const slugify = (value = "") => String(value)
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/[\s-]+/g, "_")
    .replace(/[^\w]/g, "")
    .toLowerCase();

  const formatBytes = (bytes = 0) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const labelFolder = (segment = "") => FOLDER_LABELS[slugify(segment)] ||
    String(segment).replaceAll("_", " ").replaceAll("-", " ");

  const pathFromItem = item => {
    const raw = item.objectKey || item.object_key || item.key || item.path ||
      item.storagePath || item.storage_path || item.sourcePath || item.source_path || "";
    if (!raw || typeof raw !== "string") return [];
    const parts = raw.split("/").filter(Boolean);
    const studentsIndex = parts.findIndex(p => p.toLowerCase() === "students");
    const start = studentsIndex >= 0 ? studentsIndex + 1 : 0;
    const after = parts.slice(start);
    if (after.length && /\.pdf$/i.test(after[after.length - 1])) after.pop();
    if (after.length && ["engineering", "business", "medical", "other-colleges", "other_colleges", "other"].includes(after[0].toLowerCase())) {
      after.shift();
    }
    return after;
  };

  const pathFromDescription = item => {
    const raw = [item.desc, item.description, item.subtitle, item.categoryLabel]
      .filter(Boolean)
      .join(" - ")
      .trim();
    if (!raw) return [];

    const normalized = raw
      .replace(/[›>\/|]+/g, " - ")
      .split(/\s+-\s+/)
      .map(x => x.trim())
      .filter(Boolean);

    const result = [];
    for (const part of normalized) {
      const direct = ARABIC_FOLDER_MAP[part] || ARABIC_FOLDER_MAP[part.toLowerCase()];
      if (direct && !result.includes(direct)) {
        result.push(direct);
        continue;
      }

      const entry = Object.entries(ARABIC_FOLDER_MAP).find(([label]) =>
        part.includes(label) || label.includes(part)
      );
      if (entry && !result.includes(entry[1])) result.push(entry[1]);
    }
    return result;
  };

  const fallbackFolderPath = item => {
    const haystack = [
      item.title,
      item.name,
      item.filename,
      item.originalFilename,
      item.original_filename,
      item.desc,
      item.description,
      item.sectionLabel,
      item.id
    ].filter(Boolean).join(" ");
    for (const [pattern, folders] of CURRENT_FILE_FOLDERS) {
      if (pattern.test(haystack)) return folders;
    }
    return ["other"];
  };

  const getFolderPath = item => {
    const fromPath = pathFromItem(item);
    if (fromPath.length) return fromPath;

    const fromDescription = pathFromDescription(item);
    if (fromDescription.length) return fromDescription;

    return fallbackFolderPath(item);
  };

  const injectStyles = () => {
    if (document.getElementById("neonMediaStyles")) return;
    const style = document.createElement("style");
    style.id = "neonMediaStyles";
    style.textContent = `
      .neon-file-note{font-size:.78rem;color:var(--muted);margin-top:.65rem;display:flex;gap:.7rem;flex-wrap:wrap}
      .neon-folder-tree{display:grid;gap:2rem;margin-top:1.35rem}
      .neon-folder-block{border:0;border-radius:0;background:transparent;padding:0;box-shadow:none}
      .neon-folder-head{display:flex;align-items:end;justify-content:space-between;gap:.8rem;margin-bottom:1rem;flex-wrap:wrap;padding:0 .15rem}
      .neon-folder-title{display:flex;align-items:center;gap:.65rem;color:var(--primary-deep);font-size:1.08rem;font-weight:900}
      .neon-folder-title i{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:#f1e7f4;color:var(--primary)}
      .neon-folder-breadcrumb{display:flex;gap:.35rem;flex-wrap:wrap;align-items:center;color:var(--muted);font-size:.8rem;font-weight:700;margin-top:.35rem}
      .neon-folder-breadcrumb span:not(:last-child)::after{content:"›";margin-inline-start:.35rem;color:#b49bb8}
      .neon-folder-count{min-width:72px;text-align:center;background:#fff;border:1px solid var(--border);border-radius:999px;padding:.38rem .78rem;font-size:.77rem;font-weight:800;color:var(--primary-deep)}
      .neon-folder-block .service-page-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}

      .student-credential-card{
        background:#fff;
        border:1px solid #d8e0e6;
        border-radius:15px;
        overflow:hidden;
        box-shadow:0 5px 18px rgba(31,48,61,.055);
        transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;
        min-width:0
      }
      .student-credential-card:hover{
        transform:translateY(-2px);
        box-shadow:0 12px 28px rgba(31,48,61,.10);
        border-color:#c8d1d9
      }
      .student-document-preview{
        position:relative;
        width:100%;
        aspect-ratio:1.47 / 1;
        min-height:238px;
        max-height:315px;
        overflow:hidden;
        background:#edf1f4;
        cursor:pointer;
        border:0;
        outline:0
      }
      .student-document-preview:focus-visible{box-shadow:inset 0 0 0 3px rgba(111,74,112,.35)}
      .student-document-preview iframe{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        border:0;
        display:block;
        background:#edf1f4;
        pointer-events:none;
        user-select:none
      }
      .student-preview-shade{
        position:absolute;
        inset:auto 0 0;
        min-height:64px;
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:1rem;
        padding:.85rem 1rem;
        color:#fff;
        background:linear-gradient(180deg,rgba(20,28,34,0),rgba(20,28,34,.88));
        pointer-events:none
      }
      .student-preview-badge{
        display:inline-flex;
        align-items:center;
        min-height:29px;
        padding:.2rem .52rem;
        border-radius:6px;
        background:rgba(255,255,255,.18);
        border:1px solid rgba(255,255,255,.38);
        backdrop-filter:blur(5px);
        font-size:.72rem;
        font-weight:900;
        letter-spacing:.03em
      }
      .student-preview-action{
        display:inline-flex;
        align-items:center;
        gap:.36rem;
        font-size:.76rem;
        font-weight:800
      }
      .student-credential-body{padding:1.05rem 1.05rem 1.12rem}
      .student-credential-meta{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.8rem;
        margin-bottom:.52rem;
        color:#65727d;
        font-size:.67rem;
        font-weight:900;
        letter-spacing:.07em;
        text-transform:uppercase
      }
      .student-credential-meta .student-category{
        color:var(--primary);
        letter-spacing:.03em
      }
      .student-credential-card h4{
        margin:.12rem 0 .42rem;
        color:#183044;
        font-size:1.02rem;
        line-height:1.5;
        font-weight:900
      }
      .student-credential-path{
        margin:0 0 .46rem;
        color:#354653;
        font-size:.78rem;
        font-weight:800;
        line-height:1.55
      }
      .student-credential-card p{
        margin:0;
        color:#63727e;
        font-size:.79rem;
        line-height:1.7
      }
      .neon-media-viewer{position:fixed;inset:0;z-index:220;display:none;align-items:center;justify-content:center;padding:1rem}
      .neon-media-viewer.is-open{display:flex}
      .neon-media-viewer__backdrop{position:absolute;inset:0;background:rgba(24,14,29,.72);backdrop-filter:blur(6px)}
      .neon-media-viewer__dialog{position:relative;z-index:1;width:min(1180px,96vw);height:min(88vh,900px);background:#fff;border-radius:24px;box-shadow:0 30px 90px rgba(0,0,0,.28);overflow:hidden;display:flex;flex-direction:column}
      .neon-media-viewer__head{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem 1rem;border-bottom:1px solid var(--border);background:#fff}
      .neon-media-viewer__title{font-weight:800;color:var(--primary-deep);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .neon-media-viewer__close{width:42px;height:42px;border:0;border-radius:12px;background:#f3ecf7;cursor:pointer;font-size:1.35rem}
      .neon-media-viewer__body{flex:1;min-height:0;background:#eee}
      .neon-media-viewer iframe{width:100%;height:100%;border:0;background:#fff}
      .neon-media-status{padding:1rem;border:1px dashed var(--border);border-radius:18px;color:var(--muted);text-align:center;background:#fff}
      .neon-library-summary{display:flex;gap:.55rem;flex-wrap:wrap;margin-top:.7rem}
      .neon-library-summary span{padding:.35rem .7rem;border-radius:999px;background:#f7f1f8;border:1px solid var(--border);font-size:.76rem;font-weight:800;color:var(--primary-deep)}

      @media(max-width:900px){
        .neon-folder-block .service-page-grid{grid-template-columns:1fr}
        .student-document-preview{min-height:245px;max-height:300px}
      }
      @media(max-width:700px){
        .neon-media-viewer{padding:0}
        .neon-media-viewer__dialog{width:100vw;height:100vh;border-radius:0}
        .student-document-preview{min-height:220px;max-height:270px}
        .student-credential-body{padding:.95rem 1rem 1.05rem}
        .neon-folder-tree{gap:1.6rem}
      }
    `;
    document.head.appendChild(style);
  };

  const ensureViewer = () => {
    let viewer = document.getElementById("neonMediaViewer");
    if (viewer) return viewer;

    viewer = document.createElement("div");
    viewer.id = "neonMediaViewer";
    viewer.className = "neon-media-viewer";
    viewer.setAttribute("aria-hidden", "true");
    viewer.innerHTML = `
      <div class="neon-media-viewer__backdrop" data-neon-close></div>
      <div class="neon-media-viewer__dialog" role="dialog" aria-modal="true" aria-labelledby="neonMediaTitle">
        <div class="neon-media-viewer__head">
          <div class="neon-media-viewer__title" id="neonMediaTitle">معاينة الملف</div>
          <button class="neon-media-viewer__close" type="button" data-neon-close aria-label="إغلاق">×</button>
        </div>
        <div class="neon-media-viewer__body">
          <iframe id="neonMediaFrame" title="معاينة الملف" referrerpolicy="same-origin"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(viewer);

    const close = () => {
      viewer.classList.remove("is-open");
      viewer.setAttribute("aria-hidden", "true");
      const frame = document.getElementById("neonMediaFrame");
      if (frame) frame.src = "about:blank";
      document.body.style.overflow = "";
    };

    viewer.querySelectorAll("[data-neon-close]").forEach(el => el.addEventListener("click", close));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && viewer.classList.contains("is-open")) close();
    });

    return viewer;
  };

  const openViewer = item => {
    const viewer = ensureViewer();
    viewer.querySelector("#neonMediaTitle").textContent = item.title || "معاينة الملف";
    const frame = viewer.querySelector("#neonMediaFrame");
    frame.src = `/api/student-media?view=${encodeURIComponent(item.id)}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const loadCatalog = async () => {
    if (loaded) return neonItems;
    if (loadingPromise) return loadingPromise;

    loadingPromise = fetch("/api/student-media", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store"
    })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data.items)) throw new Error("Invalid catalog payload");
        neonItems = data.items;
        loaded = true;
        return neonItems;
      })
      .finally(() => { loadingPromise = null; });

    return loadingPromise;
  };

  const isStudentView = () => {
    const active = document.querySelector('.library-main-tab[data-library-tab="students"]')?.classList.contains("active");
    const hash = location.hash.replace("#", "");
    return active || !hash || hash === "services" || hash.startsWith("students-");
  };

  const buildCard = item => {
    const folders = getFolderPath(item).map(labelFolder);
    const leaf = folders[folders.length - 1] || item.sectionLabel || "ملف";
    const breadcrumb = folders.join(" - ") || item.sectionLabel || "";
    const typeLabel = item.type === "video" ? "VIDEO" : item.type === "image" ? "IMAGE" : "PDF";
    const previewUrl = `/api/student-media?view=${encodeURIComponent(item.id)}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

    return `
      <article class="student-credential-card reveal visible">
        <div class="student-document-preview neon-media-open" data-neon-id="${escapeHtml(item.id)}" role="button" tabindex="0" aria-label="معاينة ${escapeHtml(item.title)}">
          <iframe src="${previewUrl}" title="" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>
          <div class="student-preview-shade">
            <span class="student-preview-badge">${typeLabel}</span>
            <span class="student-preview-action">عرض الملف <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>
        <div class="student-credential-body">
          <div class="student-credential-meta">
            <span class="student-category">${escapeHtml(leaf)}</span>
            <span>أعمال طلابية</span>
          </div>
          <h4>${escapeHtml(item.title)}</h4>
          <div class="student-credential-path">${escapeHtml(breadcrumb)}</div>
          <p>${escapeHtml(item.desc || "نموذج عمل أكاديمي متاح للمعاينة داخل منصة تمكين.")}</p>
        </div>
      </article>
    `;
  };

  const groupByLeafFolder = items => {
    const map = new Map();
    items.forEach(item => {
      const path = getFolderPath(item);
      const key = path.map(slugify).join("/");
      if (!map.has(key)) map.set(key, { path, items: [] });
      map.get(key).items.push(item);
    });
    return [...map.values()].sort((a, b) =>
      a.path.map(labelFolder).join(" / ").localeCompare(b.path.map(labelFolder).join(" / "), "ar")
    );
  };

  const renderFolderBlock = folder => {
    const labels = folder.path.map(labelFolder);
    const leaf = labels[labels.length - 1] || "أخرى";
    return `
      <section class="neon-folder-block">
        <div class="neon-folder-head">
          <div>
            <div class="neon-folder-title">
              <i class="fa-regular fa-folder-open"></i>
              <span>${escapeHtml(leaf)}</span>
            </div>
            <div class="neon-folder-breadcrumb">
              ${labels.map(label => `<span>${escapeHtml(label)}</span>`).join("")}
            </div>
          </div>
          <div class="neon-folder-count">${folder.items.length} ملف</div>
        </div>
        <div class="service-page-grid">
          ${folder.items.map(buildCard).join("")}
        </div>
      </section>
    `;
  };

  const render = async () => {
    if (!isStudentView()) return;

    const landing = document.getElementById("servicesLandingGrid");
    const pages = document.getElementById("servicePagesContainer");
    const sidebar = document.getElementById("librarySidebarLinks");
    if (!landing || !pages || !sidebar) return;

    pages.innerHTML = '<div class="neon-media-status">جارٍ تحميل ملفات الطلاب…</div>';

    try {
      const items = await loadCatalog();
      if (!isStudentView()) return;

      const byGroup = key => items.filter(item => item.group === key);
      const badge = document.getElementById("libraryMainBadge");
      const title = document.getElementById("libraryMainTitle");
      const desc = document.getElementById("libraryMainDesc");
      const count = document.getElementById("libraryCount");
      const sectionsCount = document.getElementById("librarySectionsCount");
      const sideTitle = document.getElementById("librarySidebarTitle");

      if (badge) badge.textContent = "خدمات الطلاب";
      if (title) title.textContent = "مكتبة أعمال الطلاب";
      if (desc) desc.textContent = "نماذج أعمال وملفات طلابية مرتبة حسب الكلية والتخصص والمقرر، مع معاينة مباشرة داخل المنصة.";
      if (count) count.textContent = String(items.length);
      if (sectionsCount) sectionsCount.textContent = String(SECTION_MAP.length);
      if (sideTitle) sideTitle.textContent = "كليات وأقسام الطلاب";

      sidebar.innerHTML = SECTION_MAP.map(section => {
        return `<a class="library-sidebar-link" href="#${section.hash}">${section.label}</a>`;
      }).join("");

      landing.innerHTML = SECTION_MAP.map(section => {
        const sectionItems = byGroup(section.key);
        const folders = groupByLeafFolder(sectionItems);
        return `
          <a class="landing-card reveal visible" href="#${section.hash}">
            <div class="landing-card-badge">${sectionItems.length} ملف</div>
            <h4>${section.label}</h4>
            <p>${section.desc}</p>
            <div class="neon-library-summary">
              <span>${folders.length} قسم/مقرر</span>
            </div>
          </a>
        `;
      }).join("");

      pages.innerHTML = SECTION_MAP.map(section => {
        const sectionItems = byGroup(section.key);
        const folders = groupByLeafFolder(sectionItems);
        return `
          <section class="service-page reveal visible" id="${section.hash}">
            <div class="service-page-head">
              <div>
                <span class="mini-badge">مكتبة الطلاب</span>
                <h3>${section.label}</h3>
                <p>${section.desc}</p>
              </div>
              <div class="service-page-count"><strong>${sectionItems.length}</strong><span>ملف</span></div>
            </div>
            <div class="neon-folder-tree">
              ${folders.length ? folders.map(renderFolderBlock).join("") : '<div class="neon-media-status">لا توجد ملفات منشورة في هذا القسم حاليًا.</div>'}
            </div>
          </section>
        `;
      }).join("");

      pages.querySelectorAll(".neon-media-open").forEach(button => {
        const activate = () => {
          const item = items.find(x => String(x.id) === String(button.dataset.neonId));
          if (item) openViewer(item);
        };
        button.addEventListener("click", activate);
        button.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate();
          }
        });
      });

      const hash = location.hash.replace("#", "");
      if (hash.startsWith("students-")) {
        setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    } catch (error) {
      console.error("Tamkeen student media error", error);
      pages.innerHTML = `
        <div class="neon-media-status">
          تعذر تحميل الملفات مؤقتًا.
          <button class="btn btn-primary" type="button" id="reloadNeonMedia" style="margin-inline-start:.6rem">إعادة المحاولة</button>
        </div>
      `;
      document.getElementById("reloadNeonMedia")?.addEventListener("click", () => {
        loaded = false;
        neonItems = [];
        render();
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    injectStyles();
    ensureViewer();
    setTimeout(render, 0);

    document.querySelector('.library-main-tab[data-library-tab="students"]')?.addEventListener("click", () => {
      setTimeout(render, 0);
    });

    window.addEventListener("hashchange", () => {
      if (location.hash.replace("#", "").startsWith("students-")) setTimeout(render, 0);
    });

    document.addEventListener("contextmenu", event => {
      if (event.target.closest("#neonMediaViewer")) event.preventDefault();
    });
  });
})();