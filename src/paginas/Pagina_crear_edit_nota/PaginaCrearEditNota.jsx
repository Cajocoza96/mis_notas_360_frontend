import React, { useRef, useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useUndoRedo } from "../../hooks/useUndoRedo";
import { useContentEditable } from "../../hooks/useContentEditable";
import { resetNotaState, setCanUndo, setCanRedo, setTitulo, setNota, setTareas, setAnotacionId, setEstadoSeleccionado, setOrdenTareasSeleccionado } from "../../store/tareasSlice";
import { setAnotacionActual } from "../../store/anotacionesSlice";
import Cabecera from "./cabecera/Cabecera";
import CuerpoEdicion from "../../componentes/cuerpo/CuerpoEdicion";
import Footer from "./footer/Footer";
import OrdenarTareasPor from "./ordenar_tareas_por/OrdenarTareasPor";
import CantidadTituloNota from "./cantidad_titulo_nota/CantidadTituloNota";

import ModalEstado from "../../componentes/modal/ModalEstado";

import ModalOrdenarTareas from "../../componentes/modal/ModalOrdenarTareas";

import ModalModosIA from "../../componentes/modal/ModalModosIA";

import ModalExitoError from "../../componentes/modal/ModalExitoError";

import { mapearEstadoDesdeBD } from "../../utils/estadoUtils";

import { obtenerAnotacionPorId } from "../../services/anotacionesService";

import SkeletonCrearEditPrevia from "../../componentes/cargando_no_hay_nada/SkeletonCrearEditPrevia";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../utils/errorHandler";

import Toast from "../../componentes/toast/Toast";

import useReintentoInteligente from "../../hooks/useReintentoInteligente";

import useConexionInternet from "../../hooks/useConexionInternet";

import CargandoNoHayNada from "../../componentes/cargando_no_hay_nada/CargandoNoHayNada";

