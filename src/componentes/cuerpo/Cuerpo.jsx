import React, { useState, useEffect, useRef } from "react";

import NotaVistaPrevia from "../../paginas/pagina_principal/cuerpo/nota_vista_previa/NotaVistaPrevia";

import EstadosVistaPrevia from "../../paginas/pagina_estado/cuerpo/estados_vista_previa/EstadosVistaPrevia";

import { useSelector, useDispatch } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom";

import { HiOutlineBookOpen, HiMinusCircle, HiClock, HiCheckCircle } from "react-icons/hi";

import { setAnotaciones } from "../../store/anotacionesSlice";

import { setContadores } from "../../store/tareasSlice";

import { guardarVerAnotacEstado } from "../../store/preferenciaSlice";

import { obtenerEstadoProps } from "../../utils/estadoUtils";

import {
    obtenerContadores,
    obtenerAnotaciones, obtenerAnotacionesEliminadas
} from "../../services/anotacionesService";

import AdminAnotacion from "../admin_anotacion/AdminAnotacion";

import CargandoNoHayNada from "../cargando_no_hay_nada/CargandoNoHayNada";

import { AnimatePresence } from "framer-motion";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../utils/errorHandler";

import useConexionInternet from "../../hooks/useConexionInternet";

export default function Cuerpo({ notaNoEliminada,
    verContenidoCuerpo, verNotaBusqueda, verNotaEliminada, verTodosEstados }) {

    const { isOnline, justReconnected, resetReconnectionState } = useConexionInternet();

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const esPaginaBuscar = location.pathname.includes('/buscar');

    const organizarPorColumna = useSelector((state) => state.preferencia.organizarPorColumna);
    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);
    const verAnotacEstado = useSelector((state) => state.preferencia.verAnotacEstado);
    const ordenAnotaciones = useSelector((state) => state.preferencia.ordenAnotaciones);

    const verAdminAnotacion = useSelector((state) => state.anotaciones.verAdminAnotacion);

    // ✅ Obtener también mostrandoResultados
    const { anotaciones = [] } = useSelector((state) => state.anotaciones);

    const { terminoBusqueda, resultadosBusqueda, cargandoBusqueda } = useSelector((state) => state.busqueda);

    // Obtener los contadores del estado de Redux
    const contadores = useSelector(state => state.tareas.contadores);

    // ✅ useRef para controlar el timeout
    const timeoutRef = useRef(null);
    const reintentoRef = useRef(null); // ✅ Nuevo ref para el reintento

    // Cargar contadores al montar el componente
    useEffect(() => {
        if (verTodosEstados && !cargando && isOnline) {
            cargarContadores();
        }
    }, [verTodosEstados]);

    const [cargando, setCargando] = useState(false);

    const [procesando, setProcesando] = useState(false);

    const [error, setError] = useState(false); // ✅ Cambiar a boolean
    const [cargaInicial, setCargaInicial] = useState(true); // ✅ Controlar primera carga

    // ✅ NUEVA FUNCIÓN: Reordenar tareas según el tipo de orden
    const reordenarTareasPorOrden = (tareas, tipoOrden) => {
        if (!tareas || tareas.length === 0) return [];

        // Mapear tareas al formato correcto
        const tareasFormateadas = tareas.map(t => ({
            texto: t.texto_tarea,
            orden_creacion: t.orden_creacion,
            completada: t.tarea_completada === true || t.tarea_completada === 1
        }));

        if (tipoOrden === 'creacion') {
            return [...tareasFormateadas].sort((a, b) => {
                const ordenA = a.orden_creacion !== undefined ? a.orden_creacion : 999999;
                const ordenB = b.orden_creacion !== undefined ? b.orden_creacion : 999999;
                return ordenA - ordenB;
            });
        } else if (tipoOrden === 'ascendente') {
            return [...tareasFormateadas].sort((a, b) => {
                const matchA = a.texto.match(/^(\d+)\./);
                const matchB = b.texto.match(/^(\d+)\./);

                const numA = matchA ? parseInt(matchA[1]) : null;
                const numB = matchB ? parseInt(matchB[1]) : null;

                if (numA !== null && numB !== null) {
                    if (numA !== numB) return numA - numB;
                    return a.texto.toLowerCase().localeCompare(b.texto.toLowerCase());
                }

                if (numA !== null) return -1;
                if (numB !== null) return 1;

                return a.texto.toLowerCase().localeCompare(b.texto.toLowerCase());
            });
        } else if (tipoOrden === 'descendente') {
            return [...tareasFormateadas].sort((a, b) => {
                const matchA = a.texto.match(/^(\d+)\./);
                const matchB = b.texto.match(/^(\d+)\./);

                const numA = matchA ? parseInt(matchA[1]) : null;
                const numB = matchB ? parseInt(matchB[1]) : null;

                if (numA !== null && numB !== null) {
                    if (numA !== numB) return numB - numA;
                    return b.texto.toLowerCase().localeCompare(a.texto.toLowerCase());
                }

                if (numA !== null) return -1;
                if (numB !== null) return 1;

                return b.texto.toLowerCase().localeCompare(a.texto.toLowerCase());
            });
        }

        return tareasFormateadas;
    };

    const cargarContadores = async () => {
        try {
            setProcesando(true);
            setCargando(true);
            const datos = await obtenerContadores();
            dispatch(setContadores(datos));
            setError(false); // ✅ Limpiar error si la carga fue exitosa
            setCargaInicial(false); // ✅ Ya no es carga inicial
            setCargando(false);
            setProcesando(false);
        } catch (error) {
            setError(true); // ✅ Marcar error
            setProcesando(false);
            setCargando(false);
            errorDesarrollo('Error al cargar contadores en el componente:', error);

            // ✅ Reintentar automáticamente si hay internet
            if (isOnline) {
                reintentoAutomatico(() => cargarContadores());
            }
        }
    };

    // ✅ Cargar anotaciones usando el thunk cuando cambien los filtros
    useEffect(() => {
        if (verContenidoCuerpo && isOnline) {
            cargarAnotaciones();
        } else if (verNotaEliminada && isOnline) {
            cargarAnotacionesEliminadas();
        }
    }, [verContenidoCuerpo, verNotaEliminada, verSoloFavoritos, verAnotacEstado, ordenAnotaciones, location.pathname]);

    // Efecto para recargar anotaciones cuando se restablece la conexión
    useEffect(() => {
        if (justReconnected) {
            // ✅ Limpiar errores al reconectar
            setError(false);

            // Recargar anotaciones según el contexto actual
            if (verContenidoCuerpo) {
                cargarAnotaciones();
            } else if (verNotaEliminada) {
                cargarAnotacionesEliminadas();
            } else if (verTodosEstados) {
                cargarContadores();
            }

            // Esperar un momento antes de resetear el estado de reconexión
            const timer = setTimeout(() => {
                resetReconnectionState();
            }, 3000); // El mensaje desaparecerá después de 3 segundos

            return () => clearTimeout(timer);
        }
    }, [justReconnected]);

    // Efecto que ayuda que procesando se quite en /panel-principal
    useEffect(() => {
        // Solo ejecutar cuando estamos en /panel-principal Y procesando es true
        if (location.pathname === "/panel-principal" && procesando && verTodosEstados === false) {
            // Esto significa que acabamos de navegar desde /estados
            setProcesando(false);
        }
    }, [location.pathname, verTodosEstados]);

    // ✅ Función de reintento automático
    const reintentoAutomatico = (funcionReintento) => {
        // Limpiar reintento anterior si existe
        if (reintentoRef.current) {
            clearTimeout(reintentoRef.current);
        }

        // Reintentar después de 3 segundos
        reintentoRef.current = setTimeout(() => {
            if (isOnline) {
                errorDesarrollo('Reintentando cargar datos...');
                funcionReintento();
            }
        }, 3000);
    };

    // ✅ Limpiar timeout al desmontar
    useEffect(() => {
        return () => {
            if (reintentoRef.current) {
                clearTimeout(reintentoRef.current);
            }
        };
    }, []);

    //Cargar todas las anotaciones
    const cargarAnotaciones = async () => {
        try {
            setCargando(true);
            const anotacionesData = await obtenerAnotaciones();

            const anotacionesConOrden = anotacionesData.map(anotacion => ({
                ...anotacion,
                orden_tareas: anotacion.orden_tareas || 'creacion'
            }));

            dispatch(setAnotaciones(anotacionesConOrden));
            setError(false); // ✅ Limpiar error si la carga fue exitosa
            setCargaInicial(false); // ✅ Ya no es carga inicial
            setCargando(false);
        } catch (error) {
            setError(true); // ✅ Marcar error
            setCargando(false);
            errorDesarrollo('Error al cargar las anotaciones:', error);
            // ✅ Reintentar automáticamente si hay internet
            if (isOnline) {
                reintentoAutomatico(() => cargarAnotaciones());
            }
        } finally {
            setCargando(false);
        }
    }

    //Cargar anotaciones eliminadas
    const cargarAnotacionesEliminadas = async () => {
        try {
            setCargando(true);
            const anotacionesData = await obtenerAnotacionesEliminadas();

            const anotacionesConOrden = anotacionesData.map(anotacion => ({
                ...anotacion,
                orden_tareas: anotacion.orden_tareas || 'creacion'
            }));

            dispatch(setAnotaciones(anotacionesConOrden));
            setError(false); // ✅ Limpiar error si la carga fue exitosa
            setCargaInicial(false); // ✅ Ya no es carga inicial
            setCargando(false);
        } catch (error) {
            setError(true); // ✅ Marcar error
            setCargando(false);
            errorDesarrollo('Error al cargar las anotaciones eliminadas:', error);

            // ✅ Reintentar automáticamente si hay internet
            if (isOnline) {
                reintentoAutomatico(() => cargarAnotacionesEliminadas());
            }
        } finally {
            setCargando(false);
        }
    }

    // Manejar clic en los estados
    const handleEstadoClick = async (nuevoEstado) => {
        try {
            if (!isOnline) {
                return
            } else {
                setProcesando(true);
                await dispatch(guardarVerAnotacEstado(nuevoEstado)).unwrap();

                // Verificar si ya estamos en /panel-principal
                if (location.pathname === "/panel-principal") {
                    // Si ya estamos en la ruta, solo actualizamos el estado
                    setProcesando(false);
                } else {
                    // Si no estamos en la ruta, navegamos y esperamos
                    navigate("/panel-principal");
                    // No ponemos setProcesando(false) aquí
                    // El siguiente useEffect lo manejará
                }
            }
        } catch (error) {
            errorDesarrollo('Error al cambiar filtro de estado:', error);
            setProcesando(false);
        }
    };

    // Función para obtener el texto a mostrar según la prioridad
    const obtenerTextoVistaPrevia = (anotacion) => {
        // 1. Si tiene título, mostrar título
        if (anotacion.titulo && anotacion.titulo.trim() !== '') {
            return { texto: anotacion.titulo, completada: false }
        }

        // 2. Si no tiene título pero tiene nota, mostrar nota
        if (anotacion.nota && anotacion.nota.trim() !== '') {
            return { texto: anotacion.nota, completada: false }
        }

        // 3. Si no tiene título ni nota, mostrar la primera tarea
        if (anotacion.tareas && anotacion.tareas.length > 0) {
            // ✅ Reordenar las tareas según el orden_tareas de la anotación
            const tareasOrdenadas = reordenarTareasPorOrden(
                anotacion.tareas,
                anotacion.orden_tareas || 'creacion'
            );

            // ✅ Devolver la primera tarea del orden correcto
            return {
                texto: tareasOrdenadas[0]?.texto || '',
                completada: tareasOrdenadas[0]?.completada || false
            }
        }

        // 4. Si no hay nada, mostrar texto por defecto
        return { texto: '', completada: false };
    }

    return (
        <>
            {notaNoEliminada && (
                <div className={`w-[95%] ${!esPaginaBuscar ? 'h-full' : 'col-span-full'}  mx-auto overflow-y-auto
                                overflow-x-hidden min-h-0 min-w-0 pb-3
                                ${(!isOnline && (verContenidoCuerpo || verNotaEliminada)) ? 'flex items-center justify-center' : 'grid'}
                ${organizarPorColumna ? 'grid-cols-2 2xs:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1'} gap-5 lg:gap-3
                ${anotaciones.length === 0 || cargando ? 'auto-rows-auto' : 'auto-rows-[11rem]'}`}>

                    <AnimatePresence>
                        {verAdminAnotacion && (
                            <AdminAnotacion />
                        )}
                    </AnimatePresence>

                    {verContenidoCuerpo && (
                        <>
                            {!isOnline ? (
                                <CargandoNoHayNada iconoSinConexion={false} />
                            ) :
                                /*Mostrar panel de error */
                                error ? (
                                    <CargandoNoHayNada errorCargaInformacion={true} iconoSinConexion={false} />
                                ) :

                                    /* ✅ Mostrar spinner mientras carga O mientras no se deben mostrar resultados */
                                    cargando ? (
                                        <CargandoNoHayNada CargandoAnotaciones={true} />

                                    ) : anotaciones.length === 0 ? (
                                        <CargandoNoHayNada sinEstadoFavoritoNada={true} />
                                    ) : (
                                        anotaciones.map((anotacion) => {
                                            const { texto, completada } = obtenerTextoVistaPrevia(anotacion);
                                            return (
                                                <NotaVistaPrevia
                                                    iconoFavorito={true}
                                                    iconoAdministrar={true}
                                                    key={anotacion.id}
                                                    anotacionId={anotacion.id}
                                                    texto={texto}
                                                    tareaCompletada={completada}
                                                    esFavorito={Boolean(anotacion.favorito)}
                                                    {...obtenerEstadoProps(anotacion.estado)}
                                                />
                                            );
                                        })
                                    )}
                        </>
                    )}

                    {verNotaBusqueda && (
                        <>
                            {cargandoBusqueda && isOnline ? (
                                <div className="col-span-full text-center p-4 select-none
                                                flex flex-col items-center justify-center gap-3">
                                    <p className="text-base md:text-lg text-black dark:text-white">
                                        Buscando...
                                    </p>
                                </div>
                            ) : resultadosBusqueda.length === 0 && isOnline && terminoBusqueda ? (
                                <div className="col-span-full text-center p-4 select-none
                                                flex flex-col items-center justify-center gap-3">
                                    <p className="text-base md:text-lg text-black dark:text-white">
                                        No se encontraron resultados para "{terminoBusqueda}"
                                    </p>
                                    <div>
                                        <HiOutlineBookOpen className="text-6xl md:text-7xl text-black dark:text-white" />
                                    </div>
                                </div>
                            ) : (
                                isOnline && resultadosBusqueda.map((anotacion) => {
                                    const { texto, completada } = obtenerTextoVistaPrevia(anotacion);
                                    return (
                                        <NotaVistaPrevia
                                            key={anotacion.id}
                                            anotacionId={anotacion.id}
                                            texto={texto}
                                            tareaCompletada={completada}
                                            {...obtenerEstadoProps(anotacion.estado)}
                                        />
                                    )

                                })
                            )}
                        </>
                    )}

                    {verNotaEliminada && (
                        <>
                            {!isOnline ? (
                                <CargandoNoHayNada iconoSinConexion={false} />
                            ) :
                                error ? (
                                    <CargandoNoHayNada errorCargaInformacion={true} iconoSinConexion={false} />
                                ) :
                                    cargando ? (
                                        <CargandoNoHayNada
                                            CargandoAnotaciones={true}
                                        />
                                    ) : anotaciones.length === 0 ? (
                                        <CargandoNoHayNada
                                            noHayEliminadas={true}
                                        />
                                    ) : (
                                        anotaciones.map((anotacion) => {
                                            const { texto, completada } = obtenerTextoVistaPrevia(anotacion);
                                            return (
                                                <NotaVistaPrevia
                                                    key={anotacion.id}
                                                    anotacionId={anotacion.id}
                                                    iconoRestaurarEliminarDefinitivo={true}
                                                    texto={texto}
                                                    tareaCompletada={completada}
                                                    {...obtenerEstadoProps(anotacion.estado)}
                                                />
                                            )
                                        })
                                    )}
                        </>
                    )}
                </div>
            )}

            {verTodosEstados && (
                <div className={`w-[95%] h-full mx-auto overflow-y-auto 
                                        overflow-x-hidden min-h-0 min-w-0 pb-3
                                        flex flex-col justify-start gap-5`}>

                    {procesando && (<CargandoNoHayNada pantallaCompletaCarga={true} />)}

                    {error && (<CargandoNoHayNada pantallaCompletaCarga={true} />)}

                    <EstadosVistaPrevia
                        iconoEstado={<HiMinusCircle className="text-blue-700" />}
                        tipoEstado="No asignado"
                        cantidadEstado={cargando && isOnline ? <CargandoNoHayNada iconoDeCarga={true} /> : !isOnline ? <CargandoNoHayNada iconoSinConexion={true} /> : error ? <CargandoNoHayNada iconoError={true} /> : contadores.cant_no_asignado}
                        no_asignado={true}
                        seleccionado={verAnotacEstado === 'ver_no_asignado'}
                        onClick={() => handleEstadoClick('ver_no_asignado')}
                    />

                    <EstadosVistaPrevia
                        iconoEstado={<HiClock className="text-yellow-700" />}
                        tipoEstado="Pendiente"
                        cantidadEstado={cargando && isOnline ? <CargandoNoHayNada iconoDeCarga={true} /> : !isOnline ? <CargandoNoHayNada iconoSinConexion={true} /> : error ? <CargandoNoHayNada iconoError={true} /> : contadores.cant_pendiente}
                        pendiente={true}
                        seleccionado={verAnotacEstado === 'ver_pendiente'}
                        onClick={() => handleEstadoClick('ver_pendiente')}
                    />

                    <EstadosVistaPrevia
                        iconoEstado={<HiCheckCircle className="text-green-700" />}
                        tipoEstado="Finalizado"
                        cantidadEstado={cargando && isOnline ? <CargandoNoHayNada iconoDeCarga={true} /> : !isOnline ? <CargandoNoHayNada iconoSinConexion={true} /> : error ? <CargandoNoHayNada iconoError={true} /> : contadores.cant_finalizado}
                        finalizado={true}
                        seleccionado={verAnotacEstado === 'ver_finalizado'}
                        onClick={() => handleEstadoClick('ver_finalizado')}
                    />

                    <EstadosVistaPrevia
                        tipoEstado="Todos los estados"
                        cantidadEstado={cargando && isOnline ? <CargandoNoHayNada iconoDeCarga={true} /> : !isOnline ? <CargandoNoHayNada iconoSinConexion={true} /> : error ? <CargandoNoHayNada iconoError={true} /> : contadores.cant_todos_estados}
                        seleccionado={verAnotacEstado === 'ver_todos_estados'}
                        onClick={() => handleEstadoClick('ver_todos_estados')}
                    />

                </div>

            )}

        </>
    )
}