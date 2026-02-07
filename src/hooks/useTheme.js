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

    // Actualiza el theme-color del navegador
    const themeColor = isDark ? "#1f2937" : "#ffffff"; // gray-800 : white
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeColor);

    // Fuerza el background en html para evitar el fondo blanco
    root.style.backgroundColor = themeColor;

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