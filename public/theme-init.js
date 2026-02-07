(function () {
  try {
    const theme = localStorage.getItem("theme") || "sistema";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = theme === "oscuro" || (theme === "sistema" && prefersDark);

    // Aplica las clases al HTML
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);

    // Actualiza el theme-color
    const themeColor = isDark ? "#1f2937" : "#ffffff";
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeColor);

    // Fuerza el background
    document.documentElement.style.backgroundColor = themeColor;

  } catch (_) {}
})();