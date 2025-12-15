import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { HiX } from "react-icons/hi";
import { toggleVerModalRestablecerContrasena, setVerToast } from "../../store/accesoSlice";

import CorreoContrasena from "../../paginas/pagina_reg_ini_sesion/cuerpo/correo_contrasena/CorreoContrasena";

import { motion } from "framer-motion";

export default function ModalRestablecerContrasena() {

    const dispatch = useDispatch();

    const [cargando] = useState(false);

    const handleCerrarModal = () => {
        if (!cargando) {
            dispatch(toggleVerModalRestablecerContrasena());

            dispatch(setVerToast(false));
        }
    };

    return (
        <>
            <motion.div
            onClick={handleCerrarModal}
            className="fixed inset-0 z-50 bg-black/70
                        flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>

            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800
                        z-50 rounded-lg shadow-2xl
                        w-[80%] 2xs:w-[45%] lg:w-[25%]
                        max-h-[90vh] flex flex-col">

                {/* Header fijo (no hace scroll) */}
                <div className="flex flex-row justify-between items-start
                                p-4 border-b border-gray-200 dark:border-gray-700
                                flex-shrink-0">

                    <p className="text-base md:text-lg
                                text-black dark:text-white font-semibold">
                        Restablecer contraseña
                    </p>

                    <div className="text-2xl md:text-3xl text-red-600 dark:text-red-500">
                        <HiX
                            onClick={handleCerrarModal}
                            className={`cursor-pointer ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                </div>

                {/* Contenido con scroll */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden
                                p-4 min-h-0">

                    <CorreoContrasena
                        textoContrasena="Nueva contraseña"
                        restablecer={true}
                    />

                </div>

            </div>

        </motion.div>
        </>
    );
}