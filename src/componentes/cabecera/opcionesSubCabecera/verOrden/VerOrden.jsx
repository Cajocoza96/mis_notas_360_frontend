import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { toggleVerOpcionesCabecera } from "../../../../store/layoutSlice";

import { toggleVerOrden, guardarOrdenAnotaciones } from "../../../../store/preferenciaSlice";

import SubOpcionesCabecera from "../SubOpcionesCabecera";

import { setAnotaciones } from "../../../../store/anotacionesSlice";

import { obtenerAnotaciones } from "../../../../services/anotacionesService";

import { HiCheckCircle } from "react-icons/hi";

export default function VerOrden() {

    const dispatch = useDispatch();

    const ordenAnotaciones = useSelector((state) => state.preferencia.ordenAnotaciones);

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const [cargando, setCargando] = useState(false);

    const [error, setError] = useState(null);

    //Cargar todas las anotaciones
    const cargarAnotaciones = async () => {
        try {
            setCargando(true);
            const anotacionesData = await obtenerAnotaciones();
            dispatch(setAnotaciones(anotacionesData));
            setCargando(false);
        } catch (error) {
            setError('Error al cargar las anotaciones eliminadas');
            setCargando(false);
        } finally {
            setCargando(false);
        }
    }

    const handleCambiarOrden = async (nuevoOrden) => {
        if (ordenAnotaciones !== nuevoOrden) {
            // Guardar en BD y Redux
            await dispatch(guardarOrdenAnotaciones(nuevoOrden));
            // Recargar las anotaciones con el nuevo orden

            // Cerrar menú
            requestAnimationFrame(() => {
                if (verOpcionesCabecera) {
                    dispatch(toggleVerOpcionesCabecera());
                }
            });

            await cargarAnotaciones();
        }
    };

    return (
        <>
            <div className="w-full p-1 border-b border-gray-400 select-none
                                                text-black dark:text-white
                                                bg-white dark:bg-gray-800 cursor-pointer">
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Ordenar por"
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                                    text-black dark:text-white 
                                                    bg-gray-300 dark:bg-gray-700 cursor-pointer"
                onClick={() => handleCambiarOrden('vis_prev_nota_acs')}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Vista previa nota (Asc)"
                    circulo={ordenAnotaciones === 'vis_prev_nota_acs' && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-violet-800 dark:text-violet-500" />
                    )}
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                                    text-black dark:text-white 
                                                    bg-gray-300 dark:bg-gray-700 cursor-pointer"
                onClick={() => handleCambiarOrden('vis_prev_nota_desc')}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Vista previa nota (Desc)"
                    circulo={ordenAnotaciones === 'vis_prev_nota_desc' && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-violet-800 dark:text-violet-500" />
                    )}
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                                    text-black dark:text-white 
                                                    bg-gray-300 dark:bg-gray-700 cursor-pointer"
                onClick={() => handleCambiarOrden('fecha_creacion')}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Fecha de creación"
                    circulo={ordenAnotaciones === 'fecha_creacion' && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-violet-800 dark:text-violet-500" />
                    )}
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                                    text-black dark:text-white 
                                                    bg-gray-300 dark:bg-gray-700 cursor-pointer"
                onClick={() => handleCambiarOrden('fecha_modificacion')}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Fecha de modificación"
                    circulo={ordenAnotaciones === 'fecha_modificacion' && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-violet-800 dark:text-violet-500" />
                    )}
                />
            </div>

        </>
    );
}