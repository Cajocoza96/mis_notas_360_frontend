import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVerToast } from "../../../../store/accesoSlice";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import BotonAccion from "../../../../componentes/botones/BotonAccion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import infoRegIniSesion from "../../../../data/infoRegIniSesion.json";
import { registrarUsuario, iniciarSesion } from "../../../../services/authService";

import { toggleVerMenuHamburguesa } from "../../../../store/layoutSlice";

export default function CorreoContrasena({ setMensajeToast }) {
    const [verContrasena, setVerContrasena] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [cargando, setCargando] = useState(false);

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const handleVerContrasena = () => {
        setVerContrasena(!verContrasena);
    };

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const esRegistro = location.pathname === "/registrar";
    const textoBoton = esRegistro ? infoRegIniSesion.registrate.accionBoton : infoRegIniSesion.iniciar.accionBoton;

    const MiBoton = motion.create(BotonAccion);

    const mostrarToast = (mensaje) => {
        setMensajeToast(mensaje);
        dispatch(setVerToast(true));

        setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    const handleSubmit = async () => {
        // Validaciones del frontend
        if (!nombreUsuario && !contrasena) {
            mostrarToast("Ingrese nombre de usuario");
            return;
        }

        if (!nombreUsuario) {
            mostrarToast("Ingrese nombre de usuario");
            return;
        }

        if (!contrasena) {
            mostrarToast("Ingrese contraseña");
            return;
        }

        setCargando(true);

        try {
            if (esRegistro) {
                // Registrar usuario
                await registrarUsuario(nombreUsuario, contrasena);

                if (verMenuHamburguesa) {
                    dispatch(toggleVerMenuHamburguesa());
                }
                navigate("/panel-principal");

            } else {
                // Iniciar sesión
                await iniciarSesion(nombreUsuario, contrasena);

                if (verMenuHamburguesa) {
                    dispatch(toggleVerMenuHamburguesa());
                }
                navigate("/panel-principal");
            }
        } catch (error) {
            // Mostrar mensaje de error del backend
            mostrarToast(error.message || "Error en el servidor");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
                <p className="w-full text-left font-bold text-base md:text-xl 
                            select-none truncate
                        text-black dark:text-white">
                    Nombre de usuario
                </p>

                <div className="border border-gray-300 dark:border-gray-700 rounded-md
                                focus-within:border-blue-600
                                active:bg-gray-200 dark:active:bg-gray-700 
                                flex flex-row items-center justify-between">
                    <input
                        className="w-full text-base md:text-xl p-2
                                focus:outline-none bg-transparent
                                text-black dark:text-white"
                        type="text"
                        placeholder="wanduUsuario123"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        disabled={cargando}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <p className="w-full text-left font-bold text-base md:text-xl
                            select-none truncate
                        text-black dark:text-white">
                    Contraseña
                </p>

                <div className="border border-gray-300 dark:border-gray-700 rounded-md
                                focus-within:border-blue-600 
                                active:bg-gray-200 dark:active:bg-gray-700
                                flex flex-row items-center justify-between">
                    <input
                        className="w-full text-base md:text-xl p-2
                                    focus:outline-none bg-transparent
                                    text-black dark:text-white"
                        type={verContrasena ? "text" : "password"}
                        placeholder="wandu se fue a la guerra"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        disabled={cargando}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !cargando) {
                                handleSubmit();
                            }
                        }}
                    />

                    <div className="text-base md:text-xl mr-2
                        text-black dark:text-white cursor-pointer"
                        onClick={handleVerContrasena}>
                        {verContrasena ? <HiEye /> : <HiEyeOff />}
                    </div>
                </div>
            </div>

            <MiBoton
                className={`bg-blue-700 text-white hover:bg-blue-900 active:bg-blue-600 
                    ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
                accion={cargando ? <FaSpinner className="animate-spin text-base md:text-xl text-white"/> : textoBoton}
                onClick={handleSubmit}
                disabled={cargando}
                whileTap={!cargando ? {
                    scale: 0.96,
                    boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3)"
                } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
        </div>
    );
}