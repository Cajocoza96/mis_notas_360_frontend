(function () {
  try {
    // Primero intentar desde localStorage (para carga rápida inicial)
    const theme = localStorage.getItem("theme") || "sistema";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark = theme === "oscuro" || (theme === "sistema" && prefersDark);

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  } catch (_) {}
})();