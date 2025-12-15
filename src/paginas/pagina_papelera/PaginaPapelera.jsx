import React from "react";

import { useSelector } from "react-redux";

import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";

import { motion, AnimatePresence } from "framer-motion";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "../../componentes/cuerpo/Cuerpo";
import Footer from "../../componentes/footer/Footer";

import ModalExitoError from "../../componentes/modal/ModalExitoError";

import Toast from "../../componentes/toast/Toast";

export default function PaginaPapelera() {

    const verModalRestaurarNota = useSelector((state) => state.tareas.verModalRestaurarNota);

    const verModalEliminarNotaDefinitiva = useSelector((state) => state.tareas.verModalEliminarNotaDefinitiva);

    const verModalEliminarTodasLasNotasDefinitivo = useSelector((state) => state.tareas.verModalEliminarTodasLasNotasDefinitivo);

    const { anotaciones = [] } = useSelector((state) => state.anotaciones);

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
                    <ModalExitoError animado={true}/>
                </AnimatePresence>

                <AnimatePresence>
                    {verModalRestaurarNota && (
                        <ModalConfirmacion
                            textoPregunta="¿Desea restaurar la nota?"
                            restaurarTexto={true}
                            textoAccion="Restaurando nota..."
                            animadoRestaurar={true}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {verModalEliminarNotaDefinitiva && (
                        <ModalConfirmacion
                            textoPregunta="¿Desea eliminar definitivamente la nota?"
                            eliminarPregunta={true}
                            eliminarAceptar={true}
                            textoAccion="Eliminando definitivamente la nota.."
                            animadoEliminar={true}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {verModalEliminarTodasLasNotasDefinitivo && (
                        <ModalConfirmacion
                            textoPregunta={`${anotaciones.length === 1 ? '¿Desea eliminar la nota definitivamente?' : '¿Desea eliminar todas las notas definitivamente?'}`}
                            eliminarPregunta={true}
                            eliminarAceptar={true}
                            textoAccion="Eliminando definitivamente"
                            animadoEliminar={true}
                        />
                    )}
                </AnimatePresence>

                <Cabecera
                    paginaPapelera={true}
                    papelera={true}
                />

                <Cuerpo
                    notaNoEliminada={true}
                    verNotaEliminada={true}

                />

                {anotaciones.length === 0 ? '' :
                    <Footer
                        textoCantElimi={`${anotaciones.length === 0 ? '' : anotaciones.length === 1 ? 'Eliminar nota' : anotaciones.length > 1 ? 'Eliminar todas las notas' : ''}`}
                    />
                }

            </motion.div>
        </AnimatePresence>
    );
}