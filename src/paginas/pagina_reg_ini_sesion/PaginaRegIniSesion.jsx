import React from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useLocation } from "react-router-dom";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";

import Footer from "./footer/Footer";

export default function PaginaRegIniSesion() {

    const location = useLocation();

    const esRegistro = location.pathname === "/registrar";

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
    }

    return (
        <div className="min-h-dvh w-full bg-white dark:bg-gray-800 
                        overflow-x-hidden overscroll-none
                        flex flex-col justify-between">

            <AnimatePresence mode="wait" custom={esRegistro ? 1 : -1}>
                <motion.div
                    key={location.pathname}
                    custom={esRegistro ? 1 : -1}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex-1 min-h-0">

                    <Cabecera
                        paginaRegIniSesion={true}
                    />
                    <Cuerpo />

                </motion.div>
            </AnimatePresence>

            <Footer />
        </div>
    );
}