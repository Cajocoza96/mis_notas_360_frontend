import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setVerToast, setMensajeToast,
    toggleVerModalRestablecerContrasena,
    iniciarAutenticacion, finalizarAutenticacion
} from "../../../../store/accesoSlice";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import BotonAccion from "../../../../componentes/botones/BotonAccion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaSpinner, FaCheck, FaTimes, FaLock } from "react-icons/fa";
import infoRegIniSesion from "../../../../data/infoRegIniSesion.json";
import { registrarUsuario, iniciarSesion, restablecerContrasena } from "../../../../services/authService";
import { toggleVerMenuHamburguesa } from "../../../../store/layoutSlice";
import { validarFortalezaContrasena, obtenerMensajesRequisitos } from "../../../../utils/validacionContrasenaUtils";
import useConexionInternet from "../../../../hooks/useConexionInternet";
import { obtenerMensajeError, registrarError, logDesarrollo } from "../../../../utils/errorHandler";

//  CONSTANTES DE LÍMITES
const LIMITE_USUARIO = 100;
const LIMITE_CONTRASENA = 255;

//  FUNCIÓN PARA LIMPIAR Y VALIDAR TEXTO PLANO
const limpiarTextoPlano = (texto) => {
    // Eliminar caracteres de control y líneas nuevas
    return texto
        .replace(/[\r\n\t]/g, '') // Eliminar saltos de línea, retornos y tabulaciones
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Eliminar caracteres de control
};

