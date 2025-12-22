import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { BiWifiOff, BiErrorAlt } from "react-icons/bi";
import useConexionInternet from "../../hooks/useConexionInternet";
import { useLocation, useNavigate } from "react-router-dom";

import BotonAccion from "../botones/BotonAccion";

export default function CargandoNoHayNada({
    advertenciaSinConexion,
    errorCargaInformacion,
    pantallaCompletaCarga,
    iconoDeCarga,
    CargandoAnotaciones,
    sinEstadoFavoritoNada,
    noHayEliminadas,
    iconoSinConexion,
    iconoError
}) {
    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);
    const verAnotacEstado = useSelector((state) => state.preferencia.verAnotacEstado);

    // ✅ Verificar si la autenticación está inicializando
    const { inicializando } = useSelector((state) => state.auth);

    const [cargando, setCargando] = useState(false);

    // Hook de conexión a internet
    const { isOnline, justReconnected, timeOffline } = useConexionInternet();

    const location = useLocation();

    const navigate = useNavigate();

    const handleNavegarInicio = () => navigate("/");

    const MiBoton = motion.create(BotonAccion);

    const esPaginaEstado = location.pathname.includes('/estados');

    const esPaginaPanelPrincipal = location.pathname.includes('/panel-principal');

    const esModoCrear = location.pathname.includes('/agregar-nota');
    const esModoEdicion = location.pathname.includes('/editar/nota/');

    const ModosCrearEdicion = esModoCrear || esModoEdicion;

    // ✅ Si está inicializando auth, mostrar loader
    if (inicializando && CargandoAnotaciones) {
        return (
            <div className="col-span-full text-center p-4 select-none
                            bg-white dark:bg-gray-800 text-black  dark:text-white
                            flex flex-col items-center justify-center gap-3">
                <FaSpinner className="animate-spin text-lg md:text-xl" />
                <div className="flex flex-col items-center justify-center gap-2 ">
                    <div>
                        <HiOutlineBookOpen className="text-2xl md:text-3xl" />
                    </div>
                    <p className="w-full text-center text-lg md:text-xl
                                            font-bold select-none truncate" translate="no">
                        MisNotas360
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {pantallaCompletaCarga && isOnline && (
                <div className="fixed inset-0 z-90 bg-black/50
                                flex items-center justify-center">
                    <FaSpinner className="animate-spin text-xl md:text-2xl text-white" />
                </div>
            )}

            {iconoDeCarga && isOnline && (
                <FaSpinner className="animate-spin text-xl md:text-2xl text-black dark:text-white" />
            )}

            {iconoSinConexion && (
                <BiWifiOff className="text-2xl md:text-3xl text-black dark:text-white" />
            )}

            {iconoError && (
                <BiErrorAlt className="text-2xl md:text-3xl text-black dark:text-white" />
            )}

            {CargandoAnotaciones && isOnline && !inicializando && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <FaSpinner className="animate-spin text-xl md:text-2xl text-black dark:text-white" />
                </div>
            )}

            {/* Mensaje de conexión a internet */}
            {!isOnline && !iconoSinConexion && !esPaginaEstado && (
                <div className="col-span-full text-center p-4 select-none
                                text-black dark:text-white
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-lg font-semibold">
                        Sin conexión a internet
                    </p>

                    <BiWifiOff className="text-6xl md:text-7xl" />

                    {!ModosCrearEdicion && (
                        <p className="text-base md:text-lg">
                            Al volver la conexión, los datos se actualizarán automáticamente.
                        </p>
                    )}

                    {ModosCrearEdicion && (
                        <div className="text-base md:text-lg flex flex-col items-center gap-3">
                            <div>
                                <span>Por ahora la aplicación no incluye autoguardado sin conexión.</span> <span>Si se pierde la conexión, los cambios no guardados se perderán.</span>
                            </div>

                            <div>
                                <span>
                                    Al volver la conexión, podrá seguir con la {esModoCrear ? 'creación' : 'edición'} de la nota
                                </span>
                            </div>
                        </div>
                    )}


                    {!esPaginaPanelPrincipal && (
                        <MiBoton
                            className="bg-violet-800 text-white
                                        hover:bg-violet-800 active:bg-violet-800
                                        rounded-full"
                            accion="Volver a inicio"
                            onClick={handleNavegarInicio}
                            whileHover={{
                                scale: 1.15,
                                boxShadow: "0px 4px 20px rgba(147, 51, 234, 0.4)"
                            }}
                            whileTap={{
                                scale: 0.96,
                                boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        />
                    )}

                </div>
            )}


            {errorCargaInformacion && (
                <div className="col-span-full text-center p-4 select-none
                                text-black dark:text-white
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-lg font-semibold">
                        ¡Error a cargar la información!
                    </p>

                    <BiErrorAlt className="text-6xl md:text-7xl" />

                    <div className="flex flex-col items-center justify-center gap-1">
                        <p className="text-base md:text-lg">
                            Se reintentará de nuevo automáticamente...
                        </p>
                        <FaSpinner className="animate-spin text-xl md:text-2xl text-gray-700 dark:text-gray-300" />
                        <span className="text-sm md:text-base">
                            Pudo ser por conexión inestable o problemas temporales del servidor.
                        </span>
                    </div>
                </div>
            )}

            {/* Contenido normal cuando hay conexión y no está reconectando */}
            {!errorCargaInformacion && sinEstadoFavoritoNada && !cargando && isOnline && !justReconnected && !inicializando && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-lg text-black dark:text-white">
                        {verAnotacEstado === 'ver_no_asignado' && verSoloFavoritos
                            ? 'No tienes anotaciones favoritas sin asignar'
                            : verAnotacEstado === 'ver_no_asignado' ? 'No tienes anotaciones sin asignar'
                                : verAnotacEstado === 'ver_pendiente' && verSoloFavoritos
                                    ? 'No tienes anotaciones favoritas pendientes'
                                    : verAnotacEstado === 'ver_pendiente' ? 'No tienes anotaciones pendientes'
                                        : verAnotacEstado === 'ver_finalizado' && verSoloFavoritos
                                            ? 'No tienes anotaciones favoritas finalizadas'
                                            : verAnotacEstado === 'ver_finalizado' ? 'No tienes anotaciones finalizadas'
                                                : verSoloFavoritos ? 'No tienes anotaciones favoritas.'
                                                    : 'No tienes anotaciones. ¡Crea tu primera nota!'}
                    </p>

                    <div>
                        <HiOutlineBookOpen className="text-6xl md:text-7xl text-black dark:text-white" />
                    </div>
                </div>
            )}

            {noHayEliminadas && !cargando && isOnline && !justReconnected && !inicializando && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-lg text-black dark:text-white">
                        No tienes anotaciones eliminadas.
                    </p>

                    <div>
                        <HiOutlineBookOpen className="text-6xl md:text-7xl text-black dark:text-white" />
                    </div>
                </div>
            )}
        </>
    );
}