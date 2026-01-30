import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    setVerToast, setMensajeToast,
    toggleVerModalRestablecerContrasena,
    iniciarAutenticacion, finalizarAutenticacion
} from "../../../store/accesoSlice";
import CorreoContrasena from "./correo_contrasena/CorreoContrasena";
import infoRegIniSesion from "../../../data/infoRegIniSesion.json";
import { autenticarConGoogle, autenticarConFacebook } from "../../../services/authService";
import { useGoogleLogin } from "@react-oauth/google";
import { toggleVerMenuHamburguesa } from "../../../store/layoutSlice";
import { obtenerMensajeError, registrarError, logDesarrollo, errorDesarrollo } from "../../../utils/errorHandler";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import CargandoNoHayNada from "../../../componentes/cargando_no_hay_nada/CargandoNoHayNada";

const FACEBOOK_CLIENT_ID = import.meta.env.VITE_FACEBOOK_CLIENT_ID;

export default function Cuerpo() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const [fbSDKLoaded, setFbSDKLoaded] = useState(false);

    // ✅ ESTADO UNIFICADO PARA CONTROLAR PROCESOS DE AUTENTICACIÓN
    const { autenticando, tipoAutenticacion } = useSelector((state) => state.acceso);

    const [esHTTPS, setEsHTTPS] = useState(false);

    // ✅ REF para saber si estamos navegando exitosamente
    const navegandoExitoso = useRef(false);

    const esRegistro = location.pathname === "/registrar";
    const textoAccion = esRegistro ? infoRegIniSesion.registrate.accionCuenta : infoRegIniSesion.iniciar.accionCuenta;

    // ✅ Verificar si estamos en HTTPS
    useEffect(() => {
        setEsHTTPS(window.location.protocol === 'https:');
    }, []);

    // ✅ RESETEAR ESTADO AL CAMBIAR DE RUTA
    useEffect(() => {
        if (!navegandoExitoso.current) {
            dispatch(finalizarAutenticacion());
        }
    }, [location.pathname, dispatch]);

    // ✅ RESETEAR ESTADO AL DESMONTAR COMPONENTE
    useEffect(() => {
        return () => {
            if (!navegandoExitoso.current) {
                dispatch(finalizarAutenticacion());
            }
        };
    }, [dispatch]);

    // ✅ Cargar Facebook SDK
    useEffect(() => {
        if (window.FB) {
            setFbSDKLoaded(true);
            return;
        }

        if (!FACEBOOK_CLIENT_ID) {
            errorDesarrollo('❌ FACEBOOK_CLIENT_ID no está definido');
            return;
        }

        window.fbAsyncInit = function () {
            window.FB.init({
                appId: FACEBOOK_CLIENT_ID,
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
            setFbSDKLoaded(true);
            //logDesarrollo('✅ Facebook SDK cargado');
        };

        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/es_LA/sdk.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';

        if (!document.getElementById('facebook-jssdk')) {
            document.body.appendChild(script);
        }
    }, []);

    const mostrarToast = (mensaje) => {
        dispatch(setMensajeToast(mensaje));
        dispatch(setVerToast(true));

        setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    const handleRestablecerContrasena = () => {
        dispatch(setVerToast(false));
        dispatch(toggleVerModalRestablecerContrasena());
    };

    // ✅ GOOGLE LOGIN CON REDIRECT (ESTÁNDAR PROFESIONAL)
    const loginGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            dispatch(iniciarAutenticacion('google'));
            try {
                // ✅ Enviar access_token al backend
                await autenticarConGoogle(tokenResponse.access_token);

                if (verMenuHamburguesa) {
                    dispatch(toggleVerMenuHamburguesa());
                }

                // ✅ Marcar que la navegación es exitosa
                navegandoExitoso.current = true;

                setTimeout(() => {
                    navigate("/panel-principal");
                }, 100);

            } catch (error) {
                registrarError('Autenticar con Google', error);
                const mensajeSeguro = obtenerMensajeError(error, 'Error al autenticar con Google');
                mostrarToast(mensajeSeguro);
                dispatch(finalizarAutenticacion());
            }
        },
        onError: () => {
            mostrarToast("Error al iniciar sesión con Google");
            dispatch(finalizarAutenticacion());
        },
        // ✅ MODO REDIRECT PROFESIONAL
        ux_mode: 'redirect',
        redirect_uri: window.location.origin + (esRegistro ? '/registrar' : '/iniciar-sesion')
    });

    // ✅ MANEJADOR PARA GOOGLE CON VALIDACIÓN
    const handleGoogleLogin = () => {
        if (autenticando) {
            mostrarToast(`Ya hay un proceso de autenticación en curso (${tipoAutenticacion})`);
            return;
        }
        loginGoogle();
    };

    // ✅ AUTENTICACIÓN SEGURA CON FACEBOOK
    const handleFacebookLogin = () => {
        if (autenticando) {
            mostrarToast(`Ya hay un proceso de autenticación en curso (${tipoAutenticacion})`);
            return;
        }

        if (!esHTTPS) {
            mostrarToast("Facebook Login requiere HTTPS.");
            return;
        }

        if (!fbSDKLoaded || !window.FB) {
            mostrarToast("Cargando Facebook...");
            return;
        }

        dispatch(iniciarAutenticacion('facebook'));

        window.FB.login((response) => {
            if (response.authResponse) {
                // ✅ CAMBIO CRÍTICO: Obtener el accessToken
                const accessToken = response.authResponse.accessToken;

                logDesarrollo('✅ Access Token obtenido de Facebook');

                // ✅ Enviar SOLO el accessToken al backend
                autenticarConFacebook({ accessToken })
                    .then(() => {
                        if (verMenuHamburguesa) {
                            dispatch(toggleVerMenuHamburguesa());
                        }

                        // ✅ Marcar que la navegación es exitosa
                        navegandoExitoso.current = true;

                        setTimeout(() => {
                            navigate("/panel-principal");
                        }, 100);

                    })
                    .catch((error) => {
                        registrarError('Autenticar con Facebook', error);
                        const mensajeSeguro = obtenerMensajeError(
                            error,
                            'Error al autenticar con Facebook'
                        );
                        mostrarToast(mensajeSeguro);
                        dispatch(finalizarAutenticacion());
                    });
            } else {
                mostrarToast("Inicio de sesión cancelado");
                dispatch(finalizarAutenticacion());
            }
        }, {
            scope: 'public_profile,email',
            return_scopes: true
        });
    };


    return (
        <div className="w-[70%] 2xs:w-[45%] lg:w-[25%] mx-auto flex flex-col justify-between p-2 gap-5">

            <p className="w-full text-left text-base md:text-lg 
                            font-bold select-none truncate
                        text-black dark:text-white">
                {textoAccion}
            </p>

            <div className="w-full flex flex-col justify-center items-center gap-2">

                {/* ✅ BOTÓN PERSONALIZADO DE GOOGLE - 100% CLICKEABLE */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={autenticando}
                    className={`
                        w-full h-12 
                        flex items-center justify-center gap-3
                        rounded-md border-2
                        font-medium text-sm md:text-base
                        transition-all duration-200
                        ${autenticando
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md cursor-pointer active:scale-[0.98]'
                        }
                        border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-800
                        text-gray-700 dark:text-gray-200
                        shadow-sm
                    `}
                >
                    {autenticando && tipoAutenticacion === 'google' ? (
                        <>
                            <CargandoNoHayNada iconoDeCarga={true} />
                            <span>Autenticando...</span>
                        </>
                    ) : (
                        <>
                            <FcGoogle className="text-2xl flex-shrink-0" />
                            <span className="truncate">
                                {esRegistro ? 'Registrarse con Google' : 'Iniciar sesión con Google'}
                            </span>
                        </>
                    )}
                </button>

                <p className="w-full text-center text-base md:text-lg 
                            select-none truncate
                        text-black dark:text-white">
                    o
                </p>

                {/*  
                <div className="w-full flex flex-col justify-center items-center">
                    <button
                        onClick={handleFacebookLogin}
                        disabled={!fbSDKLoaded || autenticando || !esHTTPS || !FACEBOOK_CLIENT_ID}
                        className={`
                        w-full h-auto p-1 overflow-hidden rounded-full
                        text-white transition-all
                        ${fbSDKLoaded && !autenticando && esHTTPS && FACEBOOK_CLIENT_ID
                                ? 'bg-[#1877F2] hover:bg-[#166FE5] cursor-pointer'
                                : 'bg-gray-400 cursor-not-allowed'}
                    `}
                    >
                        {autenticando && tipoAutenticacion === 'facebook' ? (
                            <div className="flex flex-row items-center justify-center gap-2">
                                <CargandoNoHayNada iconoDeCarga={true} />
                                <span className="text-sm">Autenticando...</span>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-center gap-2">
                                <FaFacebook className="text-2xl" />
                                <span className="text-sm md:text-base">
                                    {esRegistro ? 'Registrarse con Facebook' : 'Iniciar sesión con Facebook'}
                                </span>
                            </div>
                        )}
                    </button>

                    {/* Advertencias 
                    {!FACEBOOK_CLIENT_ID && (
                        <p className="text-xs text-center mt-1 text-red-500">
                            Falta configurar VITE_FACEBOOK_CLIENT_ID
                        </p>
                    )}
                    {!esHTTPS && FACEBOOK_CLIENT_ID && (
                        <p className="text-xs text-center mt-1 text-red-500">
                            Facebook Login requiere HTTPS.
                        </p>
                    )}
                </div>
                */}

            </div>

            <p className="w-full text-center text-base md:text-lg 
                            select-none
                        text-black dark:text-white">
                ¿No quieres usar Google? <span>{esRegistro ? 'Regístrate con usuario y contraseña' : 'Inicia sesión con usuario y contraseña'}</span>
            </p>

            <CorreoContrasena
                textoContrasena="Contraseña"
                noRestablecer={true}
            />

            {!esRegistro && (
                <div
                    onClick={handleRestablecerContrasena}
                    className="w-fit">
                    <p className="mt-1 text-left text-base md:text-lg 
                                select-none cursor-pointer
                            text-black dark:text-white">
                        ¿Olvidó su contraseña?
                    </p>
                </div>
            )}

        </div>
    );
}