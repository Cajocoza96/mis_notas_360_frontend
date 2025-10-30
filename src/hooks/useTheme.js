import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTema, guardarTema } from "../store/preferenciaSlice";

const themeKeys = {
    sistema: "sistema",
    claro: "claro",
    oscuro: "oscuro",
}

// Función auxiliar para aplicar el tema al DOM
const applyThemeToDOM = (theme) => {
    const root = document.documentElement;
    const mediaquery = window.matchMedia("(prefers-color-scheme: dark)");
    const prefersDark = mediaquery.matches;

    const isDark = theme === themeKeys.oscuro || (theme === themeKeys.sistema && prefersDark);

    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);

    // Actualizar localStorage
    localStorage.setItem("theme", theme);
};

export function useTheme() {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.preferencia.tema);

    useEffect(() => {
        const mediaquery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            applyThemeToDOM(theme);
        };

        applyTheme();

        mediaquery.addEventListener("change", applyTheme);

        return () => {
            mediaquery.removeEventListener("change", applyTheme);
        }
    }, [theme]);

    const changeTheme = (newTheme) => {
        // Actualizar Redux
        dispatch(setTema(newTheme));
        // Guardar en backend
        dispatch(guardarTema(newTheme));
    };

    return {
        theme,
        setTheme: changeTheme,
        themeKeys
    };
}

// Exportar función para uso externo
export { applyThemeToDOM };