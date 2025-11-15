import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";

export default function CargandoNoHayNada({
    pantallaCompletaCarga,
    iconoDeCarga,
    CargandoAnotaciones,
    sinEstadoFavoritoNada,
    noHayEliminadas
}) {
    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);
    const verAnotacEstado = useSelector((state) => state.preferencia.verAnotacEstado);
    const cargando = useSelector((state) => state.anotaciones.cargando);

    // ✅ Estado para controlar el delay del mensaje
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    useEffect(() => {
        if (sinEstadoFavoritoNada && !cargando) {
            // Esperar 400ms antes de mostrar el mensaje "No hay nada"
            const timer = setTimeout(() => {
                setMostrarMensaje(true);
            }, 300);

            return () => clearTimeout(timer);
        } else {
            setMostrarMensaje(false);
        }
    }, [sinEstadoFavoritoNada, cargando]);

    return (
        <>
            {pantallaCompletaCarga && (
                <div className="fixed inset-0 z-90 bg-violet-700
                                flex items-center justify-center">
                    <FaSpinner className="animate-spin text-xl md:text-2xl text-white" />
                </div>
            )}

            {iconoDeCarga && (
                <FaSpinner className="animate-spin text-xl md:text-2xl text-black dark:text-white" />
            )}

            {CargandoAnotaciones && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <FaSpinner className="animate-spin text-xl md:text-2xl text-black dark:text-white" />
                </div>
            )}

            {/* ✅ Solo mostrar después del delay y si no está cargando */}
            {sinEstadoFavoritoNada && mostrarMensaje && !cargando && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-xl text-black dark:text-white">
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

            {noHayEliminadas && (
                <div className="col-span-full text-center p-4 select-none
                                flex flex-col items-center justify-center gap-3">
                    <p className="text-base md:text-xl text-black dark:text-white">
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