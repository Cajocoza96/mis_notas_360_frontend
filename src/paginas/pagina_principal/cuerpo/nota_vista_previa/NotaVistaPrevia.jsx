import React, { useState } from "react";

import {
    HiMinusCircle, HiClock, HiCheckCircle,
    HiDotsVertical, HiOutlineRefresh, HiXCircle,
} from "react-icons/hi";

import { FaRegCircle, FaCircle } from "react-icons/fa";

import { HiOutlineStar, HiStar } from "react-icons/hi2";

import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
    actualizarFavoritoLocal,
    setAnotaciones, toggleVerAdminAnotacion, toggleSeleccionAnotacion
} from "../../../../store/anotacionesSlice";

import { actualizarFavorito, obtenerAnotaciones } from "../../../../services/anotacionesService";

import { setAnotacionId, toggleVerModalRestaurarNota, toggleVerModalEliminarNotaDefinitiva } from "../../../../store/tareasSlice";

import { setVerToast, setMensajeToast } from "../../../../store/accesoSlice";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../../../utils/errorHandler";

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

    // ✅ Estados de selección
    const seleccionar = useSelector((state) => state.anotaciones.seleccionar);
    const anotacionesSeleccionadas = useSelector((state) => state.anotaciones.anotacionesSeleccionadas);
    const estaSeleccionada = anotacionesSeleccionadas.includes(anotacionId);

    // ✅ Manejar clic en el círculo de selección
    const handleToggleSeleccion = (e) => {
        e.stopPropagation();
        dispatch(toggleSeleccionAnotacion(anotacionId));
    }

    const handleVerAdminAnotacion = () => {
        dispatch(setAnotacionId(anotacionId));
        dispatch(toggleVerAdminAnotacion());
    }

    const handleVerVistaPrevia = (e) => {
        // ✅ Si está en modo selección, toggle la selección
        if (seleccionar && !esVistaPapelera) {
            e.stopPropagation();
            dispatch(toggleSeleccionAnotacion(anotacionId));
            return;
        }

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
            // ✅ DETECTAR ERROR DE RATE LIMIT
            if (error.code === 'RATE_LIMIT_EXCEEDED') {
                // ✅ Mostrar Toast con el mensaje del backend (detail)
                // El mensaje ya viene en error.message desde anotacionesService
                dispatch(setMensajeToast(error.message));
                dispatch(setVerToast(true));

                setTimeout(() => {
                    dispatch(setVerToast(false));
                }, 3000);
            } else {
                errorDesarrollo('Error al actualizar favorito:', error);
                cargarAnotaciones();
            }
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
        <>
            <div className={`${estaSeleccionada ? 'w-[98%] bg-gray-300/90 dark:bg-gray-600/90 p-3 rounded-md select-none' : ''}
                        flex flex-col items-center justify-center`}>

                <div className={`w-[98%] h-35 mt-2 p-2 rounded-md select-none
                        flex flex-col items-center gap-1 overflow-hidden
                        ${no_asignado ? 'bg-blue-200 dark:bg-blue-950 hover:bg-blue-300 active:bg-blue-300 dark:hover:bg-blue-900 dark:active:bg-blue-900' :
                        pendiente ? 'bg-yellow-200 dark:bg-yellow-950 hover:bg-yellow-300 active:bg-yellow-300 dark:hover:bg-yellow-900 dark:active:bg-yellow-900' :
                            finalizado ? 'bg-green-200 dark:bg-green-950 hover:bg-green-300 active:bg-green-300 dark:hover:bg-green-900 dark:active:bg-green-900' : 'bg-gray-200 dark:bg-black'}`}
                    onClick={handleVerVistaPrevia}>

                    <div className="w-full flex flex-row items-start justify-between">

                        {/*Cuando seleccionar sea true esto va a ocultarse*/}
                        {iconoFavorito && !seleccionar && (
                            <div
                                onClick={handleToggleFavorito}
                                className={`text-2xl md:text-3xl cursor-pointer
                            text-violet-800 dark:text-white
                            transition-transform hover:scale-110
                            ${actualizandoFavorito ? 'opacity-50 pointer-events-none' : ''}`}>
                                {esFavorito ? <HiStar /> : <HiOutlineStar />}
                            </div>
                        )}

                        {/* ✅ Ocultar estado cuando seleccionar = true */}
                        {!seleccionar && (
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
                        )}

                        {iconoAdministrar && !seleccionar && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleVerAdminAnotacion()
                                }}
                                className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer">
                                <HiDotsVertical />
                            </div>
                        )}


                        {/* ✅ Mostrar círculo de selección cuando seleccionar = true */}
                        {seleccionar && (
                            <div onClick={handleToggleSeleccion} className="cursor-pointer">
                                {estaSeleccionada
                                    ? <FaCircle className="text-base md:text-lg text-black dark:text-white" />
                                    : <FaRegCircle className="text-base md:text-lg text-black dark:text-white" />
                                }
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
                        <p className="text-base md:text-lg line-clamp-3 w-full px-1
                            text-black dark:text-white">
                            {texto}
                        </p>
                    </div>
                </div>


            </div>
        </>
    );
}