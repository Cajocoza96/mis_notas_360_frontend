import React, { useState, useEffect, useRef } from "react";

import { motion } from "framer-motion";

import { useDispatch } from "react-redux";

import Cabecera from "../../componentes/cabecera/Cabecera";

import Cuerpo from "../../componentes/cuerpo/Cuerpo";

import {
    setTerminoBusqueda, setResultadosBusqueda,
    setCargandoBusqueda, limpiarBusqueda
} from "../../store/busquedaSlice";

import { buscarAnotaciones  as buscarAnotacionesService } from "../../services/anotacionesService";

export default function PaginaBuscar() {

    const [inputValue, setInputValue] = useState('');
    const debounceTimer = useRef(null);
    const dispatch = useDispatch();

    // Limpiar búsqueda al montar/desmontar componente
    useEffect(() => {
        return () => {
            dispatch(limpiarBusqueda());
        };
    }, [dispatch]);

    // Función de búsqueda
    const buscarAnotaciones = async (termino) => {
        if (!termino || termino.trim() === '') {
            dispatch(setResultadosBusqueda([]));
            dispatch(setTerminoBusqueda(''));
            return;
        }

        try {
            dispatch(setCargandoBusqueda(true));
            
            const anotaciones = await buscarAnotacionesService(termino);
            
            dispatch(setResultadosBusqueda(anotaciones));
            dispatch(setTerminoBusqueda(termino));
        } catch (error) {
            console.error('Error en búsqueda:', error);
            // Opcional: podrías mostrar un mensaje de error al usuario
            dispatch(setResultadosBusqueda([]));
        } finally {
            dispatch(setCargandoBusqueda(false));
        }
    };

    // Manejar cambios en el input con debounce
    const handleInputChange = (e) => {
        const valor = e.target.value;
        setInputValue(valor);

        // Limpiar el timer anterior
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Crear nuevo timer para buscar después de 300ms
        debounceTimer.current = setTimeout(() => {
            buscarAnotaciones(valor);
        }, 300);
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
        <motion.div
            className="h-dvh bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden 
                        flex flex-col"
            variants={pageVariants}
            initial="initial"
            animate="animate">

            <Cabecera
                paginaBusqueda={true}
                paginaPrincipal={false}
                paginaPapelera={false}
            />

            <div className="w-[95%] mx-auto mb-3">

                <input
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full text-base md:text-xl 
                                border-0 focus:outline-none
                                text-black dark:text-white"
                    placeholder="Buscar contenido en anotacion..."
                />
            </div>

            <Cuerpo
                notaBusquedaNotaEliminada={false}
                notaNoEliminada={true}
                verNotaBusqueda={true}
            />
        </motion.div>
    );
}