import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVerToast, setMensajeToast, toggleVerModalRestablecerContrasena } from "../../../../store/accesoSlice";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import BotonAccion from "../../../../componentes/botones/BotonAccion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import infoRegIniSesion from "../../../../data/infoRegIniSesion.json";
import { registrarUsuario, iniciarSesion, restablecerContrasena } from "../../../../services/authService";
import { toggleVerMenuHamburguesa } from "../../../../store/layoutSlice";
import { validarFortalezaContrasena, obtenerMensajesRequisitos } from "../../../../utils/validacionContrasenaUtils";

export default function CorreoContrasena({ textoContrasena, restablecer, noRestablecer }) {
    const [verContrasena, setVerContrasena] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [cargando, setCargando] = useState(false);
    const [fortalezaContrasena, setFortalezaContrasena] = useState(null);

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

    // Validar fortaleza de contraseña en tiempo real
    useEffect(() => {
        if (contrasena.length > 0) {
            const validacion = validarFortalezaContrasena(contrasena);
            setFortalezaContrasena(validacion);
        } else {
            setFortalezaContrasena(null);
        }
    }, [contrasena]);

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
            setNombreUsuario("");
            setContrasena("");
            setVerContrasena(false);
            setFortalezaContrasena(null);
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

        // Validar fortaleza de contraseña solo en registro
        if (esRegistro) {
            const validacion = validarFortalezaContrasena(contrasena);
            if (!validacion.valida) {
                const mensajes = obtenerMensajesRequisitos(validacion.requisitos);
                mostrarToast(`La contraseña debe cumplir: ${mensajes.join(', ')}`);
                return;
            }
        }

        setCargando(true);

        try {
            if (esRegistro) {
                await registrarUsuario(nombreUsuario, contrasena);

                if (verMenuHamburguesa) {
                    dispatch(toggleVerMenuHamburguesa());
                }
                navigate("/");

            } else {
                await iniciarSesion(nombreUsuario, contrasena);

                if (verMenuHamburguesa) {
                    dispatch(toggleVerMenuHamburguesa());
                }
                navigate("/");
            }
        } catch (error) {
            mostrarToast(error.message || "Error en el servidor");
        } finally {
            setCargando(false);
        }
    };

    const handleRestablecerContrasena = async () => {
        if (!nombreUsuario.trim()) {
            mostrarToast("Por favor ingresa tu nombre de usuario");
            return;
        }

        if (!contrasena.trim()) {
            mostrarToast("Por favor ingresa tu nueva contraseña");
            return;
        }

        // Validar fortaleza de contraseña
        const validacion = validarFortalezaContrasena(contrasena);
        if (!validacion.valida) {
            const mensajes = obtenerMensajesRequisitos(validacion.requisitos);
            mostrarToast(`La contraseña debe cumplir: ${mensajes.join(', ')}`);
            return;
        }

        setCargando(true);

        try {
            await restablecerContrasena(nombreUsuario, contrasena);
            mostrarToast("Contraseña restablecida exitosamente");

            setTimeout(() => {
                handleCerrarModal();
            }, 1000);

        } catch (error) {
            const mensajeError = error.message || "Error al restablecer contraseña";
            mostrarToast(mensajeError);
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

                    <input
                        className="w-full text-base md:text-xl p-2
                                focus:outline-none bg-transparent
                                text-black dark:text-white"
                        type={verContrasena ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        disabled={cargando}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !cargando && noRestablecer) {
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

                {/* Indicador de fortaleza de contraseña */}
                {fortalezaContrasena && (esRegistro || restablecer) && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300 ${fortalezaContrasena.colorTailwind}`}
                                    style={{ width: `${(fortalezaContrasena.cumplidos / 5) * 100}%` }}
                                />
                            </div>
                            <span className={`text-sm font-semibold ${
                                fortalezaContrasena.fortaleza === 'fuerte' ? 'text-green-600 dark:text-green-400' :
                                fortalezaContrasena.fortaleza === 'media' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                            }`}>
                                {fortalezaContrasena.fortaleza.charAt(0).toUpperCase() + fortalezaContrasena.fortaleza.slice(1)}
                            </span>
                        </div>

                        {/* Lista de requisitos */}
                        <div className="text-xs md:text-sm space-y-1">
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.longitud} texto="Mínimo 8 caracteres" />
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.minuscula} texto="Una letra minúscula" />
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.mayuscula} texto="Una letra mayúscula" />
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.numero} texto="Un número" />
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.simbolo} texto="Un símbolo (!@#$%^&*...)" />
                        </div>
                    </div>
                )}
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

// Componente auxiliar para mostrar requisitos
function RequisitoItem({ cumple, texto }) {
    return (
        <div className="flex items-center gap-2">
            {cumple ? (
                <FaCheck className="text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
                <FaTimes className="text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <span className={`${cumple ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {texto}
            </span>
        </div>
    );
}