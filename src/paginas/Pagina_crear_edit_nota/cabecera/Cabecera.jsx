import React, { forwardRef, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiChevronLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { setIsTituloFocused } from "../../../store/tareasSlice";

import AgregarEstado from "../../../componentes/agregar_estado/AgregarEstado";

const Cabecera = forwardRef(({ handleTituloChange, handleTituloKeyDown,
    esModoVistaPrevia }, tituloRef) => {

    const dispatch = useDispatch();
    const { isTituloFocused, titulo } = useSelector((state) => state.tareas);

    // ✅ Usar el estado de Redux en lugar de verificar el ref
    const [tieneTitulo, setTieneTitulo] = useState(false);

    const isProcessingRef = useRef(false); // ✅ Prevenir loops infinitos

    // ✅ Sincronizar con el estado de Redux (más confiable que verificar el ref)
    useEffect(() => {
        const contenido = titulo?.trim() || "";
        setTieneTitulo(contenido !== "");
    }, [titulo]);

    const handleFocus = () => {
        if (!esModoVistaPrevia) {
            dispatch(setIsTituloFocused(true));
        }
    };

    const handleBlur = async () => {
        if (!esModoVistaPrevia) {
            dispatch(setIsTituloFocused(false));
        }
    };

    const handleInputLocal = () => {
        // ✅ Prevenir llamadas simultáneas
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            if (tituloRef.current) {
                // ✅ Obtener el texto limpio (sin \n ni espacios extra)
                let contenido = tituloRef.current.innerText;

                // ✅ Si está vacío o solo tiene espacios/saltos de línea, limpiar completamente
                if (!contenido || contenido.trim() === '') {
                    tituloRef.current.innerText = '';
                    handleTituloChange(tituloRef);
                    return;
                }

                // ✅ Limitar a 255 caracteres
                if (contenido.length > 255) {
                    const textoLimitado = contenido.substring(0, 255);
                    tituloRef.current.innerText = textoLimitado;

                    // Restaurar el cursor al final
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(tituloRef.current);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

            handleTituloChange(tituloRef);
        } finally {
            // ✅ Liberar el lock después de un pequeño delay
            setTimeout(() => {
                isProcessingRef.current = false;
            }, 10);
        }
    };

    // ✅ Manejador para forzar texto plano al pegar
    const handlePaste = (e) => {
        if (esModoVistaPrevia) return;

        e.preventDefault();

        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        const textoLimpio = text.replace(/\r?\n|\r/g, ' ');

        const contenidoActual = tituloRef.current?.innerText || "";
        const selection = window.getSelection();

        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const textoBorrado = range.toString().length;

            const espacioDisponible = 255 - (contenidoActual.length - textoBorrado);
            const textoAPegar = textoLimpio.substring(0, Math.max(0, espacioDisponible));

            if (textoAPegar.length > 0) {
                selection.deleteFromDocument();
                selection.getRangeAt(0).insertNode(document.createTextNode(textoAPegar));
                selection.collapseToEnd();
            }
        }

        handleInputLocal();
    };

    return (
        <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">

            <div className="w-full flex flex-col gap-2 items-center py-2 ">

                <div className="w-[95%] flex flex-row justify-between">
                    <Link
                        to="/panel-principal">
                        <HiChevronLeft className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                    </Link>

                    <AgregarEstado />
                </div>

                <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden h-11 lg:h-14 min-w-0">
                    <div className="relative p-2">
                        <div
                            ref={tituloRef}
                            contentEditable={!esModoVistaPrevia}
                            suppressContentEditableWarning={true}
                            onInput={handleInputLocal}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={(e) => handleTituloKeyDown(e, tituloRef)}
                            onPaste={handlePaste}
                            className="text-base md:text-lg text-black dark:text-white
                                        outline-none border-none bg-transparent font-semibold
                                        min-h-[1.5em] w-full overflow-hidden
                                        whitespace-pre-wrap"
                            style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap'
                            }}
                        />

                        {!tieneTitulo && !isTituloFocused && (
                            <div className="absolute top-2 left-2 pointer-events-none font-semibold
                                    text-base md:text-lg text-gray-500 dark:text-gray-400">
                                {esModoVistaPrevia ? 'Sin título' : 'Colocar título'}
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
});

Cabecera.displayName = 'Cabecera';

export default Cabecera;