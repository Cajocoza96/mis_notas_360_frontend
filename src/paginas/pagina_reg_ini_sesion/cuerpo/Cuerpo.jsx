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
import CargandoNoHayNada from "../../../componentes/cargando_no_hay_nada/CargandoNoHayNada";

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
    const [cargandoGoogle, setCargandoGoogle] = useState(false);
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
        setCargandoGoogle(true);
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
            setCargandoGoogle(false);
        }
    };

    const handleGoogleError = () => {
        mostrarToast("Error al iniciar sesión con Google");
        setCargandoGoogle(false);
    };

    // ✅ AUTENTICACIÓN SEGURA CON FACEBOOK
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
                        navigate("/panel-principal");
                    })
                    .catch((error) => {
                        registrarError('Autenticar con Facebook', error);
                        const mensajeSeguro = obtenerMensajeError(
                            error,
                            'Error al autenticar con Facebook'
                        );
                        mostrarToast(mensajeSeguro);
                    })
                    .finally(() => {
                        setCargandoFB(false);
                    });
            } else {
                mostrarToast("Inicio de sesión cancelado");
                setCargandoFB(false);
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
                {/* ✅ Botón de Google con overlay de carga */}
                <div className="w-full flex justify-center items-center relative">
                    {/* Contenedor del botón de Google */}
                    <div
                        key={googleKey}
                        className={`${cargandoGoogle ? 'opacity-50 pointer-events-none' : ''}`}
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

                    {/* ✅ Overlay de carga sobre el botón de Google */}
                    {cargandoGoogle && (
                        <div className="w-full absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-full">
                            <div className="w-full flex items-center justify-center gap-2">
                                {/* Spinner */}
                                <CargandoNoHayNada iconoDeCarga={true} />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Autenticando...
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <p className="w-full text-center text-base md:text-lg 
                            select-none truncate
                        text-black dark:text-white">
                    o
                </p>

                {/* ✅ Botón de Facebook */}
                <div className="w-full flex flex-col justify-center items-center">
                    <button
                        onClick={handleFacebookLogin}
                        disabled={!fbSDKLoaded || cargandoFB || !esHTTPS || !FACEBOOK_CLIENT_ID}
                        className={`
                        w-full h-auto p-1 overflow-hidden rounded-full
                        text-white transition-all
                        ${fbSDKLoaded && !cargandoFB && esHTTPS && FACEBOOK_CLIENT_ID
                                ? 'bg-[#1877F2] hover:bg-[#166FE5] cursor-pointer'
                                : 'bg-gray-400 cursor-not-allowed'}
                    `}
                    >
                        {cargandoFB ? (
                            <div className="flex flex-row items-center justify-center gap-2">
                                <CargandoNoHayNada iconoDeCarga={true} />
                                <span className="text-sm">Autenticando...</span>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-center gap-2">
                                <FaFacebook className="text-4xl" />
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
                    */}
                </div>
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