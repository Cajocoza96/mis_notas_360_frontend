import React, { useState } from "react";

import {
    HiMinusCircle, HiClock, HiCheckCircle,
    HiDotsVertical, HiOutlineRefresh, HiXCircle,
} from "react-icons/hi";

import { HiOutlineStar, HiStar } from "react-icons/hi2";

import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { actualizarFavoritoLocal, 
        setAnotaciones, toggleVerAdminAnotacion} from "../../../../store/anotacionesSlice";

import { actualizarFavorito, obtenerAnotaciones } from "../../../../services/anotacionesService";

import { setAnotacionId, toggleVerModalRestaurarNota, toggleVerModalEliminarNotaDefinitiva } from "../../../../store/tareasSlice";

export default function NotaVistaPrevia({ anotacionId, iconoFavorito, texto, no_asignado,
    pendiente, finalizado, esFavorito = false, iconoAdministrar, iconoRestaurarEliminarDefinitivo }) {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const location = useLocation();

    const esVistaPapelera = location.pathname.includes('/papelera');

    const [cargando, setCargando] = useState(false);

    const [error, setError] = useState(null);

    // ✅ Obtener el estado de verSoloFavoritos
    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);

    const [actualizandoFavorito, setActualizandoFavorito] = useState(false);

    const handleVerAdminAnotacion = () => {
        dispatch(setAnotacionId(anotacionId));
        dispatch(toggleVerAdminAnotacion());
    }

    const handleVerVistaPrevia = (e) => {
        if (esVistaPapelera) {
            e.stopPropagation();

        } else {
            navigate(`/vista-previa/nota/${anotacionId}`);
        }
    }

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

    const handleToggleFavorito = async (e) => {
        e.stopPropagation();

        if (actualizandoFavorito) return;

        try {
            setActualizandoFavorito(true);

            const nuevoEstadoFavorito = !esFavorito;  // ✅ Cambiar a boolean

            // Actualizar en el backend PRIMERO
            await actualizarFavorito(anotacionId, nuevoEstadoFavorito);

            // Luego actualizar localmente
            dispatch(actualizarFavoritoLocal({
                anotacionId,
                favorito: nuevoEstadoFavorito
            }));

            // Solo recargar si estamos filtrando por favoritos
            if (verSoloFavoritos || !verSoloFavoritos) {
                cargarAnotaciones();
            }

        } catch (error) {
            console.error('Error al actualizar favorito:', error);
            cargarAnotaciones();

        } finally {
            setActualizandoFavorito(false);
        }
    };

    const handleVerModalRestaurarNota = () => {
        //Guardar el ID de la anotacion en Redux antes de abrir el modal
        dispatch(setAnotacionId(anotacionId));

        dispatch(toggleVerModalRestaurarNota());
    }

    const handleVerModalEliminarNotaDefinitiva = () => {
        //Guardar el ID de la anotacion en Redux antes de abrir el modal
        dispatch(setAnotacionId(anotacionId));

        dispatch(toggleVerModalEliminarNotaDefinitiva());
    }


    return (
        /*
        <div className="w-[98%] bg-gray-200/90 p-2 mt-2 rounded-md select-none
                        flex flex-col items-center justify-center">
        */

        <div className={`w-[98%] h-35 mt-2 p-2 rounded-md select-none
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

                {iconoAdministrar && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            handleVerAdminAnotacion()
                        }}
                        className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer">
                        <HiDotsVertical />
                    </div>
                )}

                {iconoRestaurarEliminarDefinitivo && (
                    <div className="flex flex-row items-center gap-6">
                        <HiOutlineRefresh
                            onClick={handleVerModalRestaurarNota}
                            title="Restaurar nota"
                            className="text-2xl md:text-3xl cursor-pointer
                                        text-black dark:text-white"/>
                        <HiXCircle
                            onClick={handleVerModalEliminarNotaDefinitiva}
                            title="Eliminar nota"
                            className="text-2xl md:text-3xl cursor-pointer
                                text-red-600"/>
                    </div>
                )}
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