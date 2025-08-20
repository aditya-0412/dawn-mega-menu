document.addEventListener("DOMContentLoaded", () => {
  const parentMenus = document.querySelectorAll(".list-menu__item--has-mega");
  if (!parentMenus.length) return;

  const normalizePath = (url) => {
    try {
      return new URL(url, location.origin).pathname.replace(/\/$/, "");
    } catch {
      return (url || "").replace(/\/$/, "");
    }
  };

  const currentPath = normalizePath(location.pathname);

  parentMenus.forEach((parent) => {
    const panel = parent.querySelector(".mega-menu");
    if (!panel) return;

    const displayImg = panel.querySelector(".mega-menu__display-image");
    const caption = panel.querySelector(".mega-menu__display-caption");
    const navLinks = Array.from(panel.querySelectorAll(".mega-menu__nav-link"));
    if (!navLinks.length) return;

    const defaultSrc = displayImg?.dataset.src || displayImg?.src || "";
    const defaultCaption = caption?.textContent || "";

    // --- Core state ---
    let persistedLink =
      navLinks.find(
        (l) => normalizePath(l.getAttribute("href")) === currentPath
      ) ||
      panel.querySelector(
        ".mega-menu__nav-item.is-active .mega-menu__nav-link"
      ) ||
      navLinks[0];

    const setActive = (link) => {
      if (!link) return;

      // swap image
      const newSrc = link.dataset.image || defaultSrc;
      if (displayImg && newSrc && displayImg.src !== newSrc) {
        displayImg.src = newSrc;
      }

      // swap caption
      if (caption)
        caption.textContent =
          link.dataset.title || link.textContent.trim() || defaultCaption;

      // toggle active class
      navLinks.forEach((l) => l.parentElement.classList.remove("is-active"));
      link.parentElement.classList.add("is-active");
    };

    // initialize with persisted
    setActive(persistedLink);

    // hover/focus preview
    const previewHandler = (e) => setActive(e.currentTarget);
    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", previewHandler);
      link.addEventListener("focus", previewHandler);
    });

    // revert logic
    const revert = () => setActive(persistedLink);

    parent.addEventListener("mouseleave", revert);
    parent.addEventListener(
      "focusout",
      (e) => !parent.contains(e.relatedTarget) && revert()
    );
    parent.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        revert();
        parent.classList.remove("is-open");
        parent.querySelector(".list-menu__link, .link")?.focus();
      }
    });

    // accessibility open
    parent.addEventListener("focusin", () => parent.classList.add("is-open"));
  });
});
