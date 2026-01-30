import React, { forwardRef, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsNotaFocused, setEstadoAutomatico } from "../../store/tareasSlice";
import { AnimatePresence } from "framer-motion";

import Tarea from "../tarea/Tarea";
import ModalTarea from "../modal/ModalTarea";

import useConexionInternet from "../../hooks/useConexionInternet";

const CuerpoEdicion = forwardRef(({ handleNotaChange, handleNotaKeyDown,
    esModoVistaPrevia, addToHistoryImmediate,
    tituloRef }, notaRef) => {

    const dispatch = useDispatch();
    const { isNotaFocused, nota, tareas } = useSelector((state) => state.tareas);
    const verModalTarea = useSelector((state) => state.tareas.verModalTarea);

    const tieneNota = nota && nota.trim() !== "";
    const isProcessingRef = useRef(false);

    const { isOnline, justReconnected } = useConexionInternet();

    useEffect(() => {
        dispatch(setEstadoAutomatico());
    }, [tareas, dispatch]);

    //  Función helper para normalizar solo formato de saltos de línea
    const normalizarTexto = (texto) => {
        if (!texto) return '';
        // Solo normalizar diferentes formatos de saltos de línea a \n
        return texto
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n');
    };

    //  Sincronizar el ref cuando Redux cambia desde fuera (al cargar desde BD)
    useEffect(() => {
        if (notaRef.current && nota !== undefined && nota !== null) {
            const notaActual = notaRef.current.innerText || "";
            const notaNormalizada = normalizarTexto(nota);

            // Solo actualizar si el contenido es diferente
            if (notaActual !== notaNormalizada) {
                notaRef.current.innerText = notaNormalizada;
            }
        }
    }, [nota, notaRef]);

    //  Callback ref para inicializar el contenido
    const setRefWithContent = useCallback((element) => {
        if (element) {
            if (typeof notaRef === 'function') {
                notaRef(element);
            } else if (notaRef) {
                notaRef.current = element;
            }

            if (esModoVistaPrevia && nota) {
                const notaNormalizada = normalizarTexto(nota);
                if (element.innerText !== notaNormalizada) {
                    element.innerText = notaNormalizada;
                }
            }
        }
    }, [notaRef, esModoVistaPrevia, nota]);

    const handleFocus = () => {
        if (!esModoVistaPrevia) {
            dispatch(setIsNotaFocused(true));
        }
    };

    const handleBlur = async () => {
        if (!esModoVistaPrevia) {
            dispatch(setIsNotaFocused(false));
        }
    };

    const handleInputLocal = () => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            if (notaRef.current) {
                let contenido = notaRef.current.innerText;

                // Si está vacío o solo tiene espacios/saltos de línea, limpiar completamente
                if (!contenido || contenido.trim() === '') {
                    notaRef.current.innerText = '';
                    handleNotaChange(notaRef);
                    return;
                }

                // Limitar a 50000 caracteres
                if (contenido.length > 50000) {
                    const textoLimitado = contenido.substring(0, 50000);
                    notaRef.current.innerText = textoLimitado;

                    // Restaurar el cursor al final
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(notaRef.current);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

            handleNotaChange(notaRef);
        } finally {
            setTimeout(() => {
                isProcessingRef.current = false;
            }, 10);
        }
    };

    //  Manejador para forzar texto plano al pegar
    const handlePaste = (e) => {
        if (esModoVistaPrevia) return;

        e.preventDefault();

        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        const textoLimpio = normalizarTexto(text);

        const contenidoActual = notaRef.current?.innerText || "";
        const selection = window.getSelection();

        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const textoBorrado = range.toString().length;

            const espacioDisponible = 50000 - (contenidoActual.length - textoBorrado);
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
        <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 flex-1">

            <AnimatePresence>
                {verModalTarea && !esModoVistaPrevia && (
                    <ModalTarea
                        addToHistoryImmediate={addToHistoryImmediate}
                        tituloRef={tituloRef}
                        notaRef={notaRef}
                    />
                )}
            </AnimatePresence>

            <div className="relative p-2">
                {/*En este div editable es donde se ve la nota*/}
                <div
                    ref={setRefWithContent}
                    contentEditable={!esModoVistaPrevia}
                    suppressContentEditableWarning={true}
                    data-campo="nota"
                    onInput={handleInputLocal}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleNotaKeyDown(e, notaRef)}
                    onPaste={handlePaste}
                    className={`text-base md:text-lg text-black dark:text-white
                                outline-none border-none bg-transparent
                                min-h-[1.5em] w-full overflow-hidden
                                whitespace-pre-wrap
                                ${esModoVistaPrevia ? 'cursor-default' : ''}`}
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap'
                    }}
                />

                {esModoVistaPrevia && !tieneNota && !isNotaFocused && (
                    <div className="absolute top-2 left-2 pointer-events-none
                                    text-base md:text-lg text-gray-500 dark:text-gray-400">
                        Sin nota
                    </div>
                )}

                {!esModoVistaPrevia && !tieneNota && !isNotaFocused && (
                    <div className="absolute top-2 left-2 pointer-events-none
                                    text-base md:text-lg text-gray-500 dark:text-gray-400">
                        Colocar nota
                    </div>
                )}

                {/*Aqui es donde se mapean las tareas */}
                {tareas.map((tarea) => (
                    <Tarea
                        key={tarea.id}
                        tarea={tarea}
                        esModoVistaPrevia={esModoVistaPrevia}
                        addToHistoryImmediate={addToHistoryImmediate}
                        tituloRef={tituloRef}
                        notaRef={notaRef}
                    />
                ))}
            </div>
        </div>
    );
});

CuerpoEdicion.displayName = 'CuerpoEdicion';

export default CuerpoEdicion;