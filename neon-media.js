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

  const fallbackFolderPath = item => {
    const haystack = [
      item.title,
      item.name,
      item.filename,
      item.originalFilename,
      item.original_filename,
      item.id
    ].filter(Boolean).join(" ");
    for (const [pattern, folders] of CURRENT_FILE_FOLDERS) {
      if (pattern.test(haystack)) return folders;
    }
    return ["other"];
  };

  const getFolderPath = item => {
    const fromPath = pathFromItem(item);
    return fromPath.length ? fromPath : fallbackFolderPath(item);
  };

  const injectStyles = () => {
    if (document.getElementById("neonMediaStyles")) return;
    const style = document.createElement("style");
    style.id = "neonMediaStyles";
    style.textContent = `
      .neon-live-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.32rem .72rem;border-radius:999px;background:#edf8f0;color:#21633a;font-size:.76rem;font-weight:800;border:1px solid #cde8d5}
      .neon-live-dot{width:8px;height:8px;border-radius:50%;background:#31a85d;box-shadow:0 0 0 4px rgba(49,168,93,.12)}
      .neon-file-note{font-size:.78rem;color:var(--muted);margin-top:.5rem;display:flex;gap:.55rem;flex-wrap:wrap}
      .neon-folder-tree{display:grid;gap:1.1rem;margin-top:1rem}
      .neon-folder-block{border:1px solid var(--border);border-radius:22px;background:linear-gradient(180deg,#fff,#fcf9fd);padding:1rem;box-shadow:0 10px 28px rgba(72,40,78,.06)}
      .neon-folder-head{display:flex;align-items:center;justify-content:space-between;gap:.8rem;margin-bottom:.9rem;flex-wrap:wrap}
      .neon-folder-title{display:flex;align-items:center;gap:.65rem;color:var(--primary-deep);font-size:1rem;font-weight:900}
      .neon-folder-title i{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:#f1e7f4;color:var(--primary)}
      .neon-folder-breadcrumb{display:flex;gap:.35rem;flex-wrap:wrap;align-items:center;color:var(--muted);font-size:.78rem;font-weight:700;margin-top:.28rem}
      .neon-folder-breadcrumb span:not(:last-child)::after{content:"›";margin-inline-start:.35rem;color:#b49bb8}
      .neon-folder-count{min-width:72px;text-align:center;background:#f5eef7;border:1px solid var(--border);border-radius:999px;padding:.34rem .7rem;font-size:.77rem;font-weight:800;color:var(--primary-deep)}
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
      @media(max-width:700px){
        .neon-media-viewer{padding:0}
        .neon-media-viewer__dialog{width:100vw;height:100vh;border-radius:0}
        .service-page-grid{grid-template-columns:1fr}
        .neon-folder-block{padding:.8rem;border-radius:18px}
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

  const buildCard = item => `
    <article class="library-card reveal visible">
      <div class="library-card-icon">${escapeHtml(item.icon || "📄")}</div>
      <div class="library-card-content">
        <div class="library-card-meta">
          <span class="library-type ${escapeHtml(item.type || "pdf")}">${item.type === "video" ? "فيديو" : item.type === "image" ? "صورة" : "ملف PDF"}</span>
          <span class="library-category">${escapeHtml(item.sectionLabel || "")}</span>
          <span class="neon-live-badge"><span class="neon-live-dot"></span>Neon</span>
        </div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.desc || "")}</p>
        <div class="neon-file-note">
          ${item.size ? `<span>الحجم: ${escapeHtml(formatBytes(item.size))}</span>` : ""}
          <span><i class="fa-solid fa-shield-halved"></i> معاينة داخل المنصة</span>
        </div>
        <div class="library-card-actions">
          <button type="button" class="btn btn-primary neon-media-open" data-neon-id="${escapeHtml(item.id)}">
            <i class="fa-regular fa-eye"></i>
            معاينة الملف
          </button>
        </div>
      </div>
    </article>
  `;

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

    pages.innerHTML = '<div class="neon-media-status">جارٍ تحميل ملفات الطلاب من Neon…</div>';

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
      if (desc) desc.textContent = "ملفات الطلاب المرفوعة فعليًا إلى التخزين الخاص في Neon، مرتبة حسب الكلية والتخصص والمقرر.";
      if (count) count.textContent = String(items.length);
      if (sectionsCount) sectionsCount.textContent = String(SECTION_MAP.length);
      if (sideTitle) sideTitle.textContent = "كليات وأقسام الطلاب";

      sidebar.innerHTML = SECTION_MAP.map(section => {
        const n = byGroup(section.key).length;
        return `<a class="library-sidebar-link" href="#${section.hash}">${section.label}<span>${n}</span></a>`;
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
        button.addEventListener("click", () => {
          const item = items.find(x => String(x.id) === String(button.dataset.neonId));
          if (item) openViewer(item);
        });
      });

      const hash = location.hash.replace("#", "");
      if (hash.startsWith("students-")) {
        setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    } catch (error) {
      console.error("Tamkeen Neon media error", error);
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