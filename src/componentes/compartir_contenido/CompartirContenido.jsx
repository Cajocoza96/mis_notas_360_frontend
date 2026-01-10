import React, { useState } from "react";
import { HiShare, HiClipboard } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { logDesarrollo, errorDesarrollo, registrarError } from "../../utils/errorHandler";
import { setVerToast, setMensajeToast } from "../../store/accesoSlice";

export default function CompartirContenido() {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [copiado, setCopiado] = useState(false);

    // Obtener datos de Redux
    const { anotacionActual } = useSelector((state) => state.anotaciones);
    const { tareas } = useSelector((state) => state.tareas);

    const dispatch = useDispatch();

    const mostrarToast = (mensaje) => {
        dispatch(setMensajeToast(mensaje));
        dispatch(setVerToast(true));

        setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    // Función para formatear el contenido completo
    const obtenerContenidoCompleto = () => {
        const titulo = anotacionActual?.titulo?.trim() || "Sin título";
        const nota = anotacionActual?.nota?.trim() || "Sin nota";

        let contenido = `Título:\n${titulo}\n\nNota:\n${nota}`;

        // Agregar tareas si existen
        if (tareas && tareas.length > 0) {
            contenido += "\n\nTareas:\n";
            tareas.forEach((tarea, index) => {
                const estado = tarea.completada ? "✓" : "○";
                contenido += `${estado} ${tarea.texto}\n`;
            });
        }

        return contenido.trim();
    };

    // Función para copiar al portapapeles
    const copiarAlPortapapeles = async () => {
        const contenido = obtenerContenidoCompleto();

        try {
            // Intentar usar la API moderna de Clipboard
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(contenido);
                setMostrarMenu(false);
                mostrarToast('Copiado');
            } else {
                // Fallback para navegadores antiguos o contextos no seguros
                const textarea = document.createElement("textarea");
                textarea.value = contenido;
                textarea.style.position = "fixed";
                textarea.style.left = "-999999px";
                textarea.style.top = "-999999px";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();

                try {
                    document.execCommand('copy');
                    setMostrarMenu(false);
                    mostrarToast('Copiado');
                } catch (err) {
                    errorDesarrollo('Error al copiar:', err);
                    setMostrarMenu(false);
                    mostrarToast('No se pudo copiar');
                }

                document.body.removeChild(textarea);
            }
        } catch (err) {
            errorDesarrollo('Error al copiar:', err);
            mostrarToast('No se pudo copiar');
        }
    };

    // Función para compartir nativamente (Web Share API)
    const compartirNativo = async () => {
        const contenido = obtenerContenidoCompleto();
        const titulo = anotacionActual?.titulo?.trim() || "Sin título";

        if (navigator.share) {
            try {
                await navigator.share({
                    title: titulo,
                    text: contenido
                });
                setMostrarMenu(false);
            } catch (err) {
                // Usuario canceló o error
                if (err.name !== 'AbortError') {
                    logDesarrollo('Error al compartir:', err);
                    // Si falla, intentar copiar al portapapeles como alternativa
                    copiarAlPortapapeles();
                }
            }
        } else {
            // Si no hay soporte para Web Share API, copiar al portapapeles
            copiarAlPortapapeles();
        }
    };

    const handleClick = () => {
        setMostrarMenu(!mostrarMenu);
    };

    return (
        <div className="relative">
            {/* Botón principal */}
            <div
                onClick={handleClick}
                className="p-1 active:bg-gray-300 dark:active:bg-gray-600
                            rounded-sm cursor-pointer">
                <HiShare className="text-2xl md:text-3xl text-violet-800 dark:text-white" />
            </div>

            {/* Menú de opciones */}
            {mostrarMenu && (
                <>
                    {/* Overlay para cerrar al hacer clic fuera */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMostrarMenu(false)}
                    />

                    {/* Menú desplegable */}
                    <div className="fixed right-0 w-64 
                                    bg-white dark:bg-gray-700 
                                    rounded-lg shadow-lg z-50 overflow-hidden
                                    border border-gray-200 dark:border-gray-600">

                        {/* Opción: Compartir (Web Share API) */}
                        {navigator.share && !copiado && (
                            <button
                                onClick={compartirNativo}
                                className="w-full px-4 py-3 text-left hover:bg-gray-100 
                                            dark:hover:bg-gray-600 flex items-center gap-3
                                            text-black dark:text-white transition-colors">
                                <HiShare className="text-xl" />
                                <span className="text-base">Compartir...</span>
                            </button>
                        )}


                        {/* Opción: Copiar al portapapeles */}
                        {!copiado && (
                            <button
                                onClick={copiarAlPortapapeles}
                                className="w-full px-4 py-3 text-left hover:bg-gray-100 
                                        dark:hover:bg-gray-600 flex items-center gap-3
                                        text-black dark:text-white transition-colors">
                                <HiClipboard className="text-xl" />
                                <span className="text-base">Copiar texto</span>
                            </button>
                        )}

                    </div>
                </>
            )}
        </div>
    );
}