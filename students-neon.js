(() => {
  "use strict";

  const API_BASE = "https://br-proud-wind-b8qdt9gb-mediaapi.compute.c-14.us-east-1.aws.neon.tech";
  let studentItems = [];
  let loaded = false;
  let loading = false;

  const sections = [
    { key: "engineering", label: "كلية الهندسة", hash: "students-engineering", desc: "ملفات وأعمال طلابية مرفوعة من مكتبة تمكين الخاصة على Neon." },
    { key: "business", label: "كلية العلوم الإدارية والاقتصادية", hash: "students-business", desc: "ملفات المحاسبة والتمويل والموارد البشرية ودراسات الأعمال." },
    { key: "medical", label: "كلية الطب والعلوم الصحية", hash: "students-medical", desc: "ملفات التخصصات الطبية والصحية وعلم النفس." },
    { key: "other", label: "الكليات الأخرى", hash: "students-other", desc: "ملفات الحوسبة والعلوم والرياضيات والتخصصات الأخرى." }
  ];

  const els = () => ({
    badge: document.getElementById("libraryMainBadge"),
    title: document.getElementById("libraryMainTitle"),
    desc: document.getElementById("libraryMainDesc"),
    count: document.getElementById("libraryCount"),
    sectionsCount: document.getElementById("librarySectionsCount"),
    sidebarTitle: document.getElementById("librarySidebarTitle"),
    sidebar: document.getElementById("librarySidebarLinks"),
    landing: document.getElementById("servicesLandingGrid"),
    pages: document.getElementById("servicePagesContainer"),
    modal: document.getElementById("portfolioModal"),
    modalTitle: document.getElementById("modalTitle"),
    modalDesc: document.getElementById("modalDesc"),
    modalImg: document.getElementById("modalImg"),
    modalImgWrap: document.querySelector(".modal-img-wrap"),
    modalActions: document.getElementById("modalActionsRow")
  });

  const esc = (v="") => String(v).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[c]);

  const humanSize = (n=0) => {
    if (!n) return "";
    if (n < 1024) return n + " B";
    if (n < 1024*1024) return (n/1024).toFixed(1) + " KB";
    return (n/(1024*1024)).toFixed(1) + " MB";
  };

  const viewUrl = (id) => API_BASE + "/view?id=" + encodeURIComponent(id);

  function openStudentMedia(item) {
    const e = els();
    if (!e.modal || !e.modalActions) return;

    e.modalTitle.textContent = item.title || "معاينة الملف";
    e.modalDesc.textContent = [item.desc, humanSize(item.size)].filter(Boolean).join(" • ");

    if (e.modalImg) e.modalImg.style.display = "none";
    if (e.modalImgWrap) e.modalImgWrap.style.display = "none";

    e.modalActions.innerHTML = "";

    const viewer = document.createElement("div");
    viewer.className = "neon-media-viewer";

    if (item.type === "pdf") {
      const frame = document.createElement("iframe");
      frame.className = "neon-media-frame";
      frame.src = viewUrl(item.id) + "#toolbar=0&navpanes=0&scrollbar=1&view=FitH";
      frame.title = item.title || "PDF";
      frame.loading = "lazy";
      viewer.appendChild(frame);
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.className = "neon-media-video";
      video.controls = true;
      video.controlsList = "nodownload";
      video.disablePictureInPicture = true;
      video.src = viewUrl(item.id);
      viewer.appendChild(video);
    } else if (item.type === "image") {
      const img = document.createElement("img");
      img.className = "neon-media-image";
      img.src = viewUrl(item.id);
      img.alt = item.title || "";
      img.draggable = false;
      viewer.appendChild(img);
    } else {
      const note = document.createElement("div");
      note.className = "neon-media-note";
      note.textContent = "هذا النوع من الملفات غير مدعوم للمعاينة داخل المتصفح حاليًا.";
      viewer.appendChild(note);
    }

    e.modalActions.appendChild(viewer);
    e.modal.classList.add("is-open");
    e.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function buildCard(item) {
    const typeLabel = item.type === "pdf" ? "ملف PDF" :
      item.type === "video" ? "فيديو" :
      item.type === "image" ? "صورة" : "ملف";

    return `
      <article class="library-card reveal neon-student-card">
        <div class="library-card-icon">${esc(item.icon || "📄")}</div>
        <div class="library-card-content">
          <div class="library-card-meta">
            <span class="library-type ${esc(item.type)}">${typeLabel}</span>
            <span class="library-category">${esc(item.sectionLabel || "")}</span>
          </div>
          <h4>${esc(item.title)}</h4>
          <p>${esc(item.desc || "")}</p>
          <div class="neon-file-meta">
            <span><i class="fa-regular fa-file"></i> ${humanSize(item.size)}</span>
            <span><i class="fa-solid fa-shield-halved"></i> معاينة محمية</span>
          </div>
          <div class="library-card-actions">
            <button class="btn btn-primary neon-student-open" data-id="${esc(item.id)}">
              <i class="fa-regular fa-eye"></i>
              معاينة الملف
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderStudents() {
    if (!loaded) return;
    const e = els();
    if (!e.pages || !e.landing || !e.sidebar) return;

    const studentTab = document.querySelector('.library-main-tab[data-library-tab="students"]');
    const isStudents = studentTab?.classList.contains("active") ||
      location.hash.startsWith("#students-") ||
      (!location.hash || location.hash === "#services");

    if (!isStudents) return;

    document.querySelectorAll(".library-main-tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.libraryTab === "students");
    });

    if (e.badge) e.badge.textContent = "خدمات الطلاب";
    if (e.title) e.title.textContent = "مكتبة أعمال الطلاب";
    if (e.desc) e.desc.textContent = "ملفات حقيقية مرفوعة إلى Neon Object Storage الخاص بمنصة تمكين، وتُعرض داخل المنصة دون كشف رابط التخزين الأصلي.";
    if (e.sidebarTitle) e.sidebarTitle.textContent = "أقسام ملفات الطلاب";
    if (e.count) e.count.textContent = String(studentItems.length);
    if (e.sectionsCount) e.sectionsCount.textContent = String(sections.length);

    e.sidebar.innerHTML = sections.map(s => `
      <a class="library-sidebar-link" href="#${s.hash}">${esc(s.label)}</a>
    `).join("");

    e.landing.innerHTML = sections.map(s => {
      const items = studentItems.filter(x => x.group === s.key);
      return `
        <a class="landing-card reveal" href="#${s.hash}">
          <div class="landing-card-badge">${items.length} ملف</div>
          <h4>${esc(s.label)}</h4>
          <p>${esc(s.desc)}</p>
        </a>
      `;
    }).join("");

    e.pages.innerHTML = sections.map(s => {
      const items = studentItems.filter(x => x.group === s.key);
      return `
        <section class="service-page reveal" id="${s.hash}">
          <div class="service-page-head">
            <div>
              <span class="mini-badge">مكتبة الطلاب</span>
              <h3>${esc(s.label)}</h3>
              <p>${esc(s.desc)}</p>
            </div>
            <div class="service-page-count">
              <strong>${items.length}</strong>
              <span>ملف</span>
            </div>
          </div>
          <div class="service-page-grid">
            ${items.length ? items.map(buildCard).join("") : '<div class="neon-empty-state">لا توجد ملفات منشورة في هذا القسم حتى الآن.</div>'}
          </div>
        </section>
      `;
    }).join("");

    e.pages.querySelectorAll(".neon-student-open").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = studentItems.find(x => x.id === btn.dataset.id);
        if (item) openStudentMedia(item);
      });
    });
  }

  function renderError(message) {
    const e = els();
    if (!e.pages) return;
    e.pages.innerHTML = `
      <div class="neon-library-error">
        <i class="fa-solid fa-circle-exclamation"></i>
        <strong>تعذر تحميل مكتبة الطلاب</strong>
        <span>${esc(message)}</span>
        <button class="btn btn-primary" id="retryNeonStudents">إعادة المحاولة</button>
      </div>
    `;
    document.getElementById("retryNeonStudents")?.addEventListener("click", loadStudents);
  }

  async function loadStudents() {
    if (loading) return;
    loading = true;
    try {
      const res = await fetch(API_BASE + "/catalog", {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store"
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (!data?.ok || !Array.isArray(data.items)) throw new Error("استجابة غير صالحة من الخادم");
      studentItems = data.items;
      loaded = true;
      renderStudents();
    } catch (err) {
      console.error("Tamkeen Neon library:", err);
      renderError("تحقق من اتصال Neon ثم أعد المحاولة.");
    } finally {
      loading = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadStudents();

    document.querySelector('.library-main-tab[data-library-tab="students"]')?.addEventListener("click", () => {
      setTimeout(renderStudents, 0);
    });

    window.addEventListener("hashchange", () => {
      if (location.hash.startsWith("#students-")) setTimeout(renderStudents, 0);
    });

    document.addEventListener("contextmenu", (event) => {
      if (event.target.closest(".neon-media-viewer")) event.preventDefault();
    });

    document.addEventListener("dragstart", (event) => {
      if (event.target.closest(".neon-media-viewer")) event.preventDefault();
    });
  });
})();