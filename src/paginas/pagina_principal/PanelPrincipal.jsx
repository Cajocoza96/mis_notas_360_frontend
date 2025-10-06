import React from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useSelector } from "react-redux";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "../../componentes/cuerpo/Cuerpo"
import ContOpSubCabecera from "../../componentes/cabecera/opcionesSubCabecera/ContOpSubCabecera";
import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";

import MenuHamburguesa from "../../componentes/menu_hamburguesa/MenuHamburguesa";

export default function PanelPrincipal() {

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const verModalCrear = useSelector((state) => state.layout.verModalCrear);

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

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
            className="h-dvh bg-white dark:bg-gray-800 
                        overflow-hidden
                        flex flex-col justify-between"
            variants={pageVariants}
            initial="initial"
            animate="animate">


            {verOpcionesCabecera && (
                <ContOpSubCabecera />
            )}


            {verModalCrear && (
                <ModalConfirmacion textoPregunta="¿Desea crear una nota?" />
            )}

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
                notaBusquedaNotaEliminada={false}
                notaNoEliminada={true}
                verContenidoCuerpo={true}

            />
            <Footer />
        </motion.div>
    );
}