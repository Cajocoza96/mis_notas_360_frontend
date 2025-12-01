import React from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useSelector } from "react-redux";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "../../componentes/cuerpo/Cuerpo"
import ContOpSubCabecera from "../../componentes/cabecera/opcionesSubCabecera/ContOpSubCabecera";
import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";

import MenuHamburguesa from "../../componentes/menu_hamburguesa/MenuHamburguesa";

import ModalExitoError from "../../componentes/modal/ModalExitoError";

import Toast from "../../componentes/toast/Toast";

export default function PanelPrincipal() {
    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const verModalCrearNota = useSelector((state) => state.tareas.verModalCrearNota);
    const verModalPapeleraNota = useSelector((state) => state.tareas.verModalPapeleraNota);
    const verModalEliminarNotaDefinitiva = useSelector((state) => state.tareas.verModalEliminarNotaDefinitiva);

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const verToast = useSelector((state) => state.acceso.verToast);

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

                {verToast && (
                    <Toast />
                )}

                <AnimatePresence>
                    <ModalExitoError />
                </AnimatePresence>

                {verOpcionesCabecera && (
                    <ContOpSubCabecera />
                )}

                <AnimatePresence>
                    {verModalCrearNota && (
                        <ModalConfirmacion textoPregunta="¿Desea crear una nota?" />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {verModalPapeleraNota && (
                        <ModalConfirmacion
                            textoPregunta="¿Mover nota a la papelera?"
                            eliminarAceptar={true} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {verModalEliminarNotaDefinitiva && (
                        <ModalConfirmacion
                            textoPregunta="¿Desea eliminar definitivamente la nota?"
                            eliminarPregunta={true}
                            eliminarAceptar={true} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {verMenuHamburguesa && (
                        <MenuHamburguesa />
                    )}
                </AnimatePresence>

                <Cabecera
                    paginaPrincipal={true}
                    paginaBusqueda={false}
                    paginaPapelera={false} />

                <Cuerpo
                    notaNoEliminada={true}
                    verContenidoCuerpo={true}
                />

                <Footer />
            </motion.div>
        </AnimatePresence>
    );
}