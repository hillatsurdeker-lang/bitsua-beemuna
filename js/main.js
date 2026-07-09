// ביצוע באמונה — לוגיקת דף נחיתה, ללא תלות בספריות חיצוניות

// מספר וואטסאפ יחיד — כאן בלבד יש לעדכן אם המספר משתנה
const WHATSAPP_NUMBER = "972548015875";

// כתובת האתר הסופית — משמשת כתיעוד ליעד קוד ה-QR בתיקיית assets/qr
// כשהכתובת הסופית תיקבע, עדכנו כאן ובנו מחדש את הקובץ assets/qr/qr-placeholder.svg
const SITE_URL = "https://bitsua-beemuna.co.il/";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

  initLeadForms();
  initBeforeAfterSliders();
  initLightbox();
  initTestimonialCarousel();
  initFaqAccordion();
  initAccessibilityPanel();
  initRevealOnScroll();
});

/* ----------------------------- טפסי לידים -> וואטסאפ ----------------------------- */
function initLeadForms() {
  document.querySelectorAll("[data-wa-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const service = (data.get("service") || "").toString().trim();

      let message = `שלום, שמי ${name}.`;
      if (service) message += ` אני מעוניין/ת בשירות: ${service}.`;
      message += ` אשמח לקבל הצעת מחיר. הטלפון שלי: ${phone}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");

      form.classList.add("is-sent");
      const thanks = form.querySelector(".form-thanks");
      if (thanks) thanks.classList.add("is-visible");
    });
  });
}

/* ----------------------------- סליידר לפני/אחרי ----------------------------- */
function initBeforeAfterSliders() {
  document.querySelectorAll(".ba").forEach((wrap) => {
    const range = wrap.querySelector(".ba__range");
    const after = wrap.querySelector(".ba__after");
    const line = wrap.querySelector(".ba__line");
    if (!range || !after) return;

    const update = () => {
      const value = range.value;
      after.style.clipPath = `inset(0 0 0 ${value}%)`;
      if (line) line.style.left = `${value}%`;
    };
    range.addEventListener("input", update);
    update();
  });
}

/* ----------------------------- Lightbox (dialog נטיבי) ----------------------------- */
function initLightbox() {
  const dialog = document.getElementById("lightbox");
  const image = document.getElementById("lightbox-image");
  if (!dialog || !image) return;

  document.querySelectorAll("[data-lightbox-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const figure = button.closest("[data-lightbox-group]");
      const full = figure ? figure.querySelector(".ba__after")?.dataset.full : null;
      if (full) {
        image.src = full;
        image.alt = figure.querySelector(".ba__after").alt;
        dialog.showModal();
      }
    });
  });

  dialog.querySelectorAll("[data-lightbox-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  // הצהרת נגישות משתמשת באותו רכיב דיאלוג נטיבי
  const a11yDialog = document.getElementById("a11y-statement-dialog");
  if (a11yDialog) {
    document.querySelectorAll("[data-a11y-statement-open]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        a11yDialog.showModal();
      });
    });
    a11yDialog.querySelectorAll("[data-lightbox-close]").forEach((button) => {
      button.addEventListener("click", () => a11yDialog.close());
    });
    a11yDialog.addEventListener("click", (event) => {
      if (event.target === a11yDialog) a11yDialog.close();
    });
  }
}

/* ----------------------------- קרוסלת המלצות ----------------------------- */
function initTestimonialCarousel() {
  const track = document.getElementById("t-track");
  const dotsWrap = document.getElementById("t-dots");
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `המלצה ${index + 1}`);
    dot.setAttribute("aria-current", index === 0 ? "true" : "false");
    dot.addEventListener("click", () => {
      slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = slides.indexOf(entry.target);
          dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === index)));
        }
      });
    },
    { root: track, threshold: 0.6 }
  );
  slides.forEach((slide) => observer.observe(slide));
}

/* ----------------------------- אקורדיון שאלות נפוצות ----------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
}

/* ----------------------------- תפריט נגישות ----------------------------- */
function initAccessibilityPanel() {
  const toggle = document.querySelector(".a11y-toggle");
  const panel = document.getElementById("a11y-panel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  const html = document.documentElement;

  panel.querySelectorAll("[data-fs]").forEach((button) => {
    button.addEventListener("click", () => {
      const level = button.dataset.fs;
      if (level === "0") html.removeAttribute("data-fs");
      else html.setAttribute("data-fs", level);
      panel.querySelectorAll("[data-fs]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    });
  });

  const contrastBtn = panel.querySelector("[data-contrast]");
  if (contrastBtn) {
    contrastBtn.addEventListener("click", () => {
      const active = html.classList.toggle("a11y-contrast");
      contrastBtn.setAttribute("aria-pressed", String(active));
    });
  }

  const underlineBtn = panel.querySelector("[data-underline]");
  if (underlineBtn) {
    underlineBtn.addEventListener("click", () => {
      const active = html.classList.toggle("a11y-underline");
      underlineBtn.setAttribute("aria-pressed", String(active));
    });
  }

  document.addEventListener("click", (event) => {
    if (!panel.contains(event.target) && event.target !== toggle && !toggle.contains(event.target)) {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ----------------------------- אנימציית כניסה בגלילה ----------------------------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
}
