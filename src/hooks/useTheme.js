import { useState, useEffect } from "react";

const themeKeys = {
    system: "system",
    light: "light",
    dark: "dark",
}

export function useTheme() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || themeKeys.system);

    useEffect(() => {
        const root = document.documentElement;
        const mediaquery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            root.classList.toggle(
                "dark",
                theme === themeKeys.dark ||
                (theme === themeKeys.system && mediaquery.matches)
            );
            localStorage.setItem("theme", theme);
        };

        applyTheme();

        mediaquery.addEventListener("change", applyTheme);

        return () => {
            mediaquery.removeEventListener("change", applyTheme);
        }
    }, [theme]);

    return {
        theme,
        setTheme,
        themeKeys
    };
}