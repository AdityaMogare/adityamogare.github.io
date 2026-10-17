const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const nav = document.getElementById("nav");
const navToggle = document.getElementById("nav-toggle");
const navPanel = document.getElementById("nav-panel");
const navLinks = document.getElementById("nav-links");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 12);
}, { passive: true });

navToggle?.addEventListener("click", () => {
  const open = navPanel.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
});

navPanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    const label = navToggle?.querySelector(".nav-toggle-label");
    if (label) label.textContent = "Menu";
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: motionQuery.matches ? "auto" : "smooth" });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const sections = document.querySelectorAll("main section[id]");
const navAnchors = [...document.querySelectorAll('#nav-links a[href^="#"], .toc a[href^="#"]')];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);
sections.forEach((section) => sectionObserver.observe(section));

const videos = [...document.querySelectorAll("video")];

function syncMotion() {
  const reduce = motionQuery.matches;
  videos.forEach((video) => {
    if (reduce) {
      video.removeAttribute("autoplay");
      video.pause();
    }
  });
}

syncMotion();
motionQuery.addEventListener?.("change", syncMotion);

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (motionQuery.matches) {
        video.pause();
        return;
      }
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  },
  { threshold: 0.25 }
);
videos.forEach((video) => videoObserver.observe(video));
