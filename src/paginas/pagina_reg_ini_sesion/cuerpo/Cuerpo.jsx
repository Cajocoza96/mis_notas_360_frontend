import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setVerToast, setMensajeToast, toggleVerModalRestablecerContrasena } from "../../../store/accesoSlice";
import CorreoContrasena from "./correo_contrasena/CorreoContrasena";
import infoRegIniSesion from "../../../data/infoRegIniSesion.json";
import { autenticarConGoogle, autenticarConFacebook } from "../../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { toggleVerMenuHamburguesa } from "../../../store/layoutSlice";
import { obtenerMensajeError, registrarError } from "../../../utils/errorHandler";
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

        window.fbAsyncInit = function () {
            window.FB.init({
                appId: FACEBOOK_CLIENT_ID,
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
            setFbSDKLoaded(true);
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

    // ✅ Autenticación con Facebook
    const handleFacebookLogin = () => {
        // Verificar si estamos en HTTPS
        if (!esHTTPS) {
            mostrarToast("Facebook Login requiere HTTPS. Por favor, usa la versión en producción.");
            return;
        }

        if (!fbSDKLoaded || !window.FB) {
            mostrarToast("Cargando Facebook...");
            return;
        }

        setCargandoFB(true);

        window.FB.login((response) => {
            if (response.authResponse) {
                // ✅ Solo solicitar campos públicos (sin email si causa problemas)
                window.FB.api('/me', {
                    fields: 'id,name,email,picture.type(large)'
                }, async (userInfo) => {
                    try {
                        // ✅ Acortar URL de imagen si es muy larga
                        let imagenPerfil = userInfo.picture?.data?.url || null;

                        // Si la URL es muy larga, usar una versión más corta
                        if (imagenPerfil && imagenPerfil.length > 500) {
                            // Extraer solo la parte importante o usar imagen por defecto
                            imagenPerfil = `https://graph.facebook.com/${userInfo.id}/picture?type=large`;
                        }

                        const facebookData = {
                            facebookId: userInfo.id,
                            email: userInfo.email || null, // Facebook a veces no provee email
                            nombreCuenta: userInfo.name,
                            imagenPerfil: imagenPerfil
                        };

                        await autenticarConFacebook(facebookData);

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
                });
            } else {
                mostrarToast("Inicio de sesión cancelado");
                setCargandoFB(false);
            }
        }, {
            scope: 'public_profile,email', // ✅ Solo perfil público
            return_scopes: true,
            auth_type: 'reauthenticate'
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

            {/* ✅ Botón de Facebook con advertencia de HTTPS */}
            <div className="w-full flex flex-col justify-center items-center">
                <button
                    onClick={handleFacebookLogin}
                    disabled={!fbSDKLoaded || cargandoFB || !esHTTPS}
                    className={`
                        w-auto h-auto p-1 overflow-hidden rounded-full 
                        text-white transition-all
                        ${fbSDKLoaded && !cargandoFB && esHTTPS
                            ? 'bg-[#1877F2] hover:bg-[#166FE5] cursor-pointer'
                            : 'bg-gray-400 cursor-not-allowed'}
                    `}
                >
                    {cargandoFB ? (
                        <span className="text-sm">Cargando...</span>
                    ) : (
                        <div className="flex flex-row items-center gap-2">
                            <FaFacebook className="text-4xl" />
                            <span className="text-sm md:text-base mr-2">
                                {esRegistro ? 'Registrarse con Facebook' : 'Iniciar sesión con Facebook'}
                            </span>
                        </div>
                    )}
                </button>

                {/* ✅ Advertencia si no es HTTPS */}
                {!esHTTPS && (
                    <p className="text-xs text-center mt-1 text-red-500">
                        Facebook Login requiere HTTPS.
                        <br />
                        Prueba en: <a
                            href="https://mis-notas-360-frontend.vercel.app"
                            className="underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Vercel
                        </a>
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