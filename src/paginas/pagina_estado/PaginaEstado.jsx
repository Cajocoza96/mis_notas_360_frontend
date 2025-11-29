import React from "react";

import { useSelector } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";

import Cabecera from "../../componentes/cabecera/Cabecera";

import Cuerpo from "../../componentes/cuerpo/Cuerpo";

import Toast from "../../componentes/toast/Toast";
import useToastConexion from "../../hooks/useToastConexion";

export default function PaginaEstado() {

    const verToast = useSelector((state) => state.acceso.verToast);

    // ✅ Hook que maneja automáticamente los toasts de conexión
    useToastConexion();

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
                className="h-dvh bg-white dark:bg-gray-800 
                        min-h-0 min-w-0 overflow-hidden 
                        flex flex-col"
                variants={pageVariants}
                initial="initial"
                animate="animate">

                {verToast && (
                    <Toast />
                )}

                <Cabecera
                    paginaEstado={true}
                />

                <Cuerpo
                    verTodosEstados={true}
                />

            </motion.div>
        </AnimatePresence>
    );
}