export default function CorreoContrasena({ textoContrasena, restablecer, noRestablecer }) {

    const [verContrasena, setVerContrasena] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [cargando, setCargando] = useState(false);
    const [fortalezaContrasena, setFortalezaContrasena] = useState(null);
    const [inputUsuarioFocused, setInputUsuarioFocused] = useState(false);
    const [inputContrasenaFocused, setInputContrasenaFocused] = useState(false);

    const { isOnline } = useConexionInternet();

    const { usuario } = useSelector((state) => state.auth);

    const blurTimerUsuario = useRef(null);
    const blurTimerContrasena = useRef(null);

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const handleVerContrasena = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setVerContrasena(!verContrasena);
    };

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const esRegistro = location.pathname === "/registrar";
    const textoBoton = esRegistro ? infoRegIniSesion.registrate.accionBoton : infoRegIniSesion.iniciar.accionBoton;

    //  REF para saber si estamos navegando exitosamente
    const navegandoExitoso = useRef(false);

    const MiBoton = motion.create(BotonAccion);

    //  LEER ESTADO GLOBAL DE REDUX
    const { autenticando } = useSelector((state) => state.acceso);

    //  RESETEAR ESTADO AL CAMBIAR DE RUTA
    useEffect(() => {
        dispatch(finalizarAutenticacion());
    }, [location.pathname, dispatch]);

    //  RESETEAR ESTADO AL DESMONTAR COMPONENTE
    useEffect(() => {
        return () => {
            dispatch(finalizarAutenticacion());
        };
    }, [dispatch]);

    useEffect(() => {
        return () => {
            if (blurTimerUsuario.current) clearTimeout(blurTimerUsuario.current);
            if (blurTimerContrasena.current) clearTimeout(blurTimerContrasena.current);
        };
    }, []);

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

    //  MANEJADOR PARA NOMBRE DE USUARIO CON VALIDACIONES
    const handleUsuarioChange = (e) => {
        let valor = e.target.value;

        // Limpiar texto (eliminar saltos de línea y caracteres de control)
        valor = limpiarTextoPlano(valor);

        // Validar límite de caracteres
        if (valor.length > LIMITE_USUARIO) {
            mostrarToast(`El nombre de usuario solo permite ${LIMITE_USUARIO} carácteres`);
            valor = valor.slice(0, LIMITE_USUARIO);
        }

        setNombreUsuario(valor);
    };

    //  MANEJADOR PARA CONTRASEÑA CON VALIDACIONES
    const handleContrasenaChange = (e) => {
        let valor = e.target.value;

        // Limpiar texto (eliminar saltos de línea y caracteres de control)
        valor = limpiarTextoPlano(valor);

        // Validar límite de caracteres
        if (valor.length > LIMITE_CONTRASENA) {
            mostrarToast(`La contraseña solo permite ${LIMITE_CONTRASENA} carácteres`);
            valor = valor.slice(0, LIMITE_CONTRASENA);
        }

        setContrasena(valor);
    };

    //  MANEJADOR PARA PEGADO EN NOMBRE DE USUARIO
    const handleUsuarioPaste = (e) => {
        e.preventDefault();

        // Obtener texto del portapapeles
        let textoPegado = e.clipboardData.getData('text/plain');

        // Limpiar texto
        textoPegado = limpiarTextoPlano(textoPegado);

        // Validar y cortar si excede el límite
        if (textoPegado.length > LIMITE_USUARIO) {
            mostrarToast(`El nombre de usuario solo permite ${LIMITE_USUARIO} carácteres. Se ha cortado el texto`);
            textoPegado = textoPegado.slice(0, LIMITE_USUARIO);
        }

        setNombreUsuario(textoPegado);
    };

    //  MANEJADOR PARA PEGADO EN CONTRASEÑA
    const handleContrasenaPaste = (e) => {
        e.preventDefault();

        // Obtener texto del portapapeles
        let textoPegado = e.clipboardData.getData('text/plain');

        // Limpiar texto
        textoPegado = limpiarTextoPlano(textoPegado);

        // Validar y cortar si excede el límite
        if (textoPegado.length > LIMITE_CONTRASENA) {
            mostrarToast(`La contraseña solo permite ${LIMITE_CONTRASENA} carácteres. Se ha cortado el texto`);
            textoPegado = textoPegado.slice(0, LIMITE_CONTRASENA);
        }

        setContrasena(textoPegado);
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
        if (!isOnline) {
            return
        }

        //  VALIDAR SI YA HAY AUTENTICACIÓN EN CURSO
        if (autenticando) {
            mostrarToast("Ya hay un proceso de autenticación en curso");
            return;
        }

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

        //  USAR DISPATCH DE REDUX
        dispatch(iniciarAutenticacion('local'));

        setCargando(true);

        try {
            if (esRegistro) {
                await registrarUsuario(nombreUsuario, contrasena);

                if (verMenuHamburguesa) {
                    dispatch(toggleVerMenuHamburguesa());
                }

                //  Marcar que la navegación es exitosa
                navegandoExitoso.current = true;

                if (usuario && usuario.vioBienvenida) {
                    setTimeout(() => {
                        navigate("/");
                    }, 100);
                }

            } else {
                await iniciarSesion(nombreUsuario, contrasena);

                if (verMenuHamburguesa) {
                    dispatch(toggleVerMenuHamburguesa());
                }

                //  Marcar que la navegación es exitosa
                navegandoExitoso.current = true;

                if (usuario && usuario.vioBienvenida) {
                    setTimeout(() => {
                        navigate("/");
                    }, 100);
                }
            }
        } catch (error) {
            registrarError('Inicio de sesión/Registro', error);
            const mensajeSeguro = obtenerMensajeError(
                error,
                esRegistro ? 'Error al registrar usuario' : 'Error al iniciar sesión'
            );
            mostrarToast(mensajeSeguro);

            //  USAR DISPATCH DE REDUX
            dispatch(finalizarAutenticacion());
        } finally {
            setCargando(false);
        }
    };

    const handleRestablecerContrasena = async () => {

        if (!isOnline) {
            return
        }

        //  VALIDAR SI YA HAY AUTENTICACIÓN EN CURSO
        if (autenticando) {
            mostrarToast("Ya hay un proceso de autenticación en curso");
            return;
        }

        if (!nombreUsuario.trim()) {
            mostrarToast("Ingrese nombre de usuario");
            return;
        }

        if (!contrasena.trim()) {
            mostrarToast("Ingrese nueva contraseña");
            return;
        }

        const validacion = validarFortalezaContrasena(contrasena);
        if (!validacion.valida) {
            const mensajes = obtenerMensajesRequisitos(validacion.requisitos);
            mostrarToast(`La contraseña debe cumplir: ${mensajes.join(', ')}`);
            return;
        }

        //  USAR DISPATCH DE REDUX
        dispatch(iniciarAutenticacion('local'));

        setCargando(true);

        try {
            await restablecerContrasena(nombreUsuario, contrasena);
            mostrarToast("Contraseña restablecida exitosamente");

            //  Marcar que la navegación es exitosa
            navegandoExitoso.current = true;

            setTimeout(() => {
                handleCerrarModal();
            }, 2000);


        } catch (error) {
            registrarError('Restablecer contraseña', error);
            const mensajeSeguro = obtenerMensajeError(
                error,
                'Error al restablecer contraseña. Por favor intenta más tarde'
            );
            mostrarToast(mensajeSeguro);

            //  USAR DISPATCH DE REDUX
            dispatch(finalizarAutenticacion());

        } finally {
            setCargando(false);
        }
    };

    const handleUsuarioBlur = () => {
        if (blurTimerUsuario.current) clearTimeout(blurTimerUsuario.current);
        blurTimerUsuario.current = setTimeout(() => {
            setInputUsuarioFocused(false);
        }, 200);
    };

    const handleContrasenaBlur = () => {
        if (blurTimerContrasena.current) clearTimeout(blurTimerContrasena.current);
        blurTimerContrasena.current = setTimeout(() => {
            setInputContrasenaFocused(false);
        }, 200);
    };

    const handleBotonClick = (e, callback) => {
        e.preventDefault();
        e.stopPropagation();

        if (blurTimerUsuario.current) clearTimeout(blurTimerUsuario.current);
        if (blurTimerContrasena.current) clearTimeout(blurTimerContrasena.current);

        //  VALIDAR QUE NO ESTÉ CARGANDO NI AUTENTICANDO
        if (!cargando && !autenticando) {
            callback();
        }
    };

    return (
        <div className="w-full flex flex-col justify-center gap-5">
            {/* Input de Nombre de Usuario */}
            <div className="relative">
                <div className={`border-2 rounded-md shadow-sm
                                flex flex-row items-center justify-between
                                transition-all duration-200
                                ${cargando || !isOnline ? 'opacity-50' : ''}
                                ${inputUsuarioFocused ? 'border-violet-800' : 'border-gray-300 dark:border-gray-700'}
                                ${!cargando && 'active:bg-gray-200 dark:active:bg-gray-700'}`}>
                    <input
                        className={`w-full text-base md:text-lg p-2 pt-6 pb-2
                                focus:outline-none bg-transparent
                                ${!isOnline ? 'cursor-not-allowed' : 'cursor-default'}
                                text-black dark:text-white`}
                        type="text"
                        value={nombreUsuario}
                        onChange={handleUsuarioChange}
                        onPaste={handleUsuarioPaste}
                        onFocus={() => {
                            if (blurTimerUsuario.current) clearTimeout(blurTimerUsuario.current);
                            setInputUsuarioFocused(true);
                        }}
                        onBlur={handleUsuarioBlur}
                        disabled={cargando || !isOnline}
                        maxLength={LIMITE_USUARIO}
                    />

                    <label
                        className={`absolute left-2 pointer-events-none
                                    transition-all duration-200 ease-out
                                    text-gray-500 dark:text-gray-400
                                    ${inputUsuarioFocused || nombreUsuario ?
                                'text-xs top-1 font-semibold' :
                                'text-base md:text-lg top-1/2 -translate-y-1/2'
                            }
                                    ${inputUsuarioFocused ? 'text-violet-800 dark:text-violet-400' : ''}`}>
                        Nombre de usuario
                    </label>
                </div>
            </div>

            {/* Input de Contraseña */}
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <div className={`border-2 rounded-md shadow-sm
                                    flex flex-row items-center justify-between
                                    transition-all duration-200
                                    ${cargando || !isOnline ? 'opacity-50' : ''}
                                    ${inputContrasenaFocused ? 'border-violet-800' : 'border-gray-300 dark:border-gray-700'}
                                    ${!cargando && 'active:bg-gray-200 dark:active:bg-gray-700'}`}>
                        <input
                            className={`w-full text-base md:text-lg p-2 pt-6 pb-2
                                    focus:outline-none bg-transparent
                                    ${!isOnline ? 'cursor-not-allowed' : 'cursor-default'}
                                    text-black dark:text-white`}
                            type={verContrasena ? "text" : "password"}
                            value={contrasena}
                            onChange={handleContrasenaChange}
                            onPaste={handleContrasenaPaste}
                            onFocus={() => {
                                if (blurTimerContrasena.current) clearTimeout(blurTimerContrasena.current);
                                setInputContrasenaFocused(true);
                            }}
                            onBlur={handleContrasenaBlur}
                            disabled={cargando || !isOnline}
                            maxLength={LIMITE_CONTRASENA}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !cargando && noRestablecer) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />

                        <label
                            className={`absolute left-2 pointer-events-none
                                        transition-all duration-200 ease-out
                                        text-gray-500 dark:text-gray-400
                                        ${inputContrasenaFocused || contrasena ?
                                    'text-xs top-1 font-semibold' :
                                    'text-base md:text-lg top-1/2 -translate-y-1/2'
                                }
                                        ${inputContrasenaFocused ? 'text-violet-800 dark:text-violet-400' : ''}`}>
                            {textoContrasena}
                        </label>

                        {isOnline && (
                            <button
                                type="button"
                                className="text-base md:text-lg mr-2 p-2
                                text-black dark:text-white cursor-pointer z-10 
                                touch-manipulation select-none"
                                onMouseDown={handleVerContrasena}
                                onTouchEnd={handleVerContrasena}
                                tabIndex={-1}
                            >
                                {verContrasena ? <HiEye /> : <HiEyeOff />}
                            </button>
                        )}

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
                            <span className={`text-sm font-semibold ${fortalezaContrasena.fortaleza === 'fuerte' ? 'text-green-600 dark:text-green-400' :
                                fortalezaContrasena.fortaleza === 'media' ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                                }`}>
                                {fortalezaContrasena.fortaleza.charAt(0).toUpperCase() + fortalezaContrasena.fortaleza.slice(1)}
                            </span>
                        </div>

                        <div className="text-xs md:text-sm space-y-1">
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.longitud} texto="Mínimo 8 carácteres" />
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.minuscula} texto="Una letra minúscula" />
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.mayuscula} texto="Una letra mayúscula" />
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.numero} texto="Un número" />
                            <RequisitoItem cumple={fortalezaContrasena.requisitos.simbolo} texto="Un símbolo (!@#$%^&*...)" />
                        </div>
                    </div>
                )}
            </div>

            {/* Botones */}
            {noRestablecer && (
                <div
                    onTouchEnd={(e) => handleBotonClick(e, handleSubmit)}
                    onMouseDown={(e) => handleBotonClick(e, handleSubmit)}
                    className={`touch-manipulation w-fit ${(cargando || autenticando || !isOnline) ? 'cursor-not-allowed' : ''}`}>
                    <MiBoton
                        className={`bg-violet-800 text-white hover:bg-violet-800 active:bg-violet-800
                            ${(cargando || autenticando || !isOnline) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        accion={
                            cargando ? (
                                <FaSpinner className="animate-spin text-lg md:text-xl text-white" />
                            ) : (
                                textoBoton
                            )
                        }
                        disabled={cargando || autenticando || !isOnline}
                        whileTap={!(cargando || autenticando) ? {
                            scale: 0.96,
                            boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3)"
                        } : {}}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    />
                </div>
            )}

            {restablecer && (
                <>
                    <div className="touch-manipulation">
                        <div
                            onTouchEnd={(e) => {
                                if (cargando || autenticando || !isOnline) return;
                                handleBotonClick(e, handleRestablecerContrasena);
                            }}
                            onMouseDown={(e) => {
                                if (cargando || autenticando || !isOnline) return;
                                handleBotonClick(e, handleRestablecerContrasena);
                            }}
                            style={{ cursor: (cargando || autenticando) ? 'not-allowed' : 'pointer' }}
                        >
                            <MiBoton
                                className={`w-full bg-violet-800 text-white hover:bg-violet-800 active:bg-violet-800
                            ${(cargando || autenticando || !isOnline) ? 'opacity-50' : ''}`}
                                style={{ cursor: (cargando || autenticando || !isOnline) ? 'not-allowed' : 'pointer' }}
                                accion={
                                    cargando ? (
                                        'Restableciendo...'
                                    ) :
                                        autenticando ? (
                                            <FaLock className="text-lg md:text-xl text-white" />
                                        )
                                            : (
                                                'Restablecer contraseña'
                                            )
                                }
                                disabled={cargando || autenticando || !isOnline}
                                whileTap={!(cargando || autenticando) ? {
                                    scale: 0.96,
                                    boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3)"
                                } : {}}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Esta opción solo aplica para cuentas locales. Las cuentas de Google no pueden usar este método.
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