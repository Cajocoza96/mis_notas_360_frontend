import React, { useState } from "react";
import { HiShare, HiClipboard } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function CompartirContenido() {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [copiado, setCopiado] = useState(false);

    // Obtener datos de Redux
    const { anotacionActual } = useSelector((state) => state.anotaciones);
    const { tareas } = useSelector((state) => state.tareas);

    // Función para formatear el contenido completo
    const obtenerContenidoCompleto = () => {
        const titulo = anotacionActual?.titulo?.trim() || "Sin título";
        const nota = anotacionActual?.nota?.trim() || "Sin nota";
        
        let contenido = `${titulo}\n\n${nota}`;

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
                mostrarMensajeCopiado();
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
                    mostrarMensajeCopiado();
                } catch (err) {
                    console.error('Error al copiar:', err);
                    alert('No se pudo copiar al portapapeles');
                }
                
                document.body.removeChild(textarea);
            }
        } catch (err) {
            console.error('Error al copiar:', err);
            alert('No se pudo copiar al portapapeles');
        }
    };

    const mostrarMensajeCopiado = () => {
        setCopiado(true);
        setTimeout(() => {
            setCopiado(false);
            setMostrarMenu(false);
        }, 2000);
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
                    console.log('Error al compartir:', err);
                    // Si falla, intentar copiar al portapapeles como alternativa
                    copiarAlPortapapeles();
                }
            }
        } else {
            // Si no hay soporte para Web Share API, copiar al portapapeles
            copiarAlPortapapeles();
        }
    };

    // Función para compartir en WhatsApp
    const compartirWhatsApp = () => {
        const contenido = obtenerContenidoCompleto();
        const textoEncoded = encodeURIComponent(contenido);
        
        // Detectar si es mobile para usar la app o web
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const url = isMobile 
            ? `whatsapp://send?text=${textoEncoded}`
            : `https://web.whatsapp.com/send?text=${textoEncoded}`;
        
        window.open(url, '_blank');
        setMostrarMenu(false);
    };

    // Función para compartir en Facebook
    const compartirFacebook = () => {
        const contenido = obtenerContenidoCompleto();
        // Facebook no permite pre-llenar texto por políticas, pero podemos abrir el diálogo
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(contenido)}`;
        window.open(url, '_blank', 'width=600,height=400');
        setMostrarMenu(false);
    };

    // Función para compartir en Messenger
    const compartirMessenger = () => {
        const url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=600,height=400');
        setMostrarMenu(false);
    };

    // Función para compartir en Twitter/X
    const compartirTwitter = () => {
        const contenido = obtenerContenidoCompleto();
        const textoEncoded = encodeURIComponent(contenido.substring(0, 280)); // Límite de Twitter
        const url = `https://twitter.com/intent/tweet?text=${textoEncoded}`;
        window.open(url, '_blank', 'width=600,height=400');
        setMostrarMenu(false);
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
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 
                                    rounded-lg shadow-lg z-50 overflow-hidden
                                    border border-gray-200 dark:border-gray-600">
                        
                        {copiado && (
                            <div className="p-3 bg-green-100 dark:bg-green-800 text-center
                                            text-green-800 dark:text-green-100 text-sm font-medium">
                                ✓ Copiado al portapapeles
                            </div>
                        )}

                        {/* Opción: Compartir (Web Share API) */}
                        {navigator.share && (
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
                        <button
                            onClick={copiarAlPortapapeles}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 
                                        dark:hover:bg-gray-600 flex items-center gap-3
                                        text-black dark:text-white transition-colors">
                            <HiClipboard className="text-xl" />
                            <span className="text-base">Copiar texto</span>
                        </button>

                        <div className="h-px bg-gray-200 dark:bg-gray-600 mx-2" />

                        {/* Opción: WhatsApp */}
                        <button
                            onClick={compartirWhatsApp}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 
                                        dark:hover:bg-gray-600 flex items-center gap-3
                                        text-black dark:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span className="text-base">WhatsApp</span>
                        </button>

                        {/* Opción: Facebook */}
                        <button
                            onClick={compartirFacebook}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 
                                        dark:hover:bg-gray-600 flex items-center gap-3
                                        text-black dark:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span className="text-base">Facebook</span>
                        </button>

                        {/* Opción: Twitter/X */}
                        <button
                            onClick={compartirTwitter}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 
                                        dark:hover:bg-gray-600 flex items-center gap-3
                                        text-black dark:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span className="text-base">Twitter / X</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}