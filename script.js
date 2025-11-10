document.addEventListener("DOMContentLoaded", () => {
  // ========== القائمة الجانبية للجوال ==========
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("show");
    });
    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => mobileNav.classList.remove("show"));
    });
  }

  // ========== زر العودة للأعلى ==========
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", () => {
      if (window.scrollY > 250) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    });
  }

  // ========== شريط تقدم التمرير ==========
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  if (scrollProgressBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = progress + "%";
    });
  }

  // ========== رسالة نجاح لنموذج التواصل ==========
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");

  if (contactForm && contactSuccess) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      contactSuccess.style.display = "block";
      contactForm.reset();
      setTimeout(() => {
        contactSuccess.style.display = "none";
      }, 4000);
    });
  }
});
