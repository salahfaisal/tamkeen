(() => {
  "use strict";

  const API = "/api/researcher-media";
  const PDFJS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const SECTION_MAP = [
    { family:"research-works", category:"Measurement_and_Imaging", label:"القياس والتصوير", hash:"researchers-measurement-imaging", desc:"أبحاث ودراسات في أنظمة القياس، الرؤية، والتصوير الحاسوبي." },
    { family:"research-works", category:"EV_and_Energy", label:"المركبات الكهربائية والطاقة", hash:"researchers-ev-energy", desc:"أعمال بحثية في شحن المركبات الكهربائية وأنظمة الطاقة." },
    { family:"research-works", category:"Federated_Learning_and_Healthcare", label:"التعلم الاتحادي والرعاية الصحية", hash:"researchers-fl-healthcare", desc:"أبحاث في التعلم الاتحادي وتطبيقاته في الرعاية الصحية." },
    { family:"research-works", category:"Control_and_Optimization", label:"التحكم والتحسين", hash:"researchers-control-optimization", desc:"أبحاث في هندسة التحكم، ضبط المتحكمات، والتحسين." },
    { family:"research-works", category:"Neurotechnology", label:"التقنيات العصبية", hash:"researchers-neurotechnology", desc:"أعمال بحثية في تقنيات التحفيز العصبي والموضوعات المرتبطة بها." },
    { family:"samples", category:"Federated_Learning", label:"نماذج التعلم الاتحادي", hash:"researchers-sample-fl", desc:"نماذج مختارة من المراجعات والأعمال البحثية في التعلم الاتحادي." },
    { family:"samples", category:"Control_Engineering", label:"نماذج هندسة التحكم", hash:"researchers-sample-control", desc:"نماذج مراجعات وأعمال أكاديمية في هندسة التحكم." },
    { family:"samples", category:"EV_Charging", label:"نماذج شحن المركبات الكهربائية", hash:"researchers-sample-ev", desc:"نماذج هندسية ومراجعات أدبية في مجال شحن المركبات الكهربائية." }
  ];

  const META = {
    "01_Camera_Based_Measurement_Systems.pdf": {
      title:"أنظمة القياس المعتمدة على الكاميرا",
      desc:"عمل بحثي في أنظمة القياس المعتمدة على الكاميرا والرؤية الحاسوبية."
    },
    "02_Deep_Learning_Imaging.pdf": {
      title:"التصوير باستخدام التعلم العميق",
      desc:"عمل بحثي في تقنيات التصوير المعتمدة على التعلم العميق."
    },
    "03_EV_Charging_Systems.pdf": {
      title:"أنظمة شحن المركبات الكهربائية",
      desc:"عمل بحثي في أنظمة وتقنيات شحن المركبات الكهربائية."
    },
    "04_Federated_Learning_in_Healthcare.pdf": {
      title:"التعلم الاتحادي في الرعاية الصحية",
      desc:"عمل بحثي في تطبيقات التعلم الاتحادي ضمن قطاع الرعاية الصحية."
    },
    "05_Controller_Tuning_Optimization.pdf": {
      title:"تحسين ضبط المتحكمات",
      desc:"عمل بحثي في منهجيات ضبط المتحكمات والتحسين."
    },
    "06_Transcranial_Stimulation.pdf": {
      title:"التحفيز عبر الجمجمة",
      desc:"عمل بحثي في تقنيات التحفيز عبر الجمجمة وتطبيقاتها."
    },
    "Sample_01_Federated_Learning_Review.pdf": {
      title:"نموذج مراجعة — التعلم الاتحادي",
      desc:"نموذج مختار لمراجعة بحثية في مجال التعلم الاتحادي."
    },
    "Sample_02_Control_Engineering_Review.pdf": {
      title:"نموذج مراجعة — هندسة التحكم",
      desc:"نموذج مختار لمراجعة بحثية في مجال هندسة التحكم."
    },
    "Sample_03_EV_Charging_Engineering.pdf": {
      title:"نموذج هندسي — شحن المركبات الكهربائية",
      desc:"نموذج عمل هندسي في مجال أنظمة شحن المركبات الكهربائية."
    },
    "Sample_04_EV_Charging_Literature_Review.pdf": {
      title:"نموذج مراجعة أدبية — شحن المركبات الكهربائية",
      desc:"نموذج مراجعة أدبية في مجال شحن المركبات الكهربائية."
    }
  };

  let items = [];
  let loaded = false;
  let loading = false;
  let pdfJsPromise = null;

  const esc = (v="") => String(v)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");

  const formatBytes = (n=0) => {
    if (!n) return "";
    if (n < 1024 * 1024) return Math.max(1, Math.round(n/1024)) + " KB";
    return (n/(1024*1024)).toFixed(1) + " MB";
  };

  const filename = item => (item.objectKey || "").split("/").pop() || "";
  const enrich = item => {
    const meta = META[filename(item)] || {};
    return {
      ...item,
      title: meta.title || item.title || "ملف بحثي",
      desc: meta.desc || "نموذج عمل بحثي متاح للمعاينة داخل منصة تمكين."
    };
  };

  const viewUrl = item => API + "?view=" + encodeURIComponent(item.id);

  const ensurePdfJs = () => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      return Promise.resolve(window.pdfjsLib);
    }
    if (pdfJsPromise) return pdfJsPromise;

    pdfJsPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-tamkeen-pdfjs]');
      const finish = () => {
        if (!window.pdfjsLib) return reject(new Error("PDF.js failed to initialize"));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
      };
      if (existing) {
        if (window.pdfjsLib) return finish();
        existing.addEventListener("load", finish, { once:true });
        existing.addEventListener("error", () => reject(new Error("PDF.js failed to load")), { once:true });
        return;
      }
      const script = document.createElement("script");
      script.src = PDFJS_SRC;
      script.async = true;
      script.dataset.tamkeenPdfjs = "true";
      script.onload = finish;
      script.onerror = () => reject(new Error("PDF.js failed to load"));
      document.head.appendChild(script);
    });
    return pdfJsPromise;
  };

  const renderPage = async (pdf, pageNumber, canvas, width) => {
    const page = await pdf.getPage(pageNumber);
    const base = page.getViewport({ scale:1 });
    const cssWidth = Math.max(220, width || 320);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale:(cssWidth/base.width)*dpr });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = Math.floor(viewport.width/dpr) + "px";
    canvas.style.height = Math.floor(viewport.height/dpr) + "px";
    await page.render({ canvasContext:canvas.getContext("2d",{alpha:false}), viewport }).promise;
  };

  const renderThumb = async canvas => {
    if (!canvas || canvas.dataset.rendering === "1" || canvas.dataset.rendered === "1") return;
    canvas.dataset.rendering = "1";
    const shell = canvas.closest(".student-document-preview");
    const loadingEl = shell?.querySelector(".research-pdf-loading");
    const fallback = shell?.querySelector(".research-pdf-fallback");
    try {
      const lib = await ensurePdfJs();
      const pdf = await lib.getDocument({ url:canvas.dataset.pdfUrl, rangeChunkSize:262144 }).promise;
      await renderPage(pdf,1,canvas,Math.max(240,shell?.clientWidth || 320));
      canvas.dataset.rendered = "1";
      canvas.classList.add("is-ready");
      shell?.classList.add("pdf-ready");
      if (loadingEl) loadingEl.hidden = true;
      if (fallback) fallback.hidden = true;
      await pdf.destroy();
    } catch (e) {
      console.error("researcher thumbnail",e);
      if (loadingEl) loadingEl.hidden = true;
      if (fallback) fallback.hidden = false;
    } finally {
      canvas.dataset.rendering = "0";
    }
  };

  const observeThumbs = root => {
    const canvases = [...root.querySelectorAll("canvas[data-research-pdf]")];
    if (!("IntersectionObserver" in window)) {
      canvases.forEach(renderThumb);
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        renderThumb(entry.target);
      });
    }, { rootMargin:"400px 0px", threshold:.01 });
    canvases.forEach(c => obs.observe(c));
  };

  const injectStyles = () => {
    if (document.getElementById("researcherNeonStyles")) return;
    const style = document.createElement("style");
    style.id = "researcherNeonStyles";
    style.textContent = `
      .research-pdf-loading,.research-pdf-fallback{
        position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:.65rem;background:linear-gradient(180deg,#f8fafb,#eef2f5);color:#687680;font-size:.82rem;font-weight:800;text-align:center
      }
      .research-pdf-loading[hidden],.research-pdf-fallback[hidden]{display:none!important}
      .research-pdf-fallback i{font-size:3rem;color:#b9bfc5}
      .researcher-media-canvas{position:relative;inset:auto;width:calc(100% - 24px)!important;height:auto!important;margin:12px auto;object-fit:contain;display:block;opacity:0;background:#fff;box-shadow:0 4px 16px rgba(31,48,61,.08);transition:opacity .18s ease;flex:0 0 auto}
      .researcher-media-canvas.is-ready{opacity:1}
      .researcher-family-note{display:inline-flex;align-items:center;gap:.4rem;font-size:.75rem;font-weight:800;color:var(--muted);margin-top:.55rem}
      .researcher-viewer{position:fixed;inset:0;z-index:10020;display:none}
      .researcher-viewer.is-open{display:block}
      .researcher-viewer__backdrop{position:absolute;inset:0;background:rgba(24,18,28,.72);backdrop-filter:blur(4px)}
      .researcher-viewer__dialog{position:absolute;inset:3vh 3vw;background:#fff;border-radius:22px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 25px 80px rgba(0,0,0,.28)}
      .researcher-viewer__head{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.85rem 1rem;border-bottom:1px solid var(--border)}
      .researcher-viewer__title{font-weight:900;color:var(--primary-deep)}
      .researcher-viewer__close{width:42px;height:42px;border:1px solid var(--border);background:#fff;border-radius:12px;font-size:1.5rem;cursor:pointer}
      .researcher-viewer__body{flex:1;min-height:0;overflow:auto;background:#e9edf0}
      .researcher-pdf-toolbar{position:sticky;top:0;z-index:3;display:flex;justify-content:center;align-items:center;gap:.75rem;padding:.65rem;background:rgba(255,255,255,.96);border-bottom:1px solid var(--border)}
      .researcher-pdf-toolbar button{min-width:42px;min-height:38px;border:1px solid var(--border);border-radius:11px;background:#fff;color:var(--primary-deep);font-weight:900;cursor:pointer}
      .researcher-pdf-toolbar button:disabled{opacity:.4}
      .researcher-pdf-stage{display:flex;justify-content:center;align-items:flex-start;padding:1rem;min-height:100%}
      .researcher-pdf-stage canvas{max-width:100%;height:auto!important;background:#fff;box-shadow:0 8px 30px rgba(26,35,43,.14)}
      .researcher-loading,.researcher-error{padding:2rem;text-align:center;color:#56636d;font-weight:800}
      @media(max-width:720px){
        .researcher-viewer__dialog{inset:0;border-radius:0}
        .researcher-pdf-stage{padding:.55rem}
      }
    `;
    document.head.appendChild(style);
  };

  const ensureViewer = () => {
    let viewer = document.getElementById("researcherMediaViewer");
    if (viewer) return viewer;
    viewer = document.createElement("div");
    viewer.id = "researcherMediaViewer";
    viewer.className = "researcher-viewer";
    viewer.setAttribute("aria-hidden","true");
    viewer.innerHTML = `
      <div class="researcher-viewer__backdrop" data-r-close></div>
      <div class="researcher-viewer__dialog" role="dialog" aria-modal="true">
        <div class="researcher-viewer__head">
          <div class="researcher-viewer__title"></div>
          <button class="researcher-viewer__close" type="button" data-r-close aria-label="إغلاق">×</button>
        </div>
        <div class="researcher-viewer__body"></div>
      </div>
    `;
    document.body.appendChild(viewer);

    const close = async () => {
      viewer.classList.remove("is-open");
      viewer.setAttribute("aria-hidden","true");
      document.body.style.overflow = "";
      if (viewer._pdf) {
        try { await viewer._pdf.destroy(); } catch {}
        viewer._pdf = null;
      }
      viewer.querySelector(".researcher-viewer__body").innerHTML = "";
    };
    viewer.querySelectorAll("[data-r-close]").forEach(x => x.addEventListener("click",close));
    document.addEventListener("keydown",e => { if (e.key === "Escape" && viewer.classList.contains("is-open")) close(); });
    return viewer;
  };

  const openViewer = async item => {
    const viewer = ensureViewer();
    const body = viewer.querySelector(".researcher-viewer__body");
    viewer.querySelector(".researcher-viewer__title").textContent = item.title;
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    body.innerHTML = '<div class="researcher-loading">جارٍ تجهيز ملف PDF…</div>';

    try {
      const lib = await ensurePdfJs();
      const pdf = await lib.getDocument({ url:viewUrl(item), rangeChunkSize:262144 }).promise;
      viewer._pdf = pdf;
      let current = 1;
      body.innerHTML = `
        <div class="researcher-pdf-toolbar">
          <button type="button" data-r-next aria-label="التالي"><i class="fa-solid fa-chevron-right"></i></button>
          <span data-r-label></span>
          <button type="button" data-r-prev aria-label="السابق"><i class="fa-solid fa-chevron-left"></i></button>
        </div>
        <div class="researcher-pdf-stage"><canvas data-r-canvas></canvas></div>
      `;
      const canvas = body.querySelector("[data-r-canvas]");
      const stage = body.querySelector(".researcher-pdf-stage");
      const label = body.querySelector("[data-r-label]");
      const prev = body.querySelector("[data-r-prev]");
      const next = body.querySelector("[data-r-next]");

      const draw = async () => {
        label.textContent = `الصفحة ${current} من ${pdf.numPages}`;
        prev.disabled = current <= 1;
        next.disabled = current >= pdf.numPages;
        await renderPage(pdf,current,canvas,Math.max(280,Math.min((stage.clientWidth || 900)-30,1000)));
        body.scrollTop = 0;
      };
      prev.addEventListener("click",async()=>{ if(current>1){current--;await draw();}});
      next.addEventListener("click",async()=>{ if(current<pdf.numPages){current++;await draw();}});
      await draw();
    } catch (e) {
      console.error("researcher viewer",e);
      body.innerHTML = '<div class="researcher-error">تعذر عرض الملف حاليًا. أعد المحاولة بعد قليل.</div>';
    }
  };

  const buildCard = item => {
    const section = SECTION_MAP.find(s => s.family === item.family && s.category === item.category);
    const familyLabel = item.family === "samples" ? "نموذج بحثي" : "عمل بحثي";
    return `
      <article class="student-credential-card reveal visible">
        <div class="student-document-preview researcher-open" data-id="${esc(item.id)}" role="button" tabindex="0" aria-label="معاينة ${esc(item.title)}">
          <canvas class="researcher-media-canvas" data-research-pdf data-pdf-url="${viewUrl(item)}" aria-hidden="true"></canvas>
          <div class="research-pdf-loading"><i class="fa-solid fa-spinner fa-spin"></i><span>جارٍ تحميل الصفحة الأولى…</span></div>
          <div class="research-pdf-fallback" hidden><i class="fa-solid fa-file-pdf"></i><span>PDF</span></div>
          <div class="student-preview-shade">
            <span class="student-preview-badge">PDF</span>
            <span class="student-preview-action">عرض الملف <i class="fa-solid fa-arrow-left"></i></span>
          </div>
        </div>
        <div class="student-credential-body">
          <div class="student-credential-meta">
            <span class="student-category">${esc(section?.label || item.category)}</span>
            <span>${familyLabel}</span>
          </div>
          <h4>${esc(item.title)}</h4>
          <p>${esc(item.desc)}</p>
          <div class="researcher-family-note"><i class="fa-regular fa-file"></i> ${formatBytes(item.size)}</div>
        </div>
      </article>
    `;
  };

  const render = () => {
    if (!loaded) return;
    const tab = document.querySelector('.library-main-tab[data-library-tab="researchers"]');
    const active = tab?.classList.contains("active") || location.hash.startsWith("#researchers-");
    if (!active) return;

    document.querySelectorAll(".library-main-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.libraryTab === "researchers"));

    const badge = document.getElementById("libraryMainBadge");
    const title = document.getElementById("libraryMainTitle");
    const desc = document.getElementById("libraryMainDesc");
    const count = document.getElementById("libraryCount");
    const sectionsCount = document.getElementById("librarySectionsCount");
    const sidebarTitle = document.getElementById("librarySidebarTitle");
    const sidebar = document.getElementById("librarySidebarLinks");
    const landing = document.getElementById("servicesLandingGrid");
    const pages = document.getElementById("servicePagesContainer");
    if (!sidebar || !landing || !pages) return;

    if (badge) badge.textContent = "نماذج أعمال الباحثين";
    if (title) title.textContent = "أعمال ونماذج بحثية";
    if (desc) desc.textContent = "نماذج مختارة من الأعمال والمراجعات البحثية في عدد من المجالات الهندسية والتقنية والصحية.";
    if (count) count.textContent = String(items.length);
    if (sectionsCount) sectionsCount.textContent = String(SECTION_MAP.filter(s => items.some(i => i.family===s.family && i.category===s.category)).length);
    if (sidebarTitle) sidebarTitle.textContent = "تصنيفات الأعمال البحثية";

    const populated = SECTION_MAP.filter(s => items.some(i => i.family===s.family && i.category===s.category));

    sidebar.innerHTML = populated.map(s => `<a class="library-sidebar-link" href="#${s.hash}">${esc(s.label)}</a>`).join("");
    landing.innerHTML = populated.map(s => {
      const list = items.filter(i => i.family===s.family && i.category===s.category);
      return `
        <a class="landing-card reveal visible" href="#${s.hash}">
          <div class="landing-card-badge">${list.length} ملف</div>
          <h4>${esc(s.label)}</h4>
          <p>${esc(s.desc)}</p>
        </a>
      `;
    }).join("");

    pages.innerHTML = populated.map(s => {
      const list = items.filter(i => i.family===s.family && i.category===s.category);
      return `
        <section class="service-page reveal visible" id="${s.hash}">
          <div class="service-page-head">
            <div>
              <span class="mini-badge">نماذج أعمال الباحثين</span>
              <h3>${esc(s.label)}</h3>
              <p>${esc(s.desc)}</p>
            </div>
            <div class="service-page-count"><strong>${list.length}</strong><span>ملف</span></div>
          </div>
          <div class="service-page-grid">${list.map(buildCard).join("")}</div>
        </section>
      `;
    }).join("");

    pages.querySelectorAll(".researcher-open").forEach(el => {
      const activate = () => {
        const item = items.find(x => x.id === el.dataset.id);
        if (item) openViewer(item);
      };
      el.addEventListener("click",activate);
      el.addEventListener("keydown",e => { if(e.key==="Enter" || e.key===" "){e.preventDefault();activate();}});
    });

    observeThumbs(pages);
  };

  const renderError = () => {
    const tab = document.querySelector('.library-main-tab[data-library-tab="researchers"]');
    if (!tab?.classList.contains("active") && !location.hash.startsWith("#researchers-")) return;
    const pages = document.getElementById("servicePagesContainer");
    if (pages) pages.innerHTML = '<div class="researcher-error">تعذر تحميل ملفات الباحثين مؤقتًا. أعد المحاولة بعد قليل.</div>';
  };

  const load = async () => {
    if (loading) return;
    loading = true;
    try {
      const res = await fetch(API,{headers:{Accept:"application/json"},cache:"no-store"});
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (!data?.ok || !Array.isArray(data.items)) throw new Error("Invalid response");
      items = data.items.map(enrich);
      loaded = true;
      render();
    } catch (e) {
      console.error("Tamkeen researcher library",e);
      renderError();
    } finally {
      loading = false;
    }
  };

  document.addEventListener("DOMContentLoaded",() => {
    injectStyles();
    load();

    document.querySelector('.library-main-tab[data-library-tab="researchers"]')?.addEventListener("click",() => {
      setTimeout(() => loaded ? render() : load(), 0);
    });

    window.addEventListener("hashchange",() => {
      if (location.hash.startsWith("#researchers-")) setTimeout(() => loaded ? render() : load(), 0);
    });

    document.addEventListener("contextmenu",e => {
      if (e.target.closest(".researcher-viewer,.student-document-preview.researcher-open")) e.preventDefault();
    });
  });
})();