import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";
import SeccionTerminosPoliticas from "./footer/SeccionTerminosPoliticas";
import Footer from "./footer/Footer";
import ModalRestablecerContrasena from "../../componentes/modal/ModalRestablecerContrasena";

import Toast from "../../componentes/toast/Toast";
import useToastConexion from "../../hooks/useToastConexion";

export default function PaginaRegIniSesion() {
    const location = useLocation();
    const esRegistro = location.pathname === "/registrar";

    const verModalRestablecerContrasena = useSelector((state) => state.acceso.verModalRestablecerContrasena);

    const verToast = useSelector((state) => state.acceso.verToast);

    // ✅ Hook que maneja automáticamente los toasts de conexión
    useToastConexion();

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
        <div className="h-dvh w-full bg-white dark:bg-gray-800 
                        overflow-x-hidden overflow-y-auto
                        flex flex-col justify-between">

            {verToast && (
                <Toast />
            )}

            <AnimatePresence>
                {verModalRestablecerContrasena && (
                    <ModalRestablecerContrasena />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait" custom={esRegistro ? 1 : -1}>
                <motion.div
                    key={location.pathname}
                    custom={esRegistro ? 1 : -1}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit">

                    <Cabecera paginaRegIniSesion={true} />
                    <Cuerpo />

                </motion.div>
            </AnimatePresence>

            <div>
                {esRegistro && (
                    <SeccionTerminosPoliticas />
                )}
                <Footer />
            </div>


        </div>
    );
}