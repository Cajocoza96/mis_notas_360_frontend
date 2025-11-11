import React, { useState } from "react";

import { HiMinusCircle, HiClock, HiCheckCircle, HiDotsVertical } from "react-icons/hi";

import { HiOutlineStar, HiStar } from "react-icons/hi2";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { actualizarFavoritoLocal, cargarAnotaciones  } from "../../../../store/anotacionesSlice";

import { toggleVerAdminAnotacion } from "../../../../store/anotacionesSlice";

import { actualizarFavorito } from "../../../../services/anotacionesService";

import { setAnotacionId } from "../../../../store/tareasSlice";

export default function NotaVistaPrevia({ anotacionId, iconoFavorito, texto, no_asignado,
    pendiente, finalizado, esFavorito = false }) {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    // ✅ Obtener el estado de verSoloFavoritos
    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);

    const [actualizandoFavorito, setActualizandoFavorito] = useState(false);

    const handleVerAdminAnotacion = () => {
        dispatch(setAnotacionId(anotacionId));
        dispatch(toggleVerAdminAnotacion());
    }

    const handleVerVistaPrevia = () => {
        navigate(`/vista-previa/nota/${anotacionId}`);
    }

    const handleToggleFavorito = async (e) => {
        e.stopPropagation(); // Evitar que se abra la vista previa

        if (actualizandoFavorito) return; // Evitar múltiples clics

        try {
            setActualizandoFavorito(true);

            const nuevoEstadoFavorito = esFavorito ? 0 : 1;

            // Actualizar localmente de inmediato (optimistic update)
            dispatch(actualizarFavoritoLocal({
                anotacionId,
                favorito: nuevoEstadoFavorito
            }));

            // Actualizar en el backend
            await actualizarFavorito(anotacionId, nuevoEstadoFavorito);

            // ✅ Si estamos viendo solo favoritos, recargar para actualizar la vista
            if (verSoloFavoritos || !verSoloFavoritos) {
                dispatch(cargarAnotaciones());
            }

        } catch (error) {
            console.error('Error al actualizar favorito:', error);
            // Revertir el cambio local si falla

            dispatch(actualizarFavoritoLocal({
                anotacionId,
                favorito: esFavorito ? 1 : 0
            }));

            // ✅ Si estamos viendo solo favoritos, recargar para mantener consistencia
            if (verSoloFavoritos ) {
                dispatch(cargarAnotaciones());
            }
        } finally {
            setActualizandoFavorito(false);
        }
    };

    return (
        /*
        <div className="w-[98%] bg-gray-200/90 p-2 mt-2 rounded-md select-none
                        flex flex-col items-center justify-center">
        */

        <div className={`w-[98%] h-auto mt-2 p-2 rounded-md select-none
                        flex flex-col items-center gap-1 overflow-hidden
                        hover:opacity-80 transition-opacity
                        ${no_asignado ? 'bg-blue-200 dark:bg-blue-950' :
                        pendiente ? 'bg-yellow-200 dark:bg-yellow-950' :
                        finalizado ? 'bg-green-200 dark:bg-green-950' : 'bg-gray-200 dark:bg-black'}`}
            onClick={handleVerVistaPrevia}>

            <div className="w-full flex flex-row items-start justify-between">

                {iconoFavorito && (
                    <div
                        onClick={handleToggleFavorito}
                        className={`text-2xl md:text-3xl cursor-pointer
                            text-violet-800 dark:text-white
                            transition-transform hover:scale-110
                            ${actualizandoFavorito ? 'opacity-50 pointer-events-none' : ''}`}>
                        {esFavorito ? <HiStar /> : <HiOutlineStar />}
                    </div>
                )}

                <div className="text-2xl md:text-3xl">

                    {no_asignado && (
                        <HiMinusCircle className="text-blue-700" />
                    )}

                    {pendiente && (
                        <HiClock className="text-yellow-700" />
                    )}

                    {finalizado && (
                        <HiCheckCircle className="text-green-700" />
                    )}

                </div>
                
                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                        handleVerAdminAnotacion()
                    }}
                    className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer">
                    <HiDotsVertical />
                </div>
            </div>

            <div className="w-full h-25 text-center overflow-hidden 
                            flex flex-col items-center justify-center">
                <p className="text-base md:text-xl line-clamp-3 w-full px-1
                            text-black dark:text-white">
                    {texto}
                </p>
            </div>
        </div>

        /*
        </div>
        */
    );
}