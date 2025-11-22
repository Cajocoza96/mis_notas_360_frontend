import React from "react";

import { motion, AnimatePresence } from "framer-motion";

import Cabecera from "../../componentes/cabecera/Cabecera";

export default function PaginaTerminosPoliticas() {

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
                                overflow-hidden
                                flex flex-col justify-between"
                variants={pageVariants}
                initial="initial"
                animate="animate">

                <Cabecera 
                    paginaTerminosPoliticas={true}/>

            </motion.div>
        </AnimatePresence>
    );
}