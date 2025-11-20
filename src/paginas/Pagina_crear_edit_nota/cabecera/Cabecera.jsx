import React, { forwardRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiChevronLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { setIsTituloFocused } from "../../../store/tareasSlice";

import AgregarEstado from "../../../componentes/agregar_estado/AgregarEstado";

const Cabecera = forwardRef(({ handleTituloChange, handleTituloKeyDown,
    esModoVistaPrevia }, tituloRef) => {

    const dispatch = useDispatch();
    const { isTituloFocused } = useSelector((state) => state.tareas);
    
    // ✅ Estado local para controlar si tiene contenido (más reactivo)
    const [tieneTitulo, setTieneTitulo] = useState(false);

    // ✅ Efecto para verificar si el ref tiene contenido al montar y cuando cambia
    useEffect(() => {
        const verificarContenido = () => {
            if (tituloRef?.current) {
                const contenido = tituloRef.current.innerText?.trim() || "";
                setTieneTitulo(contenido !== "");
            }
        };

        // Verificar inmediatamente
        verificarContenido();

        // Verificar periódicamente (para capturar cambios en el ref)
        const interval = setInterval(verificarContenido, 100);

        return () => clearInterval(interval);
    }, [tituloRef]);

    const handleFocus = () => {
        if (!esModoVistaPrevia) {
            dispatch(setIsTituloFocused(true));
        }
    };

    const handleBlur = async () => {
        if (!esModoVistaPrevia) {
            dispatch(setIsTituloFocused(false));
            // Verificar contenido al perder el foco
            if (tituloRef?.current) {
                const contenido = tituloRef.current.innerText?.trim() || "";
                setTieneTitulo(contenido !== "");
            }
        }
    };

    const handleInputLocal = () => {
        handleTituloChange(tituloRef);
        // Actualizar inmediatamente el estado de tieneTitulo
        if (tituloRef?.current) {
            const contenido = tituloRef.current.innerText?.trim() || "";
            setTieneTitulo(contenido !== "");
        }
    };

    // ✅ Manejador para forzar texto plano al pegar
    const handlePaste = (e) => {
        if (esModoVistaPrevia) return;
        
        e.preventDefault();
        
        // Obtener solo texto plano del portapapeles
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        
        // Remover saltos de línea para el título (convertir a espacios)
        const textoLimpio = text.replace(/\r?\n|\r/g, ' ');
        
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
                            className="text-base md:text-xl text-black dark:text-white
                                        outline-none border-none bg-transparent
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
                            <div className="absolute top-2 left-2 pointer-events-none
                                    text-base md:text-xl text-gray-500 dark:text-gray-400">
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