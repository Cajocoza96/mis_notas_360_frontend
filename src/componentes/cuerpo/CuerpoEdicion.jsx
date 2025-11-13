import React, { forwardRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsNotaFocused, setEstadoAutomatico  } from "../../store/tareasSlice";

import Tarea from "../tarea/Tarea";
import ModalTarea from "../modal/ModalTarea";

const CuerpoEdicion = forwardRef(({ handleNotaChange, handleNotaKeyDown, esModoVistaPrevia }, notaRef) => {

    const dispatch = useDispatch();
    const { isNotaFocused } = useSelector((state) => state.tareas);
    const { tareas } = useSelector((state) => state.tareas);
    const verModalTarea = useSelector((state) => state.tareas.verModalTarea);

    // ✅ Estado local para controlar si tiene contenido (más reactivo)
    const [tieneNota, setTieneNota] = useState(false);

    // Efecto para actualizar el estado automáticamente cuando cambien las tareas
    useEffect(() => {
        dispatch(setEstadoAutomatico());
    }, [tareas, dispatch]);

    // ✅ Efecto para verificar si el ref tiene contenido al montar y cuando cambia
    useEffect(() => {
        const verificarContenido = () => {
            if (notaRef?.current) {
                const contenido = notaRef.current.textContent?.trim() || "";
                setTieneNota(contenido !== "");
            }
        };

        // Verificar inmediatamente
        verificarContenido();

        // Verificar periódicamente (para capturar cambios en el ref)
        const interval = setInterval(verificarContenido, 100);

        return () => clearInterval(interval);
    }, [notaRef]);
    
    const handleFocus = () => {
        if (!esModoVistaPrevia) {
            dispatch(setIsNotaFocused(true));
        }
    };

    const handleBlur = async () => {
        if (!esModoVistaPrevia) {
            dispatch(setIsNotaFocused(false));
            // Verificar contenido al perder el foco
            if (notaRef?.current) {
                const contenido = notaRef.current.textContent?.trim() || "";
                setTieneNota(contenido !== "");
            }
        }
    };

    const handleInputLocal = () => {
        handleNotaChange(notaRef);
        // Actualizar inmediatamente el estado de tieneNota
        if (notaRef?.current) {
            const contenido = notaRef.current.textContent?.trim() || "";
            setTieneNota(contenido !== "");
        }
    };

    return (
        <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 flex-1">

            {verModalTarea && !esModoVistaPrevia && (
                <ModalTarea />
            )}

            <div className="relative p-2">
                <div
                    ref={notaRef}
                    contentEditable={!esModoVistaPrevia}
                    suppressContentEditableWarning={true}
                    onInput={handleInputLocal}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleNotaKeyDown(e, notaRef)}
                    className={`text-base md:text-xl text-black dark:text-white
                                outline-none border-none bg-transparent
                                min-h-[1.5em] w-full overflow-hidden
                                whitespace-pre-wrap
                                ${esModoVistaPrevia ? 'cursor-default' : ''}`}
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        lineHeight: '1.5'
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