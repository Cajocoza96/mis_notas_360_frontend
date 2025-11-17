import React, { useState, useEffect, useRef } from "react";

import NotaVistaPrevia from "../../paginas/pagina_principal/cuerpo/nota_vista_previa/NotaVistaPrevia";

import EstadosVistaPrevia from "../../paginas/pagina_estado/cuerpo/estados_vista_previa/EstadosVistaPrevia";

import { useSelector, useDispatch } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom";

import { HiOutlineBookOpen, HiMinusCircle, HiClock, HiCheckCircle } from "react-icons/hi";

import { cargarAnotaciones, setAnotaciones, setCargando, setError, setMostrandoResultados } from "../../store/anotacionesSlice";

import { setContadores } from "../../store/tareasSlice";

import { guardarVerAnotacEstado } from "../../store/preferenciaSlice";

import { obtenerEstadoProps } from "../../utils/estadoUtils";

import { obtenerContadores, obtenerAnotacionesEliminadas } from "../../services/anotacionesService";

import AdminAnotacion from "../admin_anotacion/AdminAnotacion";

import CargandoNoHayNada from "../cargando_no_hay_nada/CargandoNoHayNada";

export default function Cuerpo({ notaNoEliminada,
    verContenidoCuerpo, verNotaBusqueda, verNotaEliminada, verTodosEstados }) {

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const organizarPorColumna = useSelector((state) => state.preferencia.organizarPorColumna);
    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);
    const verAnotacEstado = useSelector((state) => state.preferencia.verAnotacEstado);
    const ordenAnotaciones = useSelector((state) => state.preferencia.ordenAnotaciones);

    const verAdminAnotacion = useSelector((state) => state.anotaciones.verAdminAnotacion);

    // ✅ Obtener también mostrandoResultados
    const { anotaciones, cargando, mostrandoResultados } = useSelector((state) => state.anotaciones);

    const { terminoBusqueda, resultadosBusqueda, cargandoBusqueda } = useSelector((state) => state.busqueda);

    // Obtener los contadores del estado de Redux
    const contadores = useSelector(state => state.tareas.contadores);

    // ✅ useRef para controlar el timeout
    const timeoutRef = useRef(null);

    // Cargar contadores al montar el componente
    useEffect(() => {
        if (verTodosEstados && !cargando) {
            cargarContadores();
        }
    }, [verTodosEstados]);

    const [cargCantEstado, setCargCantEstado] = useState(false);

    const cargarContadores = async () => {
        try {
            /*dispatch(setCargando(true));*/
            setCargCantEstado(true);
            const datos = await obtenerContadores();
            dispatch(setContadores(datos));
            setCargCantEstado(false);
        } catch (error) {
            // El error ya se loguea en el servicio
            setCargCantEstado(false);
            console.error('Error al cargar contadores en el componente:', error);
        }
    };

    // ✅ Cargar anotaciones usando el thunk cuando cambien los filtros
    useEffect(() => {
        if (verContenidoCuerpo) {
            dispatch(cargarAnotaciones());
        } else if (verNotaEliminada) {
            cargarAnotacionesEliminadas();
        }
    }, [verContenidoCuerpo, verNotaEliminada, verSoloFavoritos, verAnotacEstado, ordenAnotaciones, location.pathname, dispatch]);

    // ✅ Controlar cuándo mostrar resultados con delay
    useEffect(() => {
        // Limpiar timeout anterior si existe
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (!cargando && verContenidoCuerpo) {
            // Esperar 200ms después de que termine de cargar antes de mostrar resultados
            timeoutRef.current = setTimeout(() => {
                dispatch(setMostrandoResultados(true));
            }, 200);
        }

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [cargando, verContenidoCuerpo, dispatch]);

    //Cargar anotaciones eliminadas
    const cargarAnotacionesEliminadas = async () => {
        try {
            dispatch(setCargando(true));
            const anotacionesData = await obtenerAnotacionesEliminadas();
            dispatch(setAnotaciones(anotacionesData));
        } catch (error) {
            dispatch(setError('Error al cargar las anotaciones eliminadas'));
        } finally {
            dispatch(setCargando(false));
        }
    }

    // Manejar clic en los estados
    const handleEstadoClick = async (nuevoEstado) => {
        try {
            await dispatch(guardarVerAnotacEstado(nuevoEstado)).unwrap();
            // Las anotaciones se recargarán automáticamente gracias al useEffect

            navigate("/panel-principal");
        } catch (error) {
            console.error('Error al cambiar filtro de estado:', error);
        }
    };

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

    return (
        <>
            {notaNoEliminada && (
                <div className={`w-[95%] h-full mx-auto overflow-y-auto 
                                overflow-x-hidden min-h-0 min-w-0 pb-3
                                grid
                ${organizarPorColumna ? 'grid-cols-2 2xs:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1'} gap-5 lg:gap-3
                ${anotaciones.length === 0 || cargando || !mostrandoResultados ? 'auto-rows-auto' : 'auto-rows-[11rem]'}`}>

                    {verAdminAnotacion && (
                        <AdminAnotacion />
                    )}

                    {verContenidoCuerpo && (
                        <>
                            {/* ✅ Mostrar spinner mientras carga O mientras no se deben mostrar resultados */}
                            {cargando || !mostrandoResultados ? (
                                <CargandoNoHayNada CargandoAnotaciones={true} />

                            ) : anotaciones.length === 0 ? (
                                <CargandoNoHayNada sinEstadoFavoritoNada={true} />
                            ) : (
                                anotaciones.map((anotacion) => (
                                    <NotaVistaPrevia
                                        iconoFavorito={true}
                                        iconoAdministrar={true}
                                        key={anotacion.id}
                                        anotacionId={anotacion.id}
                                        texto={obtenerTextoVistaPrevia(anotacion)}
                                        esFavorito={Boolean(anotacion.favorito)}
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
                                        <HiOutlineBookOpen className="text-6xl md:text-7xl text-black dark:text-white" />
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

                    {verNotaEliminada && (
                        <>
                            {cargCantEstado ? (
                                <CargandoNoHayNada
                                    CargandoAnotaciones={true}
                                />
                            ) : anotaciones.length === 0 ? (
                                <CargandoNoHayNada
                                    noHayEliminadas={true}
                                />
                            ) : (
                                anotaciones.map((anotacion) => (
                                    <NotaVistaPrevia
                                        key={anotacion.id}
                                        anotacionId={anotacion.id}
                                        iconoRestaurarEliminarDefinitivo={true}
                                        texto={obtenerTextoVistaPrevia(anotacion)}
                                        {...obtenerEstadoProps(anotacion.estado)}
                                    />
                                ))
                            )}
                        </>
                    )}
                </div>
            )}

            {verTodosEstados && (
                <div className={`w-[95%] h-full mx-auto overflow-y-auto 
                                overflow-x-hidden min-h-0 min-w-0 pb-3
                                flex flex-col justify-start gap-5`}>

                    <EstadosVistaPrevia
                        iconoEstado={<HiMinusCircle className="text-blue-700" />}
                        tipoEstado="No asignado"
                        cantidadEstado={cargCantEstado ? <CargandoNoHayNada iconoDeCarga={true}/> : contadores.cant_no_asignado}
                        no_asignado={true}
                        seleccionado={verAnotacEstado === 'ver_no_asignado'}
                        onClick={() => handleEstadoClick('ver_no_asignado')}
                    />

                    <EstadosVistaPrevia
                        iconoEstado={<HiClock className="text-yellow-700" />}
                        tipoEstado="Pendiente"
                        cantidadEstado={cargCantEstado ? <CargandoNoHayNada iconoDeCarga={true}/> : contadores.cant_pendiente}
                        pendiente={true}
                        seleccionado={verAnotacEstado === 'ver_pendiente'}
                        onClick={() => handleEstadoClick('ver_pendiente')}
                    />

                    <EstadosVistaPrevia
                        iconoEstado={<HiCheckCircle className="text-green-700" />}
                        tipoEstado="Finalizado"
                        cantidadEstado={cargCantEstado ? <CargandoNoHayNada iconoDeCarga={true}/> : contadores.cant_finalizado}
                        finalizado={true}
                        seleccionado={verAnotacEstado === 'ver_finalizado'}
                        onClick={() => handleEstadoClick('ver_finalizado')}
                    />

                    <EstadosVistaPrevia
                        tipoEstado="Todos los estados"
                        cantidadEstado={cargCantEstado ? <CargandoNoHayNada iconoDeCarga={true}/> : contadores.cant_todos_estados}
                        seleccionado={verAnotacEstado === 'ver_todos_estados'}
                        onClick={() => handleEstadoClick('ver_todos_estados')}
                    />

                </div>
            )}

        </>
    )
}