import React, { useRef, useEffect } from "react";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { resetNotaState, setNota, setTareas  } from "../../store/tareasSlice";

import { setAnotacionActual } from "../../store/anotacionesSlice";

import Cabecera from "./cabecera/Cabecera";
import CuerpoEdicion from "../../componentes/cuerpo/CuerpoEdicion";
import ContOpSubCabecera from "../../componentes/cabecera/opcionesSubCabecera/ContOpSubCabecera";

import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";

export default function PaginaVistaPrevia() {

    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams(); // Obtener el ID de la URL
    const location = useLocation();

    const dispatch = useDispatch();
    const notaRef = useRef(null);

    const nota = useSelector((state) => state.tareas.nota);

    const verModalPapeleraNota = useSelector((state) => state.tareas.verModalPapeleraNota);

    // Determinar si estamos en modo vista previa (solo lectura)
    const esModoVistaPrevia = location.pathname.includes('/vista-previa/nota/');

    // Cargar la anotación cuando se monta el componente
    useEffect(() => {
        if (id && esModoVistaPrevia) {
            cargarAnotacion();
        }
    }, [id]);

    const cargarAnotacion = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/anotaciones/obtener/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const anotacion = data.anotacion;
                
                // Guardar en Redux
                dispatch(setAnotacionActual(anotacion));
                dispatch(setNota(anotacion.nota || ""));
                
                // Mapear las tareas de la BD al formato del frontend
                const tareasFormateadas = anotacion.tareas.map(t => ({
                    id: t.id,
                    texto: t.texto_tarea,
                    completada: t.tarea_completada === 1
                }));
                
                dispatch(setTareas(tareasFormateadas));

                // Actualizar los refs con el contenido
                if (notaRef.current) {
                    notaRef.current.textContent = anotacion.nota || "";
                }
            } else {
                console.error('Error al cargar la anotación');
            }
        } catch (error) {
            console.error('Error al cargar la anotación:', error);
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
        <motion.div
            className="h-dvh bg-white dark:bg-gray-800 min-h-0 min-w-0 
                        overflow-hidden relative
                        flex flex-col"
            variants={pageVariants}
            initial="initial"
            animate="animate">
                
            {verModalPapeleraNota && (
                <ModalConfirmacion textoPregunta="¿Desea eliminar la nota?" />
            )}

            <Cabecera 
                esModoVistaPrevia={esModoVistaPrevia}
            />

            <CuerpoEdicion
                ref={notaRef}
                esModoVistaPrevia={esModoVistaPrevia}
            />

            <ContOpSubCabecera />

        </motion.div>
    );
}