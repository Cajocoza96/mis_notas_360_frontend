import React, { useEffect } from "react";

import NotaVistaPrevia from "../../paginas/pagina_principal/cuerpo/nota_vista_previa/NotaVistaPrevia";

import EliminadaNotaVistaPrevia from "../../paginas/pagina_papelera/cuerpo/eliminada_nota_vista_previa/EliminadaNotaVistaPrevia";

import EstadosVistaPrevia from "../../paginas/pagina_estado/cuerpo/estados_vista_previa/EstadosVistaPrevia";

import { useSelector, useDispatch } from "react-redux";

import { useLocation } from "react-router-dom";

import { HiOutlineBookOpen, HiMinusCircle, HiClock, HiCheckCircle } from "react-icons/hi";

import { setAnotaciones, setCargando, setError } from "../../store/anotacionesSlice";

export default function Cuerpo({ notaNoEliminada, notaBusquedaNotaEliminada,
    verContenidoCuerpo, verNotaBusqueda, verNotaEliminada, verTodosEstados }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const location = useLocation();

    const dispatch = useDispatch();

    const organizarPorColumna = useSelector((state) => state.preferencia.organizarPorColumna);

    const { anotaciones, cargando } = useSelector((state) => state.anotaciones);

    const { terminoBusqueda, resultadosBusqueda, cargandoBusqueda } = useSelector((state) => state.busqueda);

    // Cargar anotaciones creadas al montar el componente
    useEffect(() => {
        if (verContenidoCuerpo) {
            cargarAnotaciones();
        } else if (verNotaEliminada) {
            cargarAnotacionesEliminadas();
        }
    }, [verContenidoCuerpo, verNotaEliminada, location.pathname]);

    //Cargar anotaciones creadas sin eliminar
    const cargarAnotaciones = async () => {
        try {
            dispatch(setCargando(true));
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/anotaciones/obtener`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setAnotaciones(data.anotaciones));
            } else {
                console.error('Error al cargar anotaciones');
                dispatch(setError('Error al cargar las anotaciones'));
            }
        } catch (error) {
            console.error('Error al cargar anotaciones:', error);
            dispatch(setError('Error de conexión'));
        } finally {
            dispatch(setCargando(false));
        }
    }

    //Cargar anotaciones eliminadas
    const cargarAnotacionesEliminadas = async () => {
        try {
            dispatch(setCargando(true));
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/anotaciones/obtener-papelera`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setAnotaciones(data.anotaciones));
            } else {
                console.error('Error al cargar anotaciones eliminadas');
                dispatch(setError('Error al cargar las anotaciones eliminadas'));
            }
        } catch (error) {
            console.error('Error al cargar anotaciones eliminadas:', error);
            dispatch(setError('Error de conexión'));
        } finally {
            dispatch(setCargando(false));
        }
    }

    // Función para obtener el texto a mostrar según la prioridad
    const obtenerTextoVistaPrevia = (anotacion) => {
        // 1. Si tiene título, mostrar título
        if (anotacion.titulo && anotacion.titulo.trim() !== '') {
            return anotacion.titulo;
        }

        // 2. Si no tiene título pero tiene nota, mostrar nota
        if (anotacion.nota && anotacion.nota.trim() !== '') {
            return anotacion.nota;
        }

        // 3. Si no tiene título ni nota, mostrar la primera tarea
        if (anotacion.tareas && anotacion.tareas.length > 0) {
            return anotacion.tareas[0].texto_tarea;
        }

        // 4. Si no hay nada, mostrar texto por defecto
        return '';
    }

    // Función para mapear el estado de la BD al frontend
    const obtenerEstadoProps = (estado) => {
        return {
            noAsignado: estado === 'no_asignado',
            pendiente: estado === 'pendiente',
            finalizado: estado === 'finalizado'
        };
    }

    return (
        <>
            {notaNoEliminada && (
                <div className={`w-[95%] h-full mx-auto overflow-y-auto 
                                overflow-x-hidden min-h-0 min-w-0 pb-3
                                grid
                ${anotaciones.length === 0 ? '' : 'auto-rows-[11rem]'}
                ${organizarPorColumna ? 'grid-cols-2 2xs:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1'} gap-5 lg:gap-3`}>

                    {verContenidoCuerpo && (
                        <>
                            {cargando ? (
                                <div className="col-span-full text-center p-4 select-none
                                                flex flex-col items-center justify-center gap-3">
                                    <p className="text-base md:text-xl text-black dark:text-white">
                                        Cargando anotaciones...
                                    </p>
                                </div>
                            ) : anotaciones.length === 0 ? (
                                <div className="col-span-full text-center p-4 select-none
                                                flex flex-col items-center justify-center gap-3">
                                    <p className="text-base md:text-xl text-black dark:text-white">
                                        No tienes anotaciones. ¡Crea tu primera nota!
                                    </p>

                                    <div>
                                        <HiOutlineBookOpen className="text-2xl md:text-3xl text-black dark:text-white" />
                                    </div>
                                </div>
                            ) : (
                                anotaciones.map((anotacion) => (
                                    <NotaVistaPrevia
                                        iconoFavorito={true}
                                        key={anotacion.id}
                                        anotacionId={anotacion.id}
                                        texto={obtenerTextoVistaPrevia(anotacion)}
                                        {...obtenerEstadoProps(anotacion.estado)}
                                    />
                                ))
                            )}
                        </>
                    )}


                    {verNotaBusqueda && (
                        <>
                            {cargandoBusqueda ? (
                                <div className="col-span-full text-center p-4 select-none
                            flex flex-col items-center justify-center gap-3">
                                    <p className="text-base md:text-xl text-black dark:text-white">
                                        Buscando...
                                    </p>
                                </div>
                            ) : resultadosBusqueda.length === 0 && terminoBusqueda ? (
                                <div className="col-span-full text-center p-4 select-none
                                                flex flex-col items-center justify-center gap-3">
                                    <p className="text-base md:text-xl text-black dark:text-white">
                                        No se encontraron resultados para "{terminoBusqueda}"
                                    </p>
                                    <div>
                                        <HiOutlineBookOpen className="text-2xl md:text-3xl text-black dark:text-white" />
                                    </div>
                                </div>
                            ) : (
                                resultadosBusqueda.map((anotacion) => (
                                    <NotaVistaPrevia
                                        key={anotacion.id}
                                        anotacionId={anotacion.id}
                                        texto={obtenerTextoVistaPrevia(anotacion)}
                                        {...obtenerEstadoProps(anotacion.estado)}
                                    />
                                ))
                            )}
                        </>
                    )}
                </div>
            )}

            {notaBusquedaNotaEliminada && (
                <div className={`w-[95%] h-full mx-auto overflow-y-auto
                                overflow-x-hidden min-h-0 min-w-0 pb-3
                                grid grid-cols-1 gap-5 lg:gap-3 
                                ${anotaciones.length === 0 ? '' : 'auto-rows-[7rem]'}`}>

                    {verNotaEliminada && (
                        <>
                            {cargando ? (
                                <div className="col-span-full text-center p-4 select-none
                                                flex flex-col items-center justify-center gap-3">
                                    <p className="text-base md:text-xl text-black dark:text-white">
                                        Cargando anotaciones eliminadas...
                                    </p>
                                </div>
                            ) : anotaciones.length === 0 ? (
                                <div className="col-span-full text-center p-4 select-none
                                                flex flex-col items-center justify-center gap-3">
                                    <p className="text-base md:text-xl text-black dark:text-white">
                                        No tienes anotaciones eliminadas.
                                    </p>

                                    <div>
                                        <HiOutlineBookOpen className="text-2xl md:text-3xl text-black dark:text-white" />
                                    </div>
                                </div>
                            ) : (
                                anotaciones.map((anotacion) => (
                                    <EliminadaNotaVistaPrevia
                                        key={anotacion.id}
                                        anotacionId={anotacion.id}

                                        /*
                                        fechaCreacion={formatearFecha(anotacion.fecha_creacion)}
                                        */
                                        texto={obtenerTextoVistaPrevia(anotacion)}
                                        {...obtenerEstadoProps(anotacion.estado)}
                                    />
                                ))
                            )}
                        </>
                    )}

                    {verTodosEstados && (
                        <>
                            <EstadosVistaPrevia
                                iconoEstado={<HiMinusCircle className="text-blue-600" />}
                                tipoEstado="No asignado"
                                cantidadEstado="10"
                            />

                            <EstadosVistaPrevia
                                iconoEstado={<HiClock className="text-yellow-600" />}
                                tipoEstado="Pendiente"
                                cantidadEstado="7"
                            />

                            <EstadosVistaPrevia
                                iconoEstado={<HiCheckCircle className="text-green-600" />}
                                tipoEstado="Finalizado"
                                cantidadEstado="2"
                            />
                        </>
                    )}

                </div>
            )}

        </>
    );
}