export default function PaginaCrearEditNota() {

    // ✅ Hook de reintento inteligente
    const {
        ejecutarConReintento,
        resetearIntentos,
        limpiar,
        obtenerIntentos,
        obtenerIntentosRestantes,
        intentosActuales,
        intentosAgotados
    } = useReintentoInteligente();

    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const tituloRef = useRef(null);
    const notaRef = useRef(null);

    const navigate = useNavigate();

    // ✅ Estado para controlar si la anotación fue validada
    const [anotacionValidada, setAnotacionValidada] = useState(false);

    // ✅ Estado local para los datos cargados
    const [anotacionCargada, setAnotacionCargada] = useState(null);

    // ✅ Estado local simple para controlar la carga
    const [cargando, setCargando] = useState(true);

    // ✅ NUEVO: Estado para controlar errores de carga
    const [errorCarga, setErrorCarga] = useState(false);

    const { isOnline, justReconnected, resetReconnectionState } = useConexionInternet();

    const verModalEstado = useSelector((state) => state.tareas.verModalEstado);

    const verModalOrdenTareas = useSelector((state) => state.tareas.verModalOrdenTareas);

    const verModalModosIA = useSelector((state) => state.tareas.verModalModosIA);

    // Determinar si estamos en modo edición
    const esModoEdicion = location.pathname.includes('/editar/nota/');
    const esModoCrear = location.pathname.includes('/agregar-nota');

    // Usar el hook de deshacer/rehacer con estado inicial vacío
    const undoRedoHook = useUndoRedo({ titulo: "", nota: "" });

    // Usar el hook de contentEditable
    const {
        titulo,
        nota,
        canUndo,
        canRedo,
        handleTituloChange,
        handleNotaChange,
        handleTituloKeyDown,
        handleNotaKeyDown,
        handleUndoClick,
        handleRedoClick
    } = useContentEditable({ titulo: "", nota: "" }, undoRedoHook);

    // ✅ Cargar la anotación SOLO UNA VEZ al montar
    useEffect(() => {
        const cargarDatos = async () => {
            // ✅ Si NO estamos en modo edición, desactivar carga inmediatamente
            if (!esModoEdicion) {
                setAnotacionValidada(true);
                setCargando(false);
                setErrorCarga(false);
                return;
            }

            // ✅ Si estamos en modo edición pero no hay ID, error
            if (!id) {
                errorDesarrollo('❌ Modo edición sin ID');
                setCargando(false);
                setErrorCarga(false);
                navigate('/nota-no-encontrada', { replace: true });
                return;
            }

            // ✅ Si no hay conexión en modo edición, mantener el estado de carga
            if (!isOnline) {
                logDesarrollo('⚠️ Sin conexión - manteniendo estado de carga');
                setCargando(true);
                setErrorCarga(false);
                return;
            }

            // ✅ Cargar datos en modo edición
            try {
                setCargando(true);
                setErrorCarga(false);
                logDesarrollo('🔄 Iniciando carga de anotación...');
                const anotacion = await obtenerAnotacionPorId(id);

                // ✅ VALIDACIÓN: Si no existe, redirigir ANTES de actualizar estados
                if (!anotacion || !anotacion.id) {
                    errorDesarrollo('❌ Anotación no encontrada');
                    navigate('/nota-no-encontrada', { replace: true });
                    return;
                }

                logDesarrollo('✅ Anotación obtenida:', anotacion);

                // Guardar en Redux
                dispatch(setAnotacionActual(anotacion));
                dispatch(setAnotacionId(anotacion.id));

                // Mapear el estado
                const estadoMapeado = mapearEstadoDesdeBD(anotacion.estado);
                dispatch(setEstadoSeleccionado(estadoMapeado));

                //Aqui lo puse
                dispatch(setOrdenTareasSeleccionado(anotacion.orden_tareas || 'creacion'));

                // Mapear las tareas
                const tareasFormateadas = anotacion.tareas.map(t => ({
                    id: t.id,
                    texto: t.texto_tarea,
                    completada: t.tarea_completada === true || t.tarea_completada === 1,
                    orden_creacion: t.orden_creacion // ✅ Agregar orden_creacion
                }));

                logDesarrollo('Tareas formateadas con orden_creacion:', tareasFormateadas);

                dispatch(setTareas(tareasFormateadas));

                // ✅ Guardar la anotación en estado local
                setAnotacionCargada(anotacion);
                setAnotacionValidada(true);
                setErrorCarga(false);
                resetearIntentos(); // ✅ Resetear intentos en éxito
                setCargando(false);
            } catch (error) {
                errorDesarrollo('❌ Error al cargar la anotación:', error);
                setCargando(false);
                setErrorCarga(true);

                // ✅ Ejecutar reintento inteligente
                ejecutarConReintento(
                    cargarDatos,
                    isOnline,
                    (mensaje) => {
                        setErrorCarga(true);
                        errorDesarrollo(mensaje);
                    }
                );

            } finally {
                // ✅ IMPORTANTE: Solo desactivar carga si hubo éxito
                if (isOnline) {
                    setCargando(false);
                }
            }
        };

        cargarDatos();

        // Cleanup
        return () => {
            dispatch(resetNotaState());
        };
    }, [id, esModoEdicion, isOnline, dispatch]);

    // ✅ Efecto SEPARADO para actualizar los refs cuando la anotación esté lista Y los refs estén montados
    useEffect(() => {
        if (anotacionValidada && anotacionCargada && tituloRef.current && notaRef.current) {
            logDesarrollo('🎯 Actualizando refs con datos de anotación...');

            const tituloInicial = anotacionCargada.titulo || "";
            const notaInicial = anotacionCargada.nota || "";

            // Actualizar los DOM elements PRIMERO
            tituloRef.current.innerText = tituloInicial;
            notaRef.current.innerText = notaInicial;

            logDesarrollo('📋 Valores iniciales:', { titulo: tituloInicial, nota: notaInicial });

            // Actualizar Redux
            dispatch(setTitulo(tituloInicial));
            dispatch(setNota(notaInicial));

            // ✅ CRÍTICO: Esperar un tick antes de resetear el historial
            // para asegurar que los elementos DOM estén actualizados
            setTimeout(() => {
                if (undoRedoHook?.resetHistory) {
                    undoRedoHook.resetHistory({
                        titulo: tituloInicial,
                        nota: notaInicial
                    });
                    logDesarrollo('✅ Historial reiniciado con valores iniciales');
                }
            }, 0);
        }
    }, [anotacionValidada, anotacionCargada, dispatch]);

    // ✅ Efecto para resetear intentos al cambiar de ruta
    useEffect(() => {
        resetearIntentos();
    }, [location.pathname]);

    // ✅ Limpiar timeouts al desmontar
    useEffect(() => {
        return () => {
            limpiar();
        };
    }, []);

    useEffect(() => {
        if (justReconnected) {
            setErrorCarga(false);
            resetearIntentos(); // ✅ Resetear intentos al reconectar
        }
    }, [justReconnected]);

    // Limpiar el historial cuando entramos en modo edición
    useEffect(() => {
        if (esModoEdicion && undoRedoHook?.resetHistory) {
            undoRedoHook.resetHistory({ titulo: "", nota: "" });
        }
    }, [esModoEdicion]);

    // Sincronizar estados con Redux
    useEffect(() => {
        dispatch(setCanUndo(canUndo));
        dispatch(setCanRedo(canRedo));
    }, [canUndo, canRedo, dispatch]);

    // Sincronizar título y nota con Redux cuando cambian desde los hooks
    useEffect(() => {
        if (titulo !== undefined && titulo !== null) {
            dispatch(setTitulo(titulo));
        }
    }, [titulo, dispatch]);

    useEffect(() => {
        if (nota !== undefined && nota !== null) {
            dispatch(setNota(nota));
        }
    }, [nota, dispatch]);

    // Funciones adaptadas para trabajar con las referencias locales
    const handleTituloChangeAdapter = (ref) => {
        handleTituloChange(ref);
    };

    const handleNotaChangeAdapter = (ref) => {
        handleNotaChange(ref);
    };

    const handleTituloKeyDownAdapter = (e, ref) => {
        handleTituloKeyDown(e, ref, notaRef);
    };

    const handleNotaKeyDownAdapter = (e, ref) => {
        handleNotaKeyDown(e, tituloRef, ref);
    };

    const handleUndoClickAdapter = () => {
        handleUndoClick(tituloRef, notaRef);
    };

    const handleRedoClickAdapter = () => {
        handleRedoClick(tituloRef, notaRef);
    };

    const [reload, setReload] = useState(false);

    const recargarComponente = () => {
        setReload(prev => !prev);
    }

    // Efecto para recargar pagina cuando se restablece la conexión
    useEffect(() => {
        if (justReconnected) {

            recargarComponente();

            // Esperar un momento antes de resetear el estado de reconexión
            const timer = setTimeout(() => {
                resetReconnectionState();
            }, 3000); // El mensaje desaparecerá después de 3 segundos

            return () => clearTimeout(timer);
        }
    }, [justReconnected]);

    const verToast = useSelector((state) => state.acceso.verToast);

    const pageVariants = {
        initial: {
            x: "100%",
            opacity: 0
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 130,
                damping: 20,
                mass: 0.8,
                duration: 0.5
            }
        }
    }

    // ✅ Logica: Determinar qué mostrar
    const mostrarSkeleton = cargando && isOnline;
    const mostrarSinConexion = !isOnline && (cargando || esModoEdicion || esModoCrear);
    const mostrarError = errorCarga && isOnline;
    const mostrarContenido = anotacionValidada && !mostrarSkeleton && !mostrarSinConexion;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="h-dvh bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden
                        flex flex-col"
                variants={pageVariants}
                initial="initial"
                animate="animate">

                {verToast && (
                    <Toast />
                )}

                <AnimatePresence>
                    <ModalExitoError animado={true} />
                </AnimatePresence>

                {mostrarSkeleton ? (
                    <SkeletonCrearEditPrevia />
                ) : mostrarSinConexion ? (

                    <div className="flex-1 flex items-center justify-center">
                        <CargandoNoHayNada />
                    </div>
                ) : mostrarError ? (
                    <div className="flex-1 flex items-center justify-center">
                        <CargandoNoHayNada errorCargaInformacion={true} />
                    </div>
                ) : mostrarContenido ? (
                    <>
                        <AnimatePresence>
                            {verModalEstado && (
                                <ModalEstado />
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {verModalOrdenTareas && (
                                <ModalOrdenarTareas />
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {verModalModosIA && (
                                <ModalModosIA />
                            )}
                        </AnimatePresence>

                        <Cabecera
                            ref={tituloRef}
                            handleTituloChange={handleTituloChangeAdapter}
                            handleTituloKeyDown={handleTituloKeyDownAdapter}
                        />

                        <CuerpoEdicion
                            ref={notaRef}
                            handleNotaChange={handleNotaChangeAdapter}
                            handleNotaKeyDown={handleNotaKeyDownAdapter}
                            esModoVistaPrevia={false}
                        />

                        <OrdenarTareasPor />

                        <CantidadTituloNota />

                        <Footer
                            handleUndoClick={handleUndoClickAdapter}
                            handleRedoClick={handleRedoClickAdapter}
                            esModoEdicion={esModoEdicion}
                            tituloRef={tituloRef}
                            notaRef={notaRef}
                        />
                    </>
                    
                ) : null}

            </motion.div>
        </AnimatePresence>
    );
}