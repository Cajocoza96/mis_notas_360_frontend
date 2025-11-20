import React, { useRef, useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { useUndoRedo } from "../../hooks/useUndoRedo";
import { useContentEditable } from "../../hooks/useContentEditable";
import { resetNotaState, setCanUndo, setCanRedo, setTitulo, setNota, setTareas, setAnotacionId, setEstadoSeleccionado } from "../../store/tareasSlice";
import { setAnotacionActual } from "../../store/anotacionesSlice";
import Cabecera from "./cabecera/Cabecera";
import CuerpoEdicion from "../../componentes/cuerpo/CuerpoEdicion";
import Footer from "./footer/Footer";

import ModalEstado from "../../componentes/modal/ModalEstado";

import ModalExitoError from "../../componentes/modal/ModalExitoError";

import { mapearEstadoDesdeBD } from "../../utils/estadoUtils";

import { obtenerAnotacionPorId } from "../../services/anotacionesService";

import SkeletonCrearEditPrevia from "../../componentes/cargando_no_hay_nada/SkeletonCrearEditPrevia";

export default function PaginaCrearEditNota() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const tituloRef = useRef(null);
    const notaRef = useRef(null);

    // ✅ Estado local para los datos cargados
    const [anotacionCargada, setAnotacionCargada] = useState(null);

    // ✅ Estado local simple para controlar la carga
    const [cargando, setCargando] = useState(true);

    const verModalEstado = useSelector((state) => state.tareas.verModalEstado);

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

    // ✅ Cargar la anotación SOLO UNA VEZ al montar
    useEffect(() => {
        const cargarDatos = async () => {
            // ✅ Si NO estamos en modo edición, desactivar carga inmediatamente
            if (!esModoEdicion) {
                setCargando(false);
                return;
            }

            // ✅ Si estamos en modo edición pero no hay ID, error
            if (!id) {
                console.error('❌ Modo edición sin ID');
                setCargando(false);
                return;
            }

            // ✅ Cargar datos en modo edición
            try {
                setCargando(true);
                console.log('🔄 Iniciando carga de anotación...');
                const anotacion = await obtenerAnotacionPorId(id);
                console.log('✅ Anotación obtenida:', anotacion);

                // Guardar en Redux
                dispatch(setAnotacionActual(anotacion));
                dispatch(setAnotacionId(anotacion.id));

                // Mapear el estado
                const estadoMapeado = mapearEstadoDesdeBD(anotacion.estado);
                dispatch(setEstadoSeleccionado(estadoMapeado));

                // Mapear las tareas
                const tareasFormateadas = anotacion.tareas.map(t => ({
                    id: t.id,
                    texto: t.texto_tarea,
                    completada: t.tarea_completada === true || t.tarea_completada === 1
                }));
                dispatch(setTareas(tareasFormateadas));

                // ✅ Guardar la anotación en estado local
                setAnotacionCargada(anotacion);

            } catch (error) {
                console.error('❌ Error al cargar la anotación:', error);
            } finally {
                // ✅ IMPORTANTE: Siempre desactivar carga al finalizar
                setCargando(false);
            }
        };

        cargarDatos();

        // Cleanup
        return () => {
            dispatch(resetNotaState());
        };
    }, [id, esModoEdicion, dispatch]);

    // ✅ Efecto SEPARADO para actualizar los refs cuando la anotación esté lista Y los refs estén montados
    useEffect(() => {
        if (anotacionCargada && tituloRef.current && notaRef.current) {
            console.log('🎯 Actualizando refs con datos de anotación...');

            const tituloInicial = anotacionCargada.titulo || "";
            const notaInicial = anotacionCargada.nota || "";

            // Actualizar los DOM elements PRIMERO
            tituloRef.current.innerText = tituloInicial;
            notaRef.current.innerText = notaInicial;

            console.log('📋 Valores iniciales:', { titulo: tituloInicial, nota: notaInicial });

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
                    console.log('✅ Historial reiniciado con valores iniciales');
                }
            }, 0);
        }
    }, [anotacionCargada, dispatch]);

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

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="h-dvh bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden
                        flex flex-col"
                variants={pageVariants}
                initial="initial"
                animate="animate">

                <ModalExitoError />

                {cargando ? (
                    <SkeletonCrearEditPrevia />
                ) : (
                    <>
                        {verModalEstado && (
                            <ModalEstado />
                        )}

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
                    </>
                )}

            </motion.div>
        </AnimatePresence>
    );
}