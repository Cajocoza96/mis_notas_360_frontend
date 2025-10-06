import React from "react";

import { motion } from "framer-motion";

import Cabecera from "../../componentes/cabecera/Cabecera";

import Cuerpo from "../../componentes/cuerpo/Cuerpo";

export default function PaginaBuscar() {

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
                    className="w-full text-base md:text-xl 
                                border-0 focus:outline-none
                                text-black dark:text-white"
                    placeholder="Notas" />
            </div>

            <Cuerpo
                notaBusquedaNotaEliminada={false}
                notaNoEliminada={true}
                verNotaBusqueda={true}
            />
        </motion.div>
    );
}