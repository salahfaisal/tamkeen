(() => {
  "use strict";

  const SECTION_MAP = [
    { key: "engineering", label: "كلية الهندسة", hash: "students-engineering", desc: "نماذج وأعمال أكاديمية هندسية مرفوعة على منصة تمكين." },
    { key: "business", label: "كلية العلوم الإدارية والاقتصادية", hash: "students-business", desc: "نماذج في المحاسبة والتمويل والموارد البشرية واتخاذ القرار." },
    { key: "medical", label: "كلية الطب والعلوم الصحية", hash: "students-medical", desc: "نماذج أكاديمية في علم النفس والتقييم والإرشاد." },
    { key: "other", label: "الكليات الأخرى", hash: "students-other", desc: "نماذج في الحوسبة والعلوم والرياضيات وغيرها." }
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

  const formatBytes = (bytes = 0) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const injectStyles = () => {
    if (document.getElementById("neonMediaStyles")) return;
    const style = document.createElement("style");
    style.id = "neonMediaStyles";
    style.textContent = `
      .neon-live-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.32rem .72rem;border-radius:999px;background:#edf8f0;color:#21633a;font-size:.76rem;font-weight:800;border:1px solid #cde8d5}
      .neon-live-dot{width:8px;height:8px;border-radius:50%;background:#31a85d;box-shadow:0 0 0 4px rgba(49,168,93,.12)}
      .neon-file-note{font-size:.78rem;color:var(--muted);margin-top:.5rem;display:flex;gap:.55rem;flex-wrap:wrap}
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
      @media(max-width:700px){.neon-media-viewer{padding:0}.neon-media-viewer__dialog{width:100vw;height:100vh;border-radius:0}.service-page-grid{grid-template-columns:1fr}}
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

  const openViewer = (item) => {
    const viewer = ensureViewer();
    const title = viewer.querySelector("#neonMediaTitle");
    const frame = viewer.querySelector("#neonMediaFrame");
    title.textContent = item.title || "معاينة الملف";
    frame.src = `/api/student-media?view=${encodeURIComponent(item.id)}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const loadCatalog = async () => {
    if (loaded) return neonItems;
    if (loadingPromise) return loadingPromise;

    loadingPromise = fetch("/api/student-media", { headers: { Accept: "application/json" } })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        neonItems = Array.isArray(data.items) ? data.items : [];
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
          <span class="library-type ${escapeHtml(item.type || "pdf")}">ملف PDF</span>
          <span class="library-category">${escapeHtml(item.sectionLabel || "")}</span>
          <span class="neon-live-badge"><span class="neon-live-dot"></span>Neon</span>
        </div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.desc || "")}</p>
        <div class="neon-file-note">
          ${item.size ? `<span>الحجم: ${escapeHtml(formatBytes(item.size))}</span>` : ""}
          <span>عرض خاص داخل المنصة</span>
        </div>
        <div class="library-card-actions">
          <button type="button" class="btn btn-primary neon-media-open" data-neon-id="${escapeHtml(item.id)}">معاينة داخل المنصة</button>
        </div>
      </div>
    </article>
  `;

  const render = async () => {
    if (!isStudentView()) return;

    const landing = document.getElementById("servicesLandingGrid");
    const pages = document.getElementById("servicePagesContainer");
    const sidebar = document.getElementById("librarySidebarLinks");
    if (!landing || !pages || !sidebar) return;

    pages.innerHTML = '<div class="neon-media-status">جارٍ تحميل نماذج الطلاب من Neon…</div>';

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
      if (title) title.textContent = "نماذج أعمال الطلاب";
      if (desc) desc.textContent = "نماذج فعلية مرفوعة على التخزين الخاص في Neon، مع عرضها داخل منصة تمكين.";
      if (count) count.textContent = String(items.length);
      if (sectionsCount) sectionsCount.textContent = String(SECTION_MAP.length);
      if (sideTitle) sideTitle.textContent = "أقسام نماذج الطلاب";

      sidebar.innerHTML = SECTION_MAP.map(section =>
        `<a class="library-sidebar-link" href="#${section.hash}">${section.label}</a>`
      ).join("");

      landing.innerHTML = SECTION_MAP.map(section => {
        const sectionItems = byGroup(section.key);
        return `
          <a class="landing-card reveal visible" href="#${section.hash}">
            <div class="landing-card-badge">${sectionItems.length} ملف</div>
            <h4>${section.label}</h4>
            <p>${section.desc}</p>
          </a>
        `;
      }).join("");

      pages.innerHTML = SECTION_MAP.map(section => {
        const sectionItems = byGroup(section.key);
        return `
          <section class="service-page reveal visible" id="${section.hash}">
            <div class="service-page-head">
              <div>
                <span class="mini-badge">نماذج الطلاب</span>
                <h3>${section.label}</h3>
                <p>${section.desc}</p>
              </div>
              <div class="service-page-count"><strong>${sectionItems.length}</strong><span>ملف</span></div>
            </div>
            <div class="service-page-grid">
              ${sectionItems.length ? sectionItems.map(buildCard).join("") : '<div class="neon-media-status">لا توجد ملفات منشورة في هذا القسم حاليًا.</div>'}
            </div>
          </section>
        `;
      }).join("");

      pages.querySelectorAll(".neon-media-open").forEach(button => {
        button.addEventListener("click", () => {
          const item = items.find(x => x.id === button.dataset.neonId);
          if (item) openViewer(item);
        });
      });

      const hash = location.hash.replace("#", "");
      if (hash.startsWith("students-")) {
        setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    } catch (error) {
      console.error("Tamkeen Neon media error", error);
      pages.innerHTML = '<div class="neon-media-status">تعذر تحميل الملفات مؤقتًا. يرجى إعادة المحاولة بعد قليل.</div>';
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
  });
})();
