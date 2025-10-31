import React, { forwardRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsNotaFocused, setEstadoAutomatico  } from "../../store/tareasSlice";

import Tarea from "../tarea/Tarea";
import ModalTarea from "../modal/ModalTarea";

const CuerpoEdicion = forwardRef(({ handleNotaChange, handleNotaKeyDown, esModoVistaPrevia }, notaRef) => {

    const dispatch = useDispatch();
    const { isNotaFocused } = useSelector((state) => state.tareas);
    const { tareas } = useSelector((state) => state.tareas);
    const verModalTarea = useSelector((state) => state.tareas.verModalTarea);

    // Efecto para actualizar el estado automáticamente cuando cambien las tareas
    useEffect(() => {
        dispatch(setEstadoAutomatico());
    }, [tareas, dispatch]);
    
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

    // Verificar si la nota tiene contenido directamente del ref
    const tieneNota = notaRef?.current?.textContent?.trim() !== "";

    return (
        <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 pb-3 flex-1">

            {verModalTarea && !esModoVistaPrevia && (
                <ModalTarea />
            )}

            <div className="relative p-2">
                <div
                    ref={notaRef}
                    contentEditable={!esModoVistaPrevia}
                    suppressContentEditableWarning={true}
                    onInput={() => handleNotaChange(notaRef)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleNotaKeyDown(e, notaRef)}
                    className={`text-base md:text-xl text-black dark:text-white
                                outline-none border-none bg-transparent
                                min-h-[1.5em] w-full
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