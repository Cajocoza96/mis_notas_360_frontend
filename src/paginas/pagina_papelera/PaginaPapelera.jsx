import React from "react";

import { motion } from "framer-motion";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "../../componentes/cuerpo/Cuerpo";
import Footer from "../../componentes/footer/Footer";

export default function PaginaPapelera() {

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
                paginaPapelera={true}
                papelera={true}
            />

            <Cuerpo
                notaNoEliminada={false}
                notaBusquedaNotaEliminada={true}
                verNotaEliminada={true}

            />

            <Footer
                eliminarTodo={true}
            />

        </motion.div>
    );
}