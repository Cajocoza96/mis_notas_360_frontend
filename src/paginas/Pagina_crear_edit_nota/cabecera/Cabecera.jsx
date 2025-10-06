import React, { forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiChevronLeft, HiPlusCircle, HiRefresh } from "react-icons/hi";
import { Link } from "react-router-dom";
import { setIsTituloFocused, toggleVerModalEstado } from "../../../store/layoutSlice";

const Cabecera = forwardRef(({ handleTituloChange, handleTituloKeyDown }, tituloRef) => {
    const dispatch = useDispatch();
    const { isTituloFocused, titulo, estadoSeleccionado } = useSelector((state) => state.layout);

    const handleFocus = () => {
        dispatch(setIsTituloFocused(true));
    };

    const handleBlur = () => {
        dispatch(setIsTituloFocused(false));
    };

    const handleVerModalEstado = () => {
        dispatch(toggleVerModalEstado())
    }

    const obtenerTextoEstado = () => {
        switch (estadoSeleccionado) {
            case "noAsignado":
                return "No asignado";
            case "pendiente":
                return "Pendiente";
            case "finalizado":
                return "Finalizado";
            default:
                return "Agregar estado";
        }
    }

    return (
        <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-row items-center p-2 justify-between">

                <div className="flex flex-row items-center gap-2 flex-1 mr-4">
                    <Link to="/panel-principal">
                        <HiChevronLeft className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                    </Link>

                    <div className="relative flex-1">
                        <div
                            ref={tituloRef}
                            contentEditable
                            suppressContentEditableWarning={true}
                            onInput={() => handleTituloChange(tituloRef)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={(e) => handleTituloKeyDown(e, tituloRef)}
                            className="text-base md:text-xl text-black dark:text-white
                                    outline-none border-none bg-transparent
                                    min-h-[1.5em] max-w-full overflow-hidden
                                    whitespace-nowrap text-ellipsis
                                    focus:whitespace-normal focus:text-ellipsis-none"
                            style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word'
                            }}
                        />
                        {!titulo && !isTituloFocused && (
                            <div className="absolute top-0 left-0 pointer-events-none
                                        text-base md:text-xl text-gray-500 dark:text-gray-400">
                                Título
                            </div>
                        )}
                    </div>
                </div>

                <div className="select-none cursor-pointer 
                                flex flex-row items-center gap-1 flex-shrink-0"
                    onClick={handleVerModalEstado}>

                    {estadoSeleccionado ? (
                        <>
                            <HiRefresh className="text-2xl md:text-3xl  text-blue-600" />
                            <p className="text-base md:text-xl text-black dark:text-white">
                                {obtenerTextoEstado()}
                            </p>
                        </>
                    ) : (
                        <>
                            <HiPlusCircle className="text-2xl md:text-3xl  text-blue-600" />
                            <p className="text-base md:text-xl text-black dark:text-white">
                                Agregar estado
                            </p>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
});

Cabecera.displayName = 'Cabecera';

export default Cabecera;