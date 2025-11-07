import React from "react";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import {
    HiOutlineUser, HiOutlineExclamationCircle,
    HiOutlineLogout, HiOutlineMail, HiOutlinePhone, HiOutlineInformationCircle
} from "react-icons/hi";

import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";
import Cabecera from "../../componentes/cabecera/Cabecera";

import { toggleVerModalEliminarUsuario, toggleVerModalCerrarSesion } from "../../store/accesoSlice";

import { toggleVerMenuHamburguesa } from "../../store/layoutSlice";

import ContIconoInfoUsua from "../../componentes/admin_usuario/cont_icono_info_usua/ContIconoInfoUsua";

export default function PaginaInfoUsuario() {
    const dispatch = useDispatch();
    const { usuario, cargando } = useAuth();

    const verModalEliminarUsuario = useSelector((state) => state.acceso.verModalEliminarUsuario);

    const verModalCerrarSesion = useSelector((state) => state.acceso.verModalCerrarSesion);

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const handleEliminarCuenta = () => {
        if (verMenuHamburguesa) {
            dispatch(toggleVerMenuHamburguesa());
        }
        dispatch(toggleVerModalEliminarUsuario());
    };

    const handleCerrarSesion = () => {
        if (verMenuHamburguesa) {
            dispatch(toggleVerMenuHamburguesa());
        }
        dispatch(toggleVerModalCerrarSesion());
    };


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

    if (cargando) {
        return (
            <div className="flex flex-col justify-center p-2">
                <div className="text-black dark:text-white p-2 select-none flex flex-row items-center gap-2">
                    <HiOutlineUser className="text-2xl md:text-3xl" />
                    <p className="truncate text-base md:text-xl">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-dvh bg-white dark:bg-gray-800 
                            overflow-hidden
                            flex flex-col justify-start"
            variants={pageVariants}
            initial="initial"
            animate="animate">

            {verModalEliminarUsuario && (
                <ModalConfirmacion 
                className="text-red-800 dark:text-red-400"
                eliminarPregunta={true}
                eliminarAceptar={true}
                textoPregunta="¿Desea eliminar la cuenta?" />
            )}

            {verModalCerrarSesion && (
                <ModalConfirmacion 
                eliminarAceptar={true}
                textoPregunta="¿Desea cerrar sesión?" />
            )}

            <Cabecera
                paginaInfoUsuario={true}
            />

            <ContIconoInfoUsua
                className="text-black dark:text-white"
                iconoInfoUsua={usuario?.imagenPerfil ? (
                    <img
                        src={usuario?.imagenPerfil || 'No disponible'}
                        alt={usuario?.nombreCuenta || usuario?.nombreUsuario || 'Usuario'}
                        className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <HiOutlineUser className="text-2xl md:text-3xl" />
                )}

                titulo={usuario?.nombreCuenta || usuario?.nombreUsuario || 'Usuario'}
            />

            <ContIconoInfoUsua
                className="text-black dark:text-white"
                iconoInfoUsua={<HiOutlineMail />}
                titulo="Correo electrónico"
                texto={usuario?.email || 'No disponible'}
            />

            <ContIconoInfoUsua
                className="text-black dark:text-white"
                iconoInfoUsua={<HiOutlinePhone />}
                titulo="Número de teléfono"
                texto="No disponible"
            />

            <ContIconoInfoUsua
                className="text-black dark:text-white cursor-pointer
                            hover:bg-gray-300 active:bg-gray-300
                            dark:hover:bg-gray-700 dark:active:bg-gray-700
                            rounded-md transition-colors duration-200"
                iconoInfoUsua={<HiOutlineInformationCircle />}
                titulo="Acerca de"
            />

            {/*Eliminar cuenta*/}
            <ContIconoInfoUsua
                onClick={handleEliminarCuenta}
                className="text-red-600 cursor-pointer 
                            hover:bg-red-200 active:bg-red-200
                            dark:hover:bg-red-900/30 dark:active:bg-red-900/30
                            rounded-md transition-colors duration-200"
                iconoInfoUsua={<HiOutlineExclamationCircle />}
                titulo="Eliminar cuenta"

            />


            {/* Cerrar sesión */}
            <ContIconoInfoUsua
                onClick={handleCerrarSesion}
                className="text-red-600 cursor-pointer 
                            hover:bg-red-200 active:bg-red-200
                            dark:hover:bg-red-900/30 dark:active:bg-red-900/30
                            rounded-md transition-colors duration-200"
                iconoInfoUsua={<HiOutlineLogout />}
                titulo="Cerrar sesión"

            />

        </motion.div>
    );
}