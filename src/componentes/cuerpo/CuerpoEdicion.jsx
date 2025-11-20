import React, { forwardRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsNotaFocused, setEstadoAutomatico  } from "../../store/tareasSlice";

import Tarea from "../tarea/Tarea";
import ModalTarea from "../modal/ModalTarea";

const CuerpoEdicion = forwardRef(({ handleNotaChange, handleNotaKeyDown, esModoVistaPrevia }, notaRef) => {

    const dispatch = useDispatch();
    const { isNotaFocused, nota, tareas } = useSelector((state) => state.tareas);
    const verModalTarea = useSelector((state) => state.tareas.verModalTarea);

    // ✅ Determinar si tiene nota directamente desde Redux
    const tieneNota = nota && nota.trim() !== "";

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
        handleNotaChange(notaRef);
    };

    // ✅ Manejador para forzar texto plano al pegar
    const handlePaste = (e) => {
        if (esModoVistaPrevia) return;
        
        e.preventDefault();
        
        // Obtener solo texto plano del portapapeles
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        
        // Mantener saltos de línea en la nota
        // Solo normalizamos los diferentes tipos de saltos de línea
        const textoLimpio = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Insertar el texto sin formato en la posición del cursor
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(textoLimpio));
        
        // Colapsar la selección al final del texto insertado
        selection.collapseToEnd();
        
        // Trigger del onChange para actualizar el estado
        handleInputLocal();
    };

    return (
        <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 flex-1">

            {verModalTarea && !esModoVistaPrevia && (
                <ModalTarea />
            )}

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