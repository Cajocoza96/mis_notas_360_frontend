import React from "react";

import { motion, AnimatePresence } from "framer-motion";

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

import CargandoNoHayNada from "../../componentes/cargando_no_hay_nada/CargandoNoHayNada";

import { useNavigate } from "react-router-dom";

export default function PaginaInfoUsuario() {
    const dispatch = useDispatch();
    const { usuario, cargando } = useAuth();

    const verModalEliminarUsuario = useSelector((state) => state.acceso.verModalEliminarUsuario);

    const verModalCerrarSesion = useSelector((state) => state.acceso.verModalCerrarSesion);

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const navigate = useNavigate();

    const handleIrTerminosPoliticas = () => navigate("/terminos-de-servicio");

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
            <CargandoNoHayNada pantallaCompletaCarga={true}/>
        );
    }

    return (
        <AnimatePresence mode="wait">
        <motion.div
            className="min-h-dvh bg-white dark:bg-gray-800 
                            overflow-hidden
                            flex flex-col justify-start"
            variants={pageVariants}
            initial="initial"
            animate="animate">
            
            <AnimatePresence>
            {verModalEliminarUsuario && (
                <ModalConfirmacion
                    className="text-red-800 dark:text-red-400"
                    eliminarPregunta={true}
                    eliminarAceptar={true}
                    textoPregunta="¿Desea eliminar la cuenta?" />
            )}
            </AnimatePresence>

            <AnimatePresence>
            {verModalCerrarSesion && (
                <ModalConfirmacion
                    eliminarAceptar={true}
                    textoPregunta="¿Desea cerrar sesión?" />
            )}
            </AnimatePresence>

            <Cabecera
                paginaInfoUsuario={true}
            />

            <div className="flex flex-col gap-1">
                <ContIconoInfoUsua
                    translate="no"
                    className="text-black dark:text-white"
                    iconoInfoUsua={usuario?.imagenPerfil ? (
                        <img
                            translate="no"
                            src={usuario?.imagenPerfil || 'No disponible'}
                            alt={usuario?.nombreCuenta || usuario?.nombreUsuario}
                            className="w-7 h-7 lg:w-9 lg:h-9 rounded-full object-cover" />
                    ) : (
                        <HiOutlineUser className="text-2xl md:text-3xl" />
                    )}

                    titulo={usuario?.nombreCuenta || usuario?.nombreUsuario}
                />

                <ContIconoInfoUsua
                    className="text-black dark:text-white"
                    iconoInfoUsua={<HiOutlineMail />}
                    titulo="Correo electrónico"
                    texto={usuario?.email
                        ? <span translate="no">{usuario.email}</span>
                        : 'No disponible'}
                />

                <ContIconoInfoUsua
                    className="text-black dark:text-white"
                    iconoInfoUsua={<HiOutlinePhone />}
                    titulo="Número de teléfono"
                    texto="No disponible"
                />

                <ContIconoInfoUsua
                    onClick={handleIrTerminosPoliticas}
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
            </div>

        </motion.div>
        </AnimatePresence>
    );
}