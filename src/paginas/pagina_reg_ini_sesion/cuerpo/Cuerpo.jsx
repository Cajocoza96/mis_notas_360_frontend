import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setVerToast, setMensajeToast, toggleVerModalRestablecerContrasena } from "../../../store/accesoSlice";
import CorreoContrasena from "./correo_contrasena/CorreoContrasena";
import infoRegIniSesion from "../../../data/infoRegIniSesion.json";
import { autenticarConGoogle, autenticarConFacebook } from "../../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { toggleVerMenuHamburguesa } from "../../../store/layoutSlice";
import { obtenerMensajeError, registrarError, logDesarrollo, errorDesarrollo } from "../../../utils/errorHandler";
import { FaFacebook } from "react-icons/fa";

const FACEBOOK_CLIENT_ID = import.meta.env.VITE_FACEBOOK_CLIENT_ID;

export default function Cuerpo() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);
    const tema = useSelector((state) => state.preferencia.tema);

    const [googleKey, setGoogleKey] = useState(0);
    const [fbSDKLoaded, setFbSDKLoaded] = useState(false);
    const [cargandoFB, setCargandoFB] = useState(false);
    const [esHTTPS, setEsHTTPS] = useState(false);

    const esRegistro = location.pathname === "/registrar";
    const textoAccion = esRegistro ? infoRegIniSesion.registrate.accionCuenta : infoRegIniSesion.iniciar.accionCuenta;

    // Determinar si está en modo oscuro
    const isDarkMode = tema === "oscuro" ||
        (tema === "sistema" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    // ✅ Verificar si estamos en HTTPS
    useEffect(() => {
        setEsHTTPS(window.location.protocol === 'https:');
    }, []);

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
            logDesarrollo('✅ Facebook SDK cargado');
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

    // Forzar re-render de Google cuando cambia el tema
    useEffect(() => {
        setGoogleKey(prev => prev + 1);
    }, [tema, location.pathname]);

    // Función para manejar autenticación con Google
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Enviamos el JWT token como tu backend espera
            await autenticarConGoogle(credentialResponse.credential);

            if (verMenuHamburguesa) {
                dispatch(toggleVerMenuHamburguesa());
            }
            navigate("/panel-principal");

        } catch (error) {
            registrarError('Autenticar con Google', error);
            const mensajeSeguro = obtenerMensajeError(
                error,
                'Error al autenticar con Google'
            );
            mostrarToast(mensajeSeguro);
        }
    };

    const handleGoogleError = () => {
        mostrarToast("Error al iniciar sesión con Google");
    };

    // ✅ Función auxiliar para procesar la autenticación
    const procesarAutenticacionFacebook = async (accessToken) => {
        try {
            logDesarrollo('✅ Access Token obtenido:', accessToken.substring(0, 20) + '...');

            await autenticarConFacebook({ accessToken });

            if (verMenuHamburguesa) {
                dispatch(toggleVerMenuHamburguesa());
            }
            navigate("/panel-principal");

        } catch (error) {
            registrarError('Autenticar con Facebook', error);
            const mensajeSeguro = obtenerMensajeError(
                error,
                'Error al autenticar con Facebook'
            );
            mostrarToast(mensajeSeguro);
        } finally {
            setCargandoFB(false);
        }
    };

    // ✅ AUTENTICACIÓN PROFESIONAL CON FACEBOOK
    const handleFacebookLogin = () => {
        if (!esHTTPS) {
            mostrarToast("Facebook Login requiere HTTPS.");
            return;
        }

        if (!fbSDKLoaded || !window.FB) {
            mostrarToast("Cargando Facebook...");
            return;
        }

        setCargandoFB(true);

        // ✅ PASO 1: Verificar si ya hay una sesión activa (login automático)
        window.FB.getLoginStatus((response) => {
            logDesarrollo('Estado de login de Facebook:', response.status);

            if (response.status === 'connected') {
                // ✅ Ya está conectado - Login automático sin pedir contraseña
                logDesarrollo('✅ Usuario ya conectado a Facebook');
                procesarAutenticacionFacebook(response.authResponse.accessToken);
            } else {
                // ✅ No está conectado - Mostrar popup de login
                logDesarrollo('⚠️ Usuario no conectado, mostrando popup de login');
                
                window.FB.login((loginResponse) => {
                    if (loginResponse.authResponse) {
                        // ✅ Login exitoso
                        procesarAutenticacionFacebook(loginResponse.authResponse.accessToken);
                    } else {
                        // ❌ Usuario canceló o cerró el popup
                        logDesarrollo('❌ Login cancelado por el usuario');
                        mostrarToast("Inicio de sesión cancelado");
                        setCargandoFB(false);
                    }
                }, {
                    scope: 'public_profile,email',
                    return_scopes: true
                    // ✅ NO usar auth_type: 'reauthenticate' para permitir login automático
                });
            }
        });
    };


    return (
        <div className="w-[70%] 2xs:w-[45%] lg:w-[25%] mx-auto flex flex-col justify-between p-2 gap-3">

            <p className="w-full text-left text-base md:text-lg 
                            font-bold select-none truncate
                        text-black dark:text-white">
                {textoAccion}
            </p>


            {/* Botón oficial de Google */}
            <div
                key={googleKey}
                className="w-full flex justify-center items-center"
            >
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    theme={isDarkMode ? "filled_black" : "outline"}
                    size="large"
                    text={esRegistro ? "signup_with" : "signin_with"}
                    shape="circle"
                    logo_alignment="left"
                    locale="es"
                    type="standard"
                />
            </div>

            <p className="w-full text-center text-base md:text-lg 
                            select-none truncate
                        text-black dark:text-white">
                o
            </p>

            {/* ✅ Botón de Facebook con skeleton loader */}
            <div className="w-full flex flex-col justify-center items-center">
                {!fbSDKLoaded ? (
                    // ✅ Skeleton loader mientras carga el SDK
                    <div className="w-full h-[42px] bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Cargando Facebook...
                        </span>
                    </div>
                ) : (
                    <button
                        onClick={handleFacebookLogin}
                        disabled={cargandoFB || !esHTTPS || !FACEBOOK_CLIENT_ID}
                        className={`
                            w-auto h-auto p-1 overflow-hidden rounded-full 
                            text-white transition-all
                            ${!cargandoFB && esHTTPS && FACEBOOK_CLIENT_ID
                                ? 'bg-[#1877F2] hover:bg-[#166FE5] cursor-pointer shadow-md hover:shadow-lg'
                                : 'bg-gray-400 cursor-not-allowed'}
                        `}
                    >
                        {cargandoFB ? (
                            <div className="flex flex-row items-center gap-2 px-2">
                                {/* Spinner de carga */}
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span className="text-sm">Autenticando...</span>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center gap-2">
                                <FaFacebook className="text-4xl" />
                                <span className="text-sm md:text-base mr-2">
                                    {esRegistro ? 'Registrarse con Facebook' : 'Iniciar sesión con Facebook'}
                                </span>
                            </div>
                        )}
                    </button>
                )}

                {/* Advertencias */}
                {!FACEBOOK_CLIENT_ID && fbSDKLoaded && (
                    <p className="text-xs text-center mt-1 text-red-500">
                        Falta configurar VITE_FACEBOOK_CLIENT_ID
                    </p>
                )}
                {!esHTTPS && FACEBOOK_CLIENT_ID && fbSDKLoaded && (
                    <p className="text-xs text-center mt-1 text-red-500">
                        Facebook Login requiere HTTPS.
                    </p>
                )}
            </div>

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