import React, { forwardRef, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsNotaFocused, setEstadoAutomatico } from "../../store/tareasSlice";
import { AnimatePresence } from "framer-motion";

import Tarea from "../tarea/Tarea";
import ModalTarea from "../modal/ModalTarea";

const CuerpoEdicion = forwardRef(({ handleNotaChange, handleNotaKeyDown, esModoVistaPrevia }, notaRef) => {

    const dispatch = useDispatch();
    const { isNotaFocused, nota, tareas } = useSelector((state) => state.tareas);
    const verModalTarea = useSelector((state) => state.tareas.verModalTarea);

    // ✅ Determinar si tiene nota directamente desde Redux
    const tieneNota = nota && nota.trim() !== "";
    const isProcessingRef = useRef(false); // ✅ Prevenir loops infinitos

    // Efecto para actualizar el estado automáticamente cuando cambien las tareas
    useEffect(() => {
        dispatch(setEstadoAutomatico());
    }, [tareas, dispatch]);

    // ✅ Callback ref para inicializar el contenido inmediatamente cuando el ref se crea
    const setRefWithContent = useCallback((element) => {
        if (element) {
            // Asignar el ref
            if (typeof notaRef === 'function') {
                notaRef(element);
            } else if (notaRef) {
                notaRef.current = element;
            }

            // ✅ Establecer contenido inmediatamente si estamos en modo vista previa
            if (esModoVistaPrevia && nota && element.innerText !== nota) {
                element.innerText = nota;
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
        // ✅ Prevenir llamadas simultáneas
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            if (notaRef.current) {
                // ✅ Obtener el texto limpio
                let contenido = notaRef.current.innerText;
                
                // ✅ Si está vacío o solo tiene espacios/saltos de línea, limpiar completamente
                if (!contenido || contenido.trim() === '') {
                    notaRef.current.innerText = '';
                    handleNotaChange(notaRef);
                    return;
                }
                
                // ✅ Limitar a 50000 caracteres
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
        const textoLimpio = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

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
                    <ModalTarea />
                )}
            </AnimatePresence>

            <div className="relative p-2">
                <div
                    ref={setRefWithContent}
                    contentEditable={!esModoVistaPrevia}
                    suppressContentEditableWarning={true}
                    onInput={handleInputLocal}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleNotaKeyDown(e, notaRef)}
                    onPaste={handlePaste}
                    className={`text-base md:text-xl text-black dark:text-white
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

                {!tieneNota && !isNotaFocused && (
                    <div className="absolute top-2 left-2 pointer-events-none
                                    text-base md:text-xl text-gray-500 dark:text-gray-400">
                        {esModoVistaPrevia ? 'Sin nota' : 'Colocar nota'}
                    </div>
                )}

                {tareas.map((tarea) => (
                    <Tarea
                        key={tarea.id}
                        tarea={tarea}
                        esModoVistaPrevia={esModoVistaPrevia}
                    />
                ))}
            </div>
        </div>
    );
});

CuerpoEdicion.displayName = 'CuerpoEdicion';

export default CuerpoEdicion;