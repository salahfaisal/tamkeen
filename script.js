document.addEventListener("DOMContentLoaded", () => {
  // ====== AOS Animations ======
  if (window.AOS) {
    AOS.init({
      duration: 700,
      once: true,
    });
  }

  // ====== تمرير سلس للروابط الداخلية في الهيدر ======
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ====== فلترة كتالوج الأعمال ======
  const filterButtons = document.querySelectorAll(".catalog-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // ====== نافذة تفاصيل كتالوج الأعمال (المودال) ======
  const modal = document.getElementById("portfolioModal");
  const modalImg = modal?.querySelector(".modal-img");
  const modalTitle = modal?.querySelector(".modal-title");
  const modalDesc = modal?.querySelector(".modal-desc");
  const modalPdf = modal?.querySelector(".modal-pdf");
  const modalClose = modal?.querySelector(".modal-close");
  const modalBackdrop = modal?.querySelector(".modal-backdrop");
  const modalPdfPreview = modal?.querySelector(".modal-pdf-preview");
  const modalPdfFrame = modal?.querySelector(".modal-pdf-frame");

  function openModalFromItem(item) {
    if (!modal) return;

    const title = item.getAttribute("data-title") || "";
    const desc = item.getAttribute("data-desc") || "";
    const img = item.getAttribute("data-img") || "";
    const pdf = item.getAttribute("data-pdf") || "#";

    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalImg && img) {
      modalImg.src = img;
      modalImg.alt = title;
    }

    // زر فتح PDF في نافذة جديدة
    if (modalPdf) {
      if (!pdf || pdf === "#") {
        modalPdf.style.display = "none";
      } else {
        modalPdf.style.display = "inline-flex";
        modalPdf.setAttribute("href", pdf);
      }
    }

    // معاينة PDF داخل المودال (إذا توفّر ملف)
    if (modalPdfPreview && modalPdfFrame) {
      if (!pdf || pdf === "#") {
        modalPdfPreview.style.display = "none";
        modalPdfFrame.src = "";
      } else {
        modalPdfPreview.style.display = "block";
        modalPdfFrame.src = pdf;
      }
    }

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  if (modal) {
    // أزرار "عرض التفاصيل"
    const openButtons = document.querySelectorAll(".portfolio-open");
    openButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = btn.closest(".portfolio-item");
        if (item) {
          openModalFromItem(item);
        }
      });
    });

    // الضغط على الصورة
    const thumbs = document.querySelectorAll(".portfolio-thumb");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const item = thumb.closest(".portfolio-item");
        if (item) {
          openModalFromItem(item);
        }
      });
    });

    function closeModal() {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }

    modalClose?.addEventListener("click", closeModal);
    modalBackdrop?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }

  // ====== طلب خدمة + حفظ في localStorage ======
  const orderForm = document.getElementById("orderForm");
  const trackForm = document.getElementById("trackForm");
  const trackResult = document.getElementById("trackResult");

  const STORAGE_KEY = "tamkeen_orders";

  function loadOrders() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }

  function generateOrderId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id = "TMK-";
    for (let i = 0; i < 4; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  }

  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(orderForm);
      const type = formData.get("type");
      const desc = formData.get("desc");
      const links = formData.get("links");

      const id = generateOrderId();
      const orders = loadOrders();

      orders.push({
        id,
        type,
        desc,
        links,
        status: "تم الاستلام – جاري المراجعة",
        createdAt: new Date().toISOString(),
      });

      saveOrders(orders);
      orderForm.reset();

      if (trackResult) {
        trackResult.textContent = `تم إرسال طلبك بنجاح. رقم طلبك هو: ${id} – احتفظ به لتتبّع الطلب.`;
      }

      const trackSection = document.getElementById("trackForm");
      if (trackSection) {
        trackSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (trackForm && trackResult) {
    trackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("trackId");
      const id = input?.value.trim();
      if (!id) return;

      const orders = loadOrders();
      const order = orders.find((o) => o.id === id);

      if (!order) {
        trackResult.textContent = "لم يتم العثور على طلب بهذا الرقم في هذا المتصفح.";
      } else {
        trackResult.textContent = `حالة الطلب (${order.id}): ${order.status}`;
      }
    });
  }

  // ====== نموذج تواصل – رسالة نجاح أنيقة ======
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");

  if (contactForm && contactSuccess) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactForm.reset();
      contactSuccess.textContent = "تم إرسال رسالتك بنجاح. سنعود إليك في أقرب وقت بإذن الله.";
      contactSuccess.classList.add("show");
    });
  }

  // ====== نموذج "احجز استشارة مجانية" ======
  const consultForm = document.getElementById("consultForm");
  const consultSuccess = document.getElementById("consultSuccess");

  if (consultForm && consultSuccess) {
    consultForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(consultForm);
      const type = formData.get("type");
      const channel = formData.get("channel");

      consultForm.reset();
      consultSuccess.textContent =
        `تم استلام طلب الاستشارة (${type || "غير محدد"}) وسنتواصل معك عبر ${channel === "email" ? "البريد الإلكتروني" : "واتساب"} في أقرب وقت.`;
      consultSuccess.classList.add("show");
    });
  }

  // ====== زر واتساب متطوّر ======
  const waButton = document.getElementById("waButton");
  const waMenu = document.getElementById("waMenu");
  const waMenuClose = waMenu?.querySelector(".wa-menu-close");
  const waOptions = waMenu?.querySelectorAll(".wa-menu-item");

  const WA_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb6mwuEDzgT4oZ39wN43";

  function openWaMenu() {
    if (!waMenu) return;
    waMenu.classList.add("show");
  }

  function closeWaMenu() {
    if (!waMenu) return;
    waMenu.classList.remove("show");
  }

  if (waButton && waMenu) {
    waButton.addEventListener("click", () => {
      if (waMenu.classList.contains("show")) {
        closeWaMenu();
      } else {
        openWaMenu();
      }
    });

    waMenuClose?.addEventListener("click", closeWaMenu);

    waOptions?.forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-wa");
        if (!type) return;

        if (type === "track") {
          // الانتقال لقسم تتبّع الطلب داخل الصفحة
          const trackSection = document.getElementById("trackForm");
          if (trackSection) {
            trackSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          // استفسار عام أو طلب جديد → فتح قناة الواتساب
          let message = "";
          if (type === "general") {
            message = "مرحبًا، أود الاستفسار عن خدمات منصة تمكين.";
          } else if (type === "new") {
            message = "مرحبًا، أود طلب خدمة جديدة من منصة تمكين.";
          }
          const url = `${WA_CHANNEL_URL}?text=${encodeURIComponent(message)}`;
          window.open(url, "_blank");
        }

        closeWaMenu();
      });
    });

    // إغلاق القائمة إذا ضغطنا خارجها (اختياري)
    document.addEventListener("click", (e) => {
      if (!waMenu.classList.contains("show")) return;
      const target = e.target;
      if (
        target !== waButton &&
        !waMenu.contains(target)
      ) {
        closeWaMenu();
      }
    });
  }
});
