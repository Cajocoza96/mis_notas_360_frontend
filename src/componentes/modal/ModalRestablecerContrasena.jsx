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
                            flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 select-none
                            z-50 p-4 overflow-y-auto rounded-lg
                            w-[75%] 2xs:w-[45%] lg:w-[25%] max-w-md h-auto shadow-2xl
                            flex flex-col gap-3">

                    <div className="flex flex-row justify-between">

                        <p className="text-base md:text-lg text-center
                            text-black dark:text-white font-semibold">
                            Restablecer contraseña
                        </p>

                        <div
                            className="text-2xl md:text-3xl text-red-600 dark:text-red-500
                                flex flex-col items-end">
                            <HiX
                                onClick={handleCerrarModal}
                                className={`cursor-pointer ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>

                    </div>

                    <CorreoContrasena
                        textoContrasena="Nueva contraseña"
                        restablecer={true}
                    />

                </div>

            </motion.div>
        </>
    );
}