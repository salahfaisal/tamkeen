(() => {
  "use strict";

  const CATEGORY_ORDER = [
    "الأداء الوظيفي",
    "شواهد الأداء الوظيفي",
    "الإدارة المدرسية",
    "الإرشاد الطلابي",
    "الصحة المدرسية",
    "الشراكة والتطوع",
    "ملفات الإنجاز"
  ];

  const CATEGORY_INFO = {
    "الأداء الوظيفي": {
      hash: "teachers-performance",
      desc: "نماذج متنوعة ومنظمة لتوثيق الأداء الوظيفي للمعلمات والمعلمين، وتشمل نماذج عامة وتفاعلية ومبتكرة ورياض الأطفال."
    },
    "شواهد الأداء الوظيفي": {
      hash: "teachers-evidence",
      desc: "نماذج مخصصة لجمع وترتيب شواهد الأداء الوظيفي بصورة واضحة ومهنية."
    },
    "الإدارة المدرسية": {
      hash: "teachers-school-management",
      desc: "ملفات مهنية للإدارة المدرسية تشمل المديرة والوكيلة والمساعدة الإدارية."
    },
    "الإرشاد الطلابي": {
      hash: "teachers-student-guidance",
      desc: "ملفات ونماذج مرتبطة بمهام الموجهة الطلابية وبرامج الإرشاد وشواهد التنفيذ."
    },
    "الصحة المدرسية": {
      hash: "teachers-school-health",
      desc: "ملفات إنجاز وشواهد مرتبطة بمهام وبرامج الصحة المدرسية."
    },
    "الشراكة والتطوع": {
      hash: "teachers-partnership",
      desc: "نماذج لتوثيق مبادرات الشراكة المجتمعية والعمل التطوعي وشواهد تنفيذها."
    },
    "ملفات الإنجاز": {
      hash: "teachers-achievement",
      desc: "نماذج مهنية لتنظيم وتوثيق الإنجازات والأعمال والشواهد."
    }
  };

  let teacherItems = [];
  let loaded = false;
  let loadingPromise = null;

  const esc = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const isTeacherView = () => {
    const active = document.querySelector('.library-main-tab[data-library-tab="teachers"]')?.classList.contains("active");
    const hash = location.hash.replace("#", "");
    return active || hash.startsWith("teachers-");
  };

  const addStyles = () => {
    if (document.getElementById("teacherNeonStyles")) return;
    const style = document.createElement("style");
    style.id = "teacherNeonStyles";
    style.textContent = `
      .teacher-subcategory{
        display:inline-flex;
        align-items:center;
        gap:.35rem;
        margin-bottom:.4rem;
        color:var(--primary);
        font-size:.72rem;
        font-weight:900;
      }
      .teacher-section-grid{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:22px;
      }
      .teacher-empty{
        padding:1rem;
        border:1px dashed var(--border);
        border-radius:16px;
        color:var(--muted);
        text-align:center;
      }
      .teacher-media-viewer{
        position:fixed;
        inset:0;
        z-index:230;
        display:none;
        align-items:center;
        justify-content:center;
        padding:1rem;
      }
      .teacher-media-viewer.is-open{display:flex}
      .teacher-media-viewer__backdrop{
        position:absolute;
        inset:0;
        background:rgba(24,14,29,.74);
        backdrop-filter:blur(6px);
      }
      .teacher-media-viewer__dialog{
        position:relative;
        z-index:1;
        width:min(1180px,96vw);
        height:min(90vh,920px);
        background:#fff;
        border-radius:24px;
        box-shadow:0 30px 90px rgba(0,0,0,.30);
        overflow:hidden;
        display:flex;
        flex-direction:column;
      }
      .teacher-media-viewer__head{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:1rem;
        padding:.9rem 1rem;
        border-bottom:1px solid var(--border);
      }
      .teacher-media-viewer__title{
        min-width:0;
        font-weight:900;
        color:var(--primary-deep);
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      .teacher-media-viewer__close{
        width:42px;
        height:42px;
        border:0;
        border-radius:12px;
        background:#f3ecf7;
        cursor:pointer;
        font-size:1.35rem;
      }
      .teacher-media-viewer__body{flex:1;min-height:0;background:#eee}
      .teacher-media-viewer iframe{width:100%;height:100%;border:0;background:#fff}
      @media(max-width:900px){
        .teacher-section-grid{grid-template-columns:1fr}
      }
      @media(max-width:700px){
        .teacher-media-viewer{padding:0}
        .teacher-media-viewer__dialog{width:100vw;height:100vh;border-radius:0}
      }
    `;
    document.head.appendChild(style);
  };

  const ensureViewer = () => {
    let viewer = document.getElementById("teacherMediaViewer");
    if (viewer) return viewer;

    viewer = document.createElement("div");
    viewer.id = "teacherMediaViewer";
    viewer.className = "teacher-media-viewer";
    viewer.setAttribute("aria-hidden", "true");
    viewer.innerHTML = `
      <div class="teacher-media-viewer__backdrop" data-teacher-close></div>
      <div class="teacher-media-viewer__dialog" role="dialog" aria-modal="true" aria-labelledby="teacherMediaTitle">
        <div class="teacher-media-viewer__head">
          <div class="teacher-media-viewer__title" id="teacherMediaTitle">معاينة الملف</div>
          <button class="teacher-media-viewer__close" type="button" data-teacher-close aria-label="إغلاق">×</button>
        </div>
        <div class="teacher-media-viewer__body">
          <iframe id="teacherMediaFrame" title="معاينة الملف" referrerpolicy="same-origin"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(viewer);

    const close = () => {
      viewer.classList.remove("is-open");
      viewer.setAttribute("aria-hidden", "true");
      const frame = document.getElementById("teacherMediaFrame");
      if (frame) frame.src = "about:blank";
      document.body.style.overflow = "";
    };

    viewer.querySelectorAll("[data-teacher-close]").forEach(el => el.addEventListener("click", close));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && viewer.classList.contains("is-open")) close();
    });
    return viewer;
  };

  const openViewer = item => {
    const viewer = ensureViewer();
    viewer.querySelector("#teacherMediaTitle").textContent = item.displayTitle || item.title || "معاينة الملف";
    viewer.querySelector("#teacherMediaFrame").src =
      `/api/teacher-media?view=${encodeURIComponent(item.id)}#page=1&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=1&view=Fit`;
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const numberRepeatedTitles = items => {
    const totals = new Map();
    items.forEach(item => totals.set(item.title, (totals.get(item.title) || 0) + 1));
    const seen = new Map();
    return items.map(item => {
      const total = totals.get(item.title) || 1;
      const index = (seen.get(item.title) || 0) + 1;
      seen.set(item.title, index);
      return {
        ...item,
        displayTitle: total > 1 ? `${item.title} — نموذج ${index}` : item.title
      };
    });
  };

  const loadCatalog = async () => {
    if (loaded) return teacherItems;
    if (loadingPromise) return loadingPromise;

    loadingPromise = fetch("/api/teacher-media", {
      headers: { Accept: "application/json" },
      cache: "no-store"
    })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data?.ok || !Array.isArray(data.items)) throw new Error("Invalid teacher catalog");
        teacherItems = numberRepeatedTitles(data.items);
        loaded = true;
        return teacherItems;
      })
      .finally(() => { loadingPromise = null; });

    return loadingPromise;
  };

  const buildCard = item => {
    const previewUrl =
      `/api/teacher-media?view=${encodeURIComponent(item.id)}#page=1&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0&view=Fit`;
    const sub = item.subcategory || item.category || "ملف مهني";

    return `
      <article class="student-credential-card reveal visible">
        <div class="student-document-preview teacher-media-open"
             data-teacher-id="${esc(item.id)}"
             role="button" tabindex="0"
             aria-label="معاينة ${esc(item.displayTitle)}">
          <iframe src="${previewUrl}" title="" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>
          <div class="student-preview-shade">
            <span class="student-preview-badge">PDF</span>
            <span class="student-preview-action">عرض الملف <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>
        <div class="student-credential-body">
          <div class="student-credential-meta">
            <span class="student-category">${esc(item.category || "ملفات المعلمين")}</span>
            <span>نموذج مهني</span>
          </div>
          ${item.subcategory ? `<div class="teacher-subcategory"><i class="fa-regular fa-folder-open"></i>${esc(sub)}</div>` : ""}
          <h4>${esc(item.displayTitle)}</h4>
          <p>${esc(item.desc || "نموذج مهني متاح للمعاينة داخل منصة تمكين.")}</p>
        </div>
      </article>
    `;
  };

  const render = async () => {
    if (!isTeacherView()) return;

    const landing = document.getElementById("servicesLandingGrid");
    const pages = document.getElementById("servicePagesContainer");
    const sidebar = document.getElementById("librarySidebarLinks");
    if (!landing || !pages || !sidebar) return;

    pages.innerHTML = '<div class="neon-media-status">جارٍ تحميل ملفات المعلمات والمعلمين…</div>';

    try {
      const items = await loadCatalog();
      if (!isTeacherView()) return;

      const actualCategories = CATEGORY_ORDER.filter(category =>
        items.some(item => item.category === category)
      );

      const badge = document.getElementById("libraryMainBadge");
      const title = document.getElementById("libraryMainTitle");
      const desc = document.getElementById("libraryMainDesc");
      const count = document.getElementById("libraryCount");
      const sectionsCount = document.getElementById("librarySectionsCount");
      const sideTitle = document.getElementById("librarySidebarTitle");

      if (badge) badge.textContent = "خدمات المعلمات والمعلمين";
      if (title) title.textContent = "نماذج وملفات مهنية للمعلمات والمعلمين";
      if (desc) desc.textContent = "نماذج أعمال مهنية مرتبة حسب مجال الاستخدام، مع عرض الصفحة الأولى ومعاينة الملف كاملًا داخل المنصة.";
      if (count) count.textContent = String(items.length);
      if (sectionsCount) sectionsCount.textContent = String(actualCategories.length);
      if (sideTitle) sideTitle.textContent = "أقسام الملفات المهنية";

      sidebar.innerHTML = actualCategories.map(category => {
        const info = CATEGORY_INFO[category];
        return `<a class="library-sidebar-link" href="#${info.hash}">${esc(category)}</a>`;
      }).join("");

      landing.innerHTML = actualCategories.map(category => {
        const info = CATEGORY_INFO[category];
        const sectionItems = items.filter(item => item.category === category);
        return `
          <a class="landing-card reveal visible" href="#${info.hash}">
            <div class="landing-card-badge">${sectionItems.length} ملف</div>
            <h4>${esc(category)}</h4>
            <p>${esc(info.desc)}</p>
          </a>
        `;
      }).join("");

      pages.innerHTML = actualCategories.map(category => {
        const info = CATEGORY_INFO[category];
        const sectionItems = items.filter(item => item.category === category);
        return `
          <section class="service-page reveal visible" id="${info.hash}">
            <div class="service-page-head">
              <div>
                <span class="mini-badge">خدمات المعلمات والمعلمين</span>
                <h3>${esc(category)}</h3>
                <p>${esc(info.desc)}</p>
              </div>
              <div class="service-page-count">
                <strong>${sectionItems.length}</strong>
                <span>ملف</span>
              </div>
            </div>
            <div class="teacher-section-grid">
              ${sectionItems.map(buildCard).join("")}
            </div>
          </section>
        `;
      }).join("");

      pages.querySelectorAll(".teacher-media-open").forEach(el => {
        const activate = () => {
          const item = items.find(x => String(x.id) === String(el.dataset.teacherId));
          if (item) openViewer(item);
        };
        el.addEventListener("click", activate);
        el.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate();
          }
        });
      });

      const hash = location.hash.replace("#", "");
      if (hash.startsWith("teachers-")) {
        setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    } catch (error) {
      console.error("Tamkeen teacher media error", error);
      pages.innerHTML = `
        <div class="neon-media-status">
          تعذر تحميل ملفات المعلمات والمعلمين مؤقتًا.
          <button class="btn btn-primary" type="button" id="reloadTeacherMedia" style="margin-inline-start:.6rem">إعادة المحاولة</button>
        </div>
      `;
      document.getElementById("reloadTeacherMedia")?.addEventListener("click", () => {
        loaded = false;
        teacherItems = [];
        render();
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    addStyles();
    ensureViewer();
    setTimeout(render, 0);

    document.querySelector('.library-main-tab[data-library-tab="teachers"]')?.addEventListener("click", () => {
      setTimeout(render, 0);
    });

    window.addEventListener("hashchange", () => {
      if (location.hash.replace("#", "").startsWith("teachers-")) setTimeout(render, 0);
    });

    document.addEventListener("contextmenu", event => {
      if (event.target.closest("#teacherMediaViewer")) event.preventDefault();
    });
  });
})();