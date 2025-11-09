const ORDERS_KEY = "tamkeen_orders";

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function createOrder(type, desc, links) {
  const id = "TMK" + Math.random().toString(36).substring(2, 6).toUpperCase();
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

function findOrder(id) {
  const orders = loadOrders();
  return orders.find((o) => o.id.trim().toUpperCase() === id.trim().toUpperCase());
}

document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("orderForm");
  const trackForm = document.getElementById("trackForm");
  const trackIdInput = document.getElementById("trackId");
  const trackResult = document.getElementById("trackResult");
  const contactForm = document.getElementById("contactForm");

  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(orderForm);
      const type = fd.get("type");
      const desc = fd.get("desc");
      const links = fd.get("links");
      if (!type || !desc) return;

      const order = createOrder(type, desc, links);
      alert("تم إنشاء الطلب بنجاح. رقم الطلب الخاص بك هو: " + order.id + "\nاحفظ هذا الرقم لتتبّع طلبك لاحقًا.");
      orderForm.reset();
      if (trackIdInput) {
        trackIdInput.value = order.id;
        if (trackResult) {
          trackResult.textContent = "تم إنشاء الطلب برقم: " + order.id + " (الحالة: " + order.status + ")";
        }
      }
    });
  }

  if (trackForm) {
    trackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = trackIdInput.value.trim();
      if (!id) return;
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
          "لم يتم العثور على طلب بهذا الرقم في هذا المتصفح. تأكد من الرقم أو من أنك تستخدم نفس الجهاز والمتصفح.";
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("شكرًا لتواصلك معنا. تم استلام رسالتك (نموذج تجريبي لا يرسل بريدًا حقيقيًا).");
      contactForm.reset();
    });
  }
});
