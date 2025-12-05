import React, { useEffect, useState } from "react";

import { HiChevronLeft, HiOutlinePencil, HiDotsVertical } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";

import { toggleVerOpcCabPagVisPrev } from "../../../store/layoutSlice";

import { setAnotacionActual, actualizarFavoritoLocal } from "../../../store/anotacionesSlice";

import { HiOutlineStar, HiStar } from "react-icons/hi2";

import { Link, useParams, useNavigate } from "react-router-dom";

import { formatearFechaConHora } from "../../../utils/dateUtils";

import { obtenerNombreEstado } from "../../../utils/estadoUtils";

import { obtenerAnotacionPorId, actualizarFavorito } from "../../../services/anotacionesService";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../../utils/errorHandler";

export default function Cabecera({ esModoVistaPrevia }) {
    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // ✅ Obtener anotación actual
    const { anotacionActual } = useSelector((state) => state.anotaciones);

    const [actualizandoFavorito, setActualizandoFavorito] = useState(false);
    const [cargando, setCargando] = useState(false);

    const [error, setError] = useState(null);

    // Cargar la anotación cuando se monta el componente (solo si NO es modo vista previa)
    // En modo vista previa, la carga se maneja desde PaginaVistaPrevia.jsx
    useEffect(() => {
        if (id && !esModoVistaPrevia) {
            cargarAnotacion();
        }
    }, [id, esModoVistaPrevia]);

    // useEffect para manejar la redirección cuando no hay anotación
    useEffect(() => {
        if (!cargando && !anotacionActual && !esModoVistaPrevia) {
            navigate('/nota-no-encontrada', { replace: true });
        }
    }, [cargando, anotacionActual, navigate, esModoVistaPrevia]);

    const cargarAnotacion = async () => {
        try {
            setCargando(true);

            const anotacion = await obtenerAnotacionPorId(id);

            dispatch(setAnotacionActual(anotacion));
        } catch (error) {
            errorDesarrollo('Error al cargar la anotación en cabecera:', error);
            setError('Error al cargar la anotación');
        } finally {
            setCargando(false);
        }
    }

    const handleVerOpcCabPagVisPrev = () => {
        dispatch(toggleVerOpcCabPagVisPrev())
    }

    const handleEditarNota = () => {
        // Navegar a la página de edición con el ID de la anotación
        navigate(`/editar/nota/${id}`);
    }

    const handleToggleFavorito = async () => {
        if (actualizandoFavorito || !anotacionActual) return;

        const estadoFavoritoActual = anotacionActual.favorito;

        try {
            setActualizandoFavorito(true);
            
            const nuevoEstadoFavorito = !estadoFavoritoActual;

            // Actualizar en el backend
            await actualizarFavorito(id, nuevoEstadoFavorito);
            
            // Actualizar localmente de inmediato (optimistic update)
            dispatch(actualizarFavoritoLocal({ 
                anotacionId: parseInt(id),
                favorito: nuevoEstadoFavorito 
            }));

            
        } catch (error) {
            errorDesarrollo('Error al actualizar favorito:', error);
            // Revertir el cambio local si falla
            dispatch(actualizarFavoritoLocal({ 
                anotacionId: parseInt(id),
                favorito: estadoFavoritoActual 
            }));
        } finally {
            setActualizandoFavorito(false);
        }
    };

    // ✅ No mostrar nada mientras está cargando localmente
    if (cargando) {
        return null;
    }

    // ✅ No mostrar nada mientras se está redirigiendo
    if (!anotacionActual) {
        return null;
    }

    return (
        <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-col gap-2">

                <div className="flex flex-row items-center justify-between py-2">
                    <Link to="/panel-principal">
                        <HiChevronLeft className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                    </Link>

                    <div className="w-30 flex flex-row items-center justify-between">
                    <HiOutlinePencil
                        onClick={handleEditarNota}
                        className="text-2xl md:text-3xl cursor-pointer text-violet-800 dark:text-white" />


                        <div
                            onClick={handleToggleFavorito}
                            className={`text-2xl md:text-3xl text-violet-800 dark:text-white cursor-pointer
                                        transition-transform hover:scale-110
                                        ${actualizandoFavorito ? 'opacity-50 pointer-events-none' : ''}`}>
                            {anotacionActual.favorito ? <HiStar /> : <HiOutlineStar />}
                        </div>

                        <HiDotsVertical
                            className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer"
                            onClick={handleVerOpcCabPagVisPrev} />
                    </div>
                </div>

                <div className="p-1 flex flex-row items-center justify-between">
                    <p className={`text-sm md:text-base 
                            ${esModoVistaPrevia ? 'cursor-default' : ''}
                            
                            ${anotacionActual.estado === "no_asignado" ? 'text-blue-900 dark:text-blue-300' :
                            anotacionActual.estado === "pendiente" ? 'text-yellow-900 dark:text-yellow-300' :
                                anotacionActual.estado === "finalizado" ? 'text-green-900 dark:text-green-300' : 'text-black dark:text-white'}
                            `}>
                        Estado ({obtenerNombreEstado(anotacionActual.estado)})
                    </p>

                    <div className={`text-sm md:text-base 
                            text-black dark:text-white
                            flex flex-col justify-center items-center
                            ${esModoVistaPrevia ? 'cursor-default' : ''}`}>

                        <p className="font-semibold">Fecha de creación:</p>
                        <p>{formatearFechaConHora(anotacionActual.fecha_creacion)}</p>
                    </div>
                </div>

                <div className="w-full p-1 flex flex-row items-center justify-between">
                    <p className={`text-base md:text-lg truncate
                            text-black dark:text-white font-semibold
                            ${!anotacionActual.titulo ? 'text-gray-500 dark:text-gray-400' : ''}
                            ${esModoVistaPrevia ? 'cursor-default' : ''}`}>
                        {anotacionActual.titulo && anotacionActual.titulo.trim() !== ''
                            ? anotacionActual.titulo
                            : 'Sin título'}
                    </p>
                </div>

            </div>

        </div>
    );
}