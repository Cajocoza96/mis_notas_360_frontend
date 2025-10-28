import React, { useEffect } from "react";

import { HiChevronLeft, HiOutlinePencil, HiDotsVertical } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";

import { toggleVerOpcCabPagVisPrev } from "../../../store/layoutSlice";

import { setAnotacionActual, setCargando, setError } from "../../../store/anotacionesSlice";

import { HiOutlineStar } from "react-icons/hi2";

import { Link, useParams, useNavigate } from "react-router-dom";

export default function Cabecera({ esModoVistaPrevia }) {
    const API_URL = import.meta.env.VITE_API_URL;

    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { anotacionActual, cargando } = useSelector((state) => state.anotaciones);

    // Cargar la anotación cuando se monta el componente
    useEffect(() => {
        if (id) {
            cargarAnotacion();
        }
    }, [id]);

    const cargarAnotacion = async () => {
        try {
            dispatch(setCargando(true));
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/anotaciones/obtener/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setAnotacionActual(data.anotacion));
            } else {
                console.error('Error al cargar la anotación');
                dispatch(setError('Error al cargar la anotación'));
            }
        } catch (error) {
            console.error('Error al cargar la anotación:', error);
            dispatch(setError('Error de conexión'));
        } finally {
            dispatch(setCargando(false));
        }
    }

    const handleVerOpcCabPagVisPrev = () => {
        dispatch(toggleVerOpcCabPagVisPrev())
    }

    const handleEditarNota = () => {
        // Navegar a la página de edición con el ID de la anotación
        navigate(`/editar/nota/${id}`);
    }

    // Función para formatear la fecha en formato dd/mm/yyyy
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
    }

    // Función para obtener el nombre del estado
    const obtenerNombreEstado = (estado) => {
        const estados = {
            'no_asignado': 'No asignado',
            'pendiente': 'Pendiente',
            'finalizado': 'Finalizado'
        };
        return estados[estado] || 'No asignado';
    }

    if (cargando) {
        return (
            <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">
                <div className="w-[95%] mx-auto flex items-center justify-center p-4">
                    <p className="text-base md:text-xl text-black dark:text-white">
                        Cargando...
                    </p>
                </div>
            </div>
        );
    }

    if (!anotacionActual) {
        return (
            <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">
                <div className="w-[95%] mx-auto flex items-center justify-center p-4">
                    <p className="text-base md:text-xl text-black dark:text-white">
                        Anotación no encontrada
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-col gap-2">

                <div className="flex flex-row items-center justify-between py-2">
                    <Link to="/panel-principal">
                        <HiChevronLeft className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                    </Link>

                    <div className="w-20 flex flex-row items-center justify-between">
                        <HiOutlineStar className="text-2xl md:text-3xl text-blue-600 dark:text-white cursor-pointer" />

                        <HiDotsVertical
                            className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer"
                            onClick={handleVerOpcCabPagVisPrev} />
                    </div>
                </div>

                <div className="p-1 flex flex-row items-center justify-between">
                    <p className={`text-sm md:text-base 
                            text-blue-600 dark:text-white
                            ${esModoVistaPrevia ? 'cursor-default' : ''}`}>
                        Estado ({obtenerNombreEstado(anotacionActual.estado)})
                    </p>

                    <p className={`text-sm md:text-base 
                            text-black dark:text-white
                            ${esModoVistaPrevia ? 'cursor-default' : ''}`}>
                        {formatearFecha(anotacionActual.fecha_creacion)}
                    </p>
                </div>

                <div className="w-full p-1 flex flex-row items-center justify-between">
                    <p className={`text-base md:text-xl 
                            text-black dark:text-white 
                            ${!anotacionActual.titulo ? 'text-gray-500 dark:text-gray-400': ''}
                            ${esModoVistaPrevia ? 'cursor-default' : ''}`}>
                        {anotacionActual.titulo && anotacionActual.titulo.trim() !== '' 
                            ? anotacionActual.titulo 
                            : 'Sin título'}
                    </p>

                    <HiOutlinePencil
                        onClick={handleEditarNota}
                        className="text-2xl md:text-3xl cursor-pointer text-blue-600 dark:text-white" />
                </div>

            </div>

        </div>
    );
}