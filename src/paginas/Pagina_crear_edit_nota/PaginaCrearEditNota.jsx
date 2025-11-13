import React, { useRef, useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { useUndoRedo } from "../../hooks/useUndoRedo";
import { useContentEditable } from "../../hooks/useContentEditable";
import { resetNotaState, setCanUndo, setCanRedo, setTitulo, setNota, setTareas, setAnotacionId, setEstadoSeleccionado } from "../../store/tareasSlice";
import { setAnotacionActual, setCargando } from "../../store/anotacionesSlice";
import Cabecera from "./cabecera/Cabecera";
import CuerpoEdicion from "../../componentes/cuerpo/CuerpoEdicion";
import Footer from "./footer/Footer";

import ModalEstado from "../../componentes/modal/ModalEstado";

import ModalExitoError from "../../componentes/modal/ModalExitoError";

import { mapearEstadoDesdeBD } from "../../utils/estadoUtils";

import { obtenerAnotacionPorId } from "../../services/anotacionesService";

export default function PaginaCrearEditNota() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const tituloRef = useRef(null);
    const notaRef = useRef(null);
    
    // ✅ Estado local para controlar si los datos ya están listos
    const [datosListos, setDatosListos] = useState(false);

    // Determinar si estamos en modo edición
    const esModoEdicion = location.pathname.includes('/editar/nota/');

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

    // ✅ Activar carga INMEDIATAMENTE al montar el componente en modo edición
    useEffect(() => {
        if (id && esModoEdicion) {
            dispatch(setCargando(true));
            setDatosListos(false);
        } else {
            // Si no es modo edición, los datos ya están "listos"
            setDatosListos(true);
        }
    }, [id, esModoEdicion, dispatch]);

    // Limpiar el historial cuando entramos en modo edición
    useEffect(() => {
        if (esModoEdicion && undoRedoHook.resetHistory) {
            undoRedoHook.resetHistory({ titulo: "", nota: "" });
        }
    }, [esModoEdicion]);

    // Cargar la anotación si estamos en modo edición
    useEffect(() => {
        if (id && esModoEdicion) {
            cargarAnotacionParaEditar();
        }
    }, [id, esModoEdicion]);

    const cargarAnotacionParaEditar = async () => {
        try {
            console.log('🔄 Iniciando carga de anotación...');
            
            const anotacion = await obtenerAnotacionPorId(id);
            
            console.log('✅ Anotación obtenida:', anotacion);

            // Guardar en Redux
            dispatch(setAnotacionActual(anotacion));
            dispatch(setAnotacionId(anotacion.id));

            // Mapear el estado de la BD al formato del frontend
            const estadoMapeado = mapearEstadoDesdeBD(anotacion.estado);
            dispatch(setEstadoSeleccionado(estadoMapeado));

            // Mapear las tareas
            const tareasFormateadas = anotacion.tareas.map(t => ({
                id: t.id,
                texto: t.texto_tarea,
                completada: t.tarea_completada === 1
            }));

            dispatch(setTareas(tareasFormateadas));

            // Actualizar los refs con el contenido DESPUÉS de un pequeño delay
            setTimeout(() => {
                const tituloInicial = anotacion.titulo || "";
                const notaInicial = anotacion.nota || "";

                if (tituloRef.current) {
                    tituloRef.current.textContent = tituloInicial;
                }
                if (notaRef.current) {
                    notaRef.current.textContent = notaInicial;
                }

                // Actualizar Redux DESPUÉS de cargar los refs
                dispatch(setTitulo(tituloInicial));
                dispatch(setNota(notaInicial));

                // Inicializar el historial de deshacer/rehacer
                if (undoRedoHook) {
                    if (undoRedoHook.resetHistory) {
                        undoRedoHook.resetHistory({
                            titulo: tituloInicial,
                            nota: notaInicial
                        });
                    } else if (undoRedoHook.addToHistoryImmediate) {
                        undoRedoHook.addToHistoryImmediate({
                            titulo: tituloInicial,
                            nota: notaInicial
                        });
                    }
                }

                console.log('✅ Datos cargados completamente');
                
                // ✅ Marcar que los datos están listos y desactivar overlay
                setDatosListos(true);
                dispatch(setCargando(false));
            }, 150);

        } catch (error) {
            console.error('❌ Error al cargar la anotación:', error);
            // ✅ Desactivar el overlay incluso si hay error
            setDatosListos(true);
            dispatch(setCargando(false));
        }
    }

    // Sincronizar estados con Redux - Simplificado
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

    // Limpiar el estado cuando el componente se desmonta
    useEffect(() => {
        return () => {
            dispatch(resetNotaState());
            dispatch(setCargando(false));
        };
    }, [dispatch]);

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

    const verModalEstado = useSelector((state) => state.tareas.verModalEstado);

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

    // ✅ NO renderizar los componentes hasta que los datos estén listos en modo edición
    if (esModoEdicion && !datosListos) {
        return null; // El overlay se mostrará mientras esto es null
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="h-dvh bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden
                        flex flex-col"
                variants={pageVariants}
                initial="initial"
                animate="animate">

                {verModalEstado && (
                    <ModalEstado />
                )}

                <ModalExitoError />

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

                <Footer
                    handleUndoClick={handleUndoClickAdapter}
                    handleRedoClick={handleRedoClickAdapter}
                    esModoEdicion={esModoEdicion}
                    tituloRef={tituloRef}
                    notaRef={notaRef}
                />
            </motion.div>
        </AnimatePresence>
    );
}