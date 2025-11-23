import React from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useLocation } from "react-router-dom";

import Cabecera from "../../componentes/cabecera/Cabecera";

import infoTerminosPoliticas from "../../data/infoTerminosPoliticas.json";

import Cuerpo from "./cuerpo/Cuerpo";

import Footer from "./footer/Footer";

export default function PaginaTerminosPoliticas() {

    const inforTermPol = infoTerminosPoliticas.seccionTerminosPoliticas;

    const location = useLocation();

    const esTerminoDeServicio = location.pathname === "/terminos-de-servicio";

    const pageVariants = {
        initial: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                type: "tween",
                ease: "easeInOut",
                duration: 0.5
            }
        },
        exit: (direction) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0,
            transition: {
                type: "tween",
                ease: "easeInOut",
                duration: 0.5
            }
        })
    };

    return (
        <div className="h-dvh bg-white dark:bg-gray-800 
                        overflow-hidden
                        flex flex-col justify-between">

            <AnimatePresence mode="wait" custom={esTerminoDeServicio ? 1 : -1}>
                <motion.div
                    key={location.pathname}
                    custom={esTerminoDeServicio ? 1 : -1}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex-shrink-0">

                    <Cabecera
                        tituloTerminoPolitica={esTerminoDeServicio ? inforTermPol.texto2Terminos : inforTermPol.texto6Politicas}
                        irATerminoPolitica={esTerminoDeServicio ? inforTermPol.texto6Politicas : inforTermPol.texto2Terminos}
                        paginaTerminosPoliticas={true} />

                </motion.div>
            </AnimatePresence>



            <AnimatePresence mode="wait" custom={esTerminoDeServicio ? 1 : -1}>
                <motion.div
                    key={location.pathname}
                    custom={esTerminoDeServicio ? 1 : -1}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="h-full overflow-y-auto">

                    <Cuerpo />

                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait" custom={esTerminoDeServicio ? 1 : -1}>
                <motion.div
                    key={location.pathname}
                    custom={esTerminoDeServicio ? 1 : -1}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex-shrink-0 z-20">

                    <Footer />

                </motion.div>
            </AnimatePresence>

        </div>
    );
}