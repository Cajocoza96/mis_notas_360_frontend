import React, { useRef, useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { resetNotaState, setNota, setTareas, setOrdenTareasSeleccionado } from "../../store/tareasSlice";

import { setAnotacionActual } from "../../store/anotacionesSlice";

import Cabecera from "./cabecera/Cabecera";
import CuerpoEdicion from "../../componentes/cuerpo/CuerpoEdicion";
import ContOpSubCabecera from "../../componentes/cabecera/opcionesSubCabecera/ContOpSubCabecera";

import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";

import { obtenerAnotacionPorId } from "../../services/anotacionesService";

import ModalExitoError from "../../componentes/modal/ModalExitoError";

import SkeletonCrearEditPrevia from "../../componentes/cargando_no_hay_nada/SkeletonCrearEditPrevia";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../utils/errorHandler";

import Toast from "../../componentes/toast/Toast";

import useConexionInternet from "../../hooks/useConexionInternet";

import CargandoNoHayNada from "../../componentes/cargando_no_hay_nada/CargandoNoHayNada";

export default function PaginaVistaPrevia() {
    const { id } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const notaRef = useRef(null);

    // ✅ Estado local simple para controlar la carga
    const [cargando, setCargando] = useState(true);
    // ✅ Estado para controlar si hubo error
    const [errorCarga, setErrorCarga] = useState(false);

    const { isOnline, justReconnected, resetReconnectionState } = useConexionInternet();

    const nota = useSelector((state) => state.tareas.nota);

    const verModalPapeleraNota = useSelector((state) => state.tareas.verModalPapeleraNota);

    const verModalEliminarNotaDefinitiva = useSelector((state) => state.tareas.verModalEliminarNotaDefinitiva);

    // Determinar si estamos en modo vista previa (solo lectura)
    const esModoVistaPrevia = location.pathname.includes('/vista-previa/nota/');

    // Cargar la anotación cuando se monta el componente
    useEffect(() => {
        if (id && esModoVistaPrevia && isOnline) {
            cargarAnotacion();
        }
    }, [id]);

    // ✅ NUEVO: Reintentar cargar cuando se recupere la conexión
    useEffect(() => {
        // Si estaba sin conexión y ahora hay conexión, reintentar carga
        // También reintenta si hubo error previo
        if (isOnline && (cargando || errorCarga) && id && esModoVistaPrevia) {
            cargarAnotacion();
        }
    }, [isOnline, cargando, errorCarga, id, esModoVistaPrevia]);

    const cargarAnotacion = async () => {
        // ✅ CRÍTICO: Si no hay conexión, no intentar cargar
        if (!isOnline) {
            setCargando(true);
            setErrorCarga(false);
            return;
        }

        try {
            setCargando(true);
            setErrorCarga(false);

            const anotacion = await obtenerAnotacionPorId(id);

            // ✅ VALIDACIÓN: Si no existe, redirigir ANTES de actualizar estados
            if (!anotacion || !anotacion.id) {
                errorDesarrollo('❌ Anotación no encontrada');
                navigate('/nota-no-encontrada', { replace: true });
                return;
            }

            // ✅ Primero: Actualizar Redux con toda la información
            dispatch(setAnotacionActual(anotacion));
            dispatch(setNota(anotacion.nota || ""));

            // ✅ IMPORTANTE: Establecer el orden ANTES de cargar las tareas
            dispatch(setOrdenTareasSeleccionado(anotacion.orden_tareas || 'creacion'));

            // Mapear las tareas de la BD al formato del frontend
            const tareasFormateadas = anotacion.tareas.map(t => ({
                id: t.id,
                texto: t.texto_tarea,
                completada: t.tarea_completada === true || t.tarea_completada === 1,
                orden_creacion: t.orden_creacion // ✅ Agregar orden_creacion
            }));

            dispatch(setTareas(tareasFormateadas));

            // ✅ Esperar un momento para que React procese los cambios
            await new Promise(resolve => setTimeout(resolve, 0));

            // ✅ Terminar carga - el ref se llenará automáticamente en CuerpoEdicion
            setCargando(false);
        } catch (error) {
            errorDesarrollo('Error al cargar la anotación para vista previa:', error);
            setErrorCarga(true);
            setCargando(false);
        } finally {
            // ✅ IMPORTANTE: Solo desactivar carga si hubo éxito
            if (isOnline) {
                setCargando(false);
            }
        }
    }

    // Sincronizar estados con Redux (solo si NO estamos en modo vista previa)
    useEffect(() => {
        if (!esModoVistaPrevia) {
            dispatch(setNota(nota));
        }
    }, [nota, dispatch, esModoVistaPrevia]);

    // Limpiar el estado cuando el componente se desmonta
    useEffect(() => {
        return () => {
            dispatch(resetNotaState());
        };
    }, [dispatch]);

    // En caso de error y online volver a cargar cada 3 segundos
    useEffect(() => {
        if(errorCarga && isOnline) {
            setTimeout(() => {
                cargarAnotacion();
            }, 3000);
        }
    })

    // ✅ SOLUCIÓN: Efecto para recargar cuando se restablece la conexión
    useEffect(() => {
        if (justReconnected && id && esModoVistaPrevia) {
            // ✅ CRÍTICO: Forzar estado de carga inmediatamente
            // Esto evita el parpadeo de "sin título"
            setCargando(true);
            setErrorCarga(false);

            // Limpiar Redux para evitar mostrar datos antiguos/vacíos
            dispatch(resetNotaState());

            // Recargar los datos cuando se recupera la conexión
            // Usar setTimeout para asegurar que el estado se actualice primero
            setTimeout(() => {
                cargarAnotacion();
            }, 0);

            // Resetear el estado de reconexión después de un momento
            const timer = setTimeout(() => {
                resetReconnectionState();
            }, 3000);

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

    // ✅ Determinar qué mostrar según el estado
    const renderContenido = () => {
        // Sin conexión o recién reconectado (cargando datos) → mostrar skeleton
        if (!isOnline || (justReconnected && cargando)) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    {!isOnline ? <CargandoNoHayNada /> : <SkeletonCrearEditPrevia />}
                </div>
            );
        }

        // Si está cargando con conexión, mostrar skeleton
        if (cargando && isOnline) {
            return <SkeletonCrearEditPrevia />;
        }

        // ✅ Si hubo error con conexión → mostrar mensaje de error
        if (errorCarga && isOnline) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <CargandoNoHayNada errorCargaInformacion={true} />
                </div>
            );
        }

        // Si no está cargando y no hay error, mostrar el contenido normal
        return (
            <>
                <Cabecera
                    esModoVistaPrevia={esModoVistaPrevia}
                />

                <CuerpoEdicion
                    ref={notaRef}
                    esModoVistaPrevia={esModoVistaPrevia}
                />

                <ContOpSubCabecera />
            </>
        );
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="h-dvh bg-white dark:bg-gray-800 min-h-0 min-w-0 
                        overflow-hidden relative
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

                <AnimatePresence>
                    {verModalPapeleraNota && (
                        <ModalConfirmacion
                            textoPregunta="¿Mover nota a la papelera?"
                            eliminarAceptar={true}
                            textoAccion="Moviendo nota a la papelera..."
                            animadoPapelera={true}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {verModalEliminarNotaDefinitiva && (
                        <ModalConfirmacion
                            textoPregunta="¿Desea eliminar definitivamente la nota?"
                            eliminarPregunta={true}
                            eliminarAceptar={true}
                            textoAccion="Eliminando definitivamente la nota..."
                            animadoEliminar={true}
                        />
                    )}
                </AnimatePresence>

                {renderContenido()}

            </motion.div>
        </AnimatePresence>
    );
}