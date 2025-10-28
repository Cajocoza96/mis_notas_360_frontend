import React from "react";

import { useSelector } from "react-redux";

import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";

import { motion } from "framer-motion";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "../../componentes/cuerpo/Cuerpo";
import Footer from "../../componentes/footer/Footer";

export default function PaginaPapelera() {

    const verModalRestaurarNota = useSelector((state) => state.tareas.verModalRestaurarNota);

    const verModalEliminarNotaDefinitiva = useSelector((state) => state.tareas.verModalEliminarNotaDefinitiva);

    const verModalEliminarTodasLasNotasDefinitivo = useSelector((state) => state.tareas.verModalEliminarTodasLasNotasDefinitivo);

    const { anotaciones } = useSelector((state) => state.anotaciones);

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

            {verModalRestaurarNota && (
                <ModalConfirmacion
                    textoPregunta="¿Desea restaurar la nota?"
                />
            )}

            {verModalEliminarNotaDefinitiva && (
                <ModalConfirmacion
                    textoPregunta="¿Desea eliminar definitivamente la nota?"
                />
            )}

            {verModalEliminarTodasLasNotasDefinitivo && (
                <ModalConfirmacion
                    textoPregunta="¿Desea eliminar todas las notas definitivamente?"
                />
            )}

            <Cabecera
                paginaPapelera={true}
                papelera={true}
            />

            <Cuerpo
                notaNoEliminada={false}
                notaBusquedaNotaEliminada={true}
                verNotaEliminada={true}

            />

            {anotaciones.length === 0 ? '' :
                <Footer
                    eliminarTodo={true}
                />
            }

        </motion.div>
    );
}