// مفتاح التخزين في المتصفح لطلبات الخدمات
const ORDERS_KEY = "tamkeen_orders";

// تحميل الطلبات من localStorage
function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// حفظ الطلبات في localStorage
function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// إنشاء طلب جديد
function createOrder(type, desc, links) {
  // رقم طلب عشوائي مثل TMK-A1B2
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const id = "TMK-" + randomPart;

  const order = {
    id,
    type,
    desc,
    links: links || "",
    status: "جديد",
    createdAt: new Date().toISOString(),
  };

  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

// البحث عن طلب برقم معيّن
function findOrder(id) {
  const orders = loadOrders();
  return orders.find(
    (o) => o.id.trim().toUpperCase() === id.trim().toUpperCase()
  );
}

// تشغيل الكود بعد تحميل الصفحة بالكامل
document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("orderForm");
  const trackForm = document.getElementById("trackForm");
  const trackIdInput = document.getElementById("trackId");
  const trackResult = document.getElementById("trackResult");
  const contactForm = document.getElementById("contactForm");

  // ========= إرسال طلب خدمة =========
  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(orderForm);
      const type = fd.get("type");
      const desc = fd.get("desc");
      const links = fd.get("links");

      if (!type || !desc) {
        alert("يرجى اختيار نوع الخدمة وكتابة الوصف.");
        return;
      }

      const order = createOrder(type, desc, links);

      alert(
        "تم إنشاء الطلب بنجاح.\n" +
          "رقم الطلب الخاص بك هو: " +
          order.id +
          "\n" +
          "احفظ هذا الرقم لتتبّع طلبك لاحقًا من نفس الجهاز والمتصفح."
      );

      orderForm.reset();

      // تعبئة حقل التتبع تلقائيًا إن وجد
      if (trackIdInput) {
        trackIdInput.value = order.id;
      }
      if (trackResult) {
        trackResult.textContent =
          "تم إنشاء الطلب برقم: " +
          order.id +
          " (الحالة: " +
          order.status +
          ").";
      }
    });
  }

  // ========= تتبّع الطلب =========
  if (trackForm) {
    trackForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!trackIdInput) {
        alert("حقل رقم الطلب غير موجود في الصفحة.");
        return;
      }

      const id = trackIdInput.value.trim();
      if (!id) {
        alert("يرجى إدخال رقم الطلب.");
        return;
      }

      const order = findOrder(id);

      if (!trackResult) return;

      if (order) {
        trackResult.textContent =
          "رقم الطلب: " +
          order.id +
          " | الحالة: " +
          order.status +
          " | نوع الخدمة: " +
          order.type;
      } else {
        trackResult.textContent =
          "لم يتم العثور على طلب بهذا الرقم في هذا المتصفح.\n" +
          "تأكد من الرقم أو تأكد أنك تستخدم نفس الجهاز ونفس المتصفح.";
      }
    });
  }

  // ========= نموذج تواصل معنا =========
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "شكرًا لتواصلك معنا.\n" +
          "تم استلام رسالتك (هذا نموذج تجريبي ولا يرسل بريدًا حقيقيًا)."
      );
      contactForm.reset();
    });
  }

  // ========= فلترة كتالوج الأعمال =========
  const filterButtons = document.querySelectorAll(".catalog-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        // تفعيل الزر المختار
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // إظهار/إخفاء العناصر حسب الفئة
        portfolioItems.forEach((item) => {
          const category = item.getAttribute("data-category");

          if (filter === "all" || category === filter) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // ========= نافذة تفاصيل كتالوج الأعمال =========
  const modal = document.getElementById("portfolioModal");
  const modalImg = modal?.querySelector(".modal-img");
  const modalTitle = modal?.querySelector(".modal-title");
  const modalDesc = modal?.querySelector(".modal-desc");
  const modalPdf = modal?.querySelector(".modal-pdf");
  const modalClose = modal?.querySelector(".modal-close");
  const modalBackdrop = modal?.querySelector(".modal-backdrop");

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
    if (modalPdf) {
      modalPdf.href = pdf;
      modalPdf.style.display = pdf === "#" ? "none" : "inline-flex";
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

    // أيضًا الضغط على الصورة يفتح التفاصيل
    const thumbs = document.querySelectorAll(".portfolio-thumb");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const item = thumb.closest(".portfolio-item");
        if (item) {
          openModalFromItem(item);
        }
      });
    });

    // إغلاق النافذة
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

  // ========= تشغيل AOS للأنيميشن =========
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out",
      once: true,
    });
  }
});
