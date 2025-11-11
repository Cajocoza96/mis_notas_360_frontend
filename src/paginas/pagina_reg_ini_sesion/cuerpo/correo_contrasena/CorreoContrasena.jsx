import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVerToast, setMensajeToast, toggleVerModalRestablecerContrasena } from "../../../../store/accesoSlice";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import BotonAccion from "../../../../componentes/botones/BotonAccion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import infoRegIniSesion from "../../../../data/infoRegIniSesion.json";
import { registrarUsuario, iniciarSesion } from "../../../../services/authService";

import { restablecerContrasena } from "../../../../services/authService";

import { toggleVerMenuHamburguesa } from "../../../../store/layoutSlice";

export default function CorreoContrasena({ textoContrasena, restablecer, noRestablecer }) {
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
        dispatch(setMensajeToast(mensaje));
        dispatch(setVerToast(true));

        setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    const handleCerrarModal = () => {
        if (!cargando) {
            dispatch(toggleVerModalRestablecerContrasena());
            // Limpiar campos
            setNombreUsuario("");
            setContrasena("");
            setVerContrasena(false);

            dispatch(setVerToast(false));
        }
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
                navigate("/");

            } else {
                // Iniciar sesión
                await iniciarSesion(nombreUsuario, contrasena);

                if (verMenuHamburguesa) {
                    dispatch(toggleVerMenuHamburguesa());
                }
                navigate("/");
            }
        } catch (error) {
            // Mostrar mensaje de error del backend
            mostrarToast(error.message || "Error en el servidor");
        } finally {
            setCargando(false);
        }
    };

    const handleRestablecerContrasena = async () => {
        // Validaciones
        if (!nombreUsuario.trim()) {
            mostrarToast("Por favor ingresa tu nombre de usuario", "error");
            return;
        }

        if (!contrasena.trim()) {
            mostrarToast("Por favor ingresa tu nueva contraseña", "error");
            return;
        }

        if (contrasena.length < 6) {
            mostrarToast("La contraseña debe tener al menos 6 caracteres", "error");
            return;
        }

        setCargando(true);

        try {
            await restablecerContrasena(nombreUsuario, contrasena);

            mostrarToast("Contraseña restablecida exitosamente", "success");

            // Cerrar modal después de 1 segundo
            setTimeout(() => {
                handleCerrarModal();
            }, 1000);

        } catch (error) {
            const mensajeError = error.message || "Error al restablecer contraseña";
            mostrarToast(mensajeError, "error");
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
                                focus-within:border-violet-800
                                active:bg-gray-200 dark:active:bg-gray-700 
                                flex flex-row items-center justify-between">
                    <input
                        className="w-full text-base md:text-xl p-2
                                focus:outline-none bg-transparent
                                text-black dark:text-white"
                        type="text"
                        placeholder="Ejemplo: Carlitos"
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
                    {textoContrasena}
                </p>

                <div className="border border-gray-300 dark:border-gray-700 rounded-md
                                focus-within:border-violet-800 
                                active:bg-gray-200 dark:active:bg-gray-700
                                flex flex-row items-center justify-between">

                    {noRestablecer && (
                        <input
                            className="w-full text-base md:text-xl p-2
                                    focus:outline-none bg-transparent
                                    text-black dark:text-white"
                            type={verContrasena ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            disabled={cargando}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !cargando) {
                                    handleSubmit();
                                }
                            }}
                        />
                    )}

                    {restablecer && (
                        <input
                            className="w-full text-base md:text-lg p-2
                            focus:outline-none bg-transparent
                            text-black dark:text-white"
                            type={verContrasena ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            disabled={cargando}
                        />
                    )}


                    <div className="text-base md:text-xl mr-2
                        text-black dark:text-white cursor-pointer"
                        onClick={handleVerContrasena}>
                        {verContrasena ? <HiEye /> : <HiEyeOff />}
                    </div>
                </div>
            </div>

            {noRestablecer && (
                <MiBoton
                    className={`bg-violet-800 text-white hover:bg-violet-800 active:bg-violet-800 
                    ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
                    accion={cargando ? <FaSpinner className="animate-spin text-base md:text-xl text-white" /> : textoBoton}
                    onClick={handleSubmit}
                    disabled={cargando}
                    whileTap={!cargando ? {
                        scale: 0.96,
                        boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3)"
                    } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                />
            )}

            {restablecer && (
                <>
                    <MiBoton
                        className={`w-full bg-violet-800 text-white hover:bg-violet-800 active:bg-violet-800 
                                ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
                        accion={cargando ? 'Restableciendo...' : 'Restablecer contraseña'}
                        onClick={handleRestablecerContrasena}
                        disabled={cargando}
                        whileTap={!cargando ? {
                            scale: 0.96,
                            boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3)"
                        } : {}}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    />

                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Esta opción solo aplica para cuentas locales. Las cuentas de Google y Facebook no pueden usar este método.
                    </p>
                </>
            )}

        </div>
    );
}