// This file is intentionally left blank.// Simple client-side include for header and footer components
document.addEventListener("DOMContentLoaded", () => {
  const include = async (selector, path) => {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Not found");
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(`Failed to load ${path}:`, err);
    }
  };

  include("#header-placeholder", "../components/header.html");
  include("#footer-placeholder", "../components/footer.html"); // jika footer dibuat nanti
});
