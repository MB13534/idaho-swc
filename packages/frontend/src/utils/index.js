export const scrollWindowToTop = (smooth = true) => {
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
};
