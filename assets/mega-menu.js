document.addEventListener("DOMContentLoaded", () => {
  const parentMenus = document.querySelectorAll(".list-menu__item--has-mega");
  if (!parentMenus.length) return;

  // Normalize path for consistent comparison
  const normalizePath = (url) => {
    if (!url) return "";
    try {
      return new URL(url, location.origin).pathname.replace(/\/$/, "");
    } catch {
      return url.replace(/\/$/, "");
    }
  };

  const currentPath = normalizePath(location.pathname);

  parentMenus.forEach((parent) => {
    const panel = parent.querySelector(".mega-menu");
    if (!panel) return;

    const displayImg = panel.querySelector(".mega-menu__display-image");
    const caption = panel.querySelector(".mega-menu__display-caption");
    const navLinks = [...panel.querySelectorAll(".mega-menu__nav-link")];
    if (!navLinks.length) return;

    const defaultSrc = displayImg?.dataset.src || displayImg?.src || "";
    const defaultCaption = caption?.textContent || "";

    let persistedLink =
      navLinks.find(
        (l) => normalizePath(l.getAttribute("href")) === currentPath
      ) ||
      panel.querySelector(
        ".mega-menu__nav-item.is-active .mega-menu__nav-link"
      ) ||
      navLinks[0];

    // Apply active state
    const setActive = (link) => {
      if (!link) return;

      const newSrc = link.dataset.image || defaultSrc;
      if (displayImg && newSrc && displayImg.src !== newSrc) {
        displayImg.src = newSrc;
      }

      if (caption) {
        caption.textContent =
          link.dataset.title || link.textContent.trim() || defaultCaption;
      }

      navLinks.forEach((l) => l.parentElement.classList.remove("is-active"));
      link.parentElement.classList.add("is-active");
    };

    // Initialize
    setActive(persistedLink);

    // Hover/focus preview
    const previewHandler = (e) => setActive(e.currentTarget);
    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", previewHandler, { passive: true });
      link.addEventListener("focus", previewHandler, { passive: true });
    });

    // Revert logic
    const revert = () => setActive(persistedLink);
    parent.addEventListener("mouseleave", revert);
    parent.addEventListener("focusout", (e) => {
      if (!parent.contains(e.relatedTarget)) revert();
    });

    // Escape closes menu
    parent.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        revert();
        parent.classList.remove("is-open");
        parent.querySelector(".list-menu__link, .link")?.focus();
      }
    });

    // Accessibility: open on focus
    parent.addEventListener("focusin", () => parent.classList.add("is-open"));
  });
});
