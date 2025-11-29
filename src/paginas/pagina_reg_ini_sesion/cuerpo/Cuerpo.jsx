import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setVerToast, setMensajeToast, toggleVerModalRestablecerContrasena } from "../../../store/accesoSlice";
import BotonRegIniSesion from "./boton_reg_ini_sesion/BotonRegIniSesion";
import CorreoContrasena from "./correo_contrasena/CorreoContrasena";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import infoRegIniSesion from "../../../data/infoRegIniSesion.json";
import { autenticarConGoogle, autenticarConFacebook } from "../../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toggleVerMenuHamburguesa } from "../../../store/layoutSlice";

import { obtenerMensajeError, registrarError, logDesarrollo } from "../../../utils/errorHandler";

export default function Cuerpo() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const esRegistro = location.pathname === "/registrar";
    const textoAccion = esRegistro ? infoRegIniSesion.registrate.accionCuenta : infoRegIniSesion.iniciar.accionCuenta;

    const mostrarToast = (mensaje) => {
        dispatch(setMensajeToast(mensaje));
        dispatch(setVerToast(true));

        setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    const handleRestablecerContrasena = () => {
        dispatch(setVerToast(false));
        dispatch(toggleVerModalRestablecerContrasena())
    }

    // Función para manejar autenticación con Google
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Ya NO decodificamos en el frontend
            // Enviamos el token completo al backend para que lo verifique
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

    // Función para manejar autenticación con Facebook
    const handleFacebookAuth = () => {
        // Cargar el SDK de Facebook si no está cargado
        if (!window.FB) {
            mostrarToast("Cargando Facebook...");
            return;
        }

        window.FB.login((response) => {
            if (response.authResponse) {
                // Usuario autenticado, obtener información del perfil
                window.FB.api('/me', { fields: 'id,name,email,picture.type(large)' }, async (userInfo) => {
                    try {
                        const facebookData = {
                            facebookId: userInfo.id,
                            email: userInfo.email || null,
                            nombreCuenta: userInfo.name,
                            imagenPerfil: userInfo.picture?.data?.url || null
                        };

                        // Autenticar con tu backend
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
                    }
                });
            } else {
                mostrarToast("Inicio de sesión cancelado");
            }
        }, { scope: 'public_profile,email' });
    };

    return (
        <div className="w-[95%] mx-auto flex flex-col justify-between p-2 gap-2">

            <p className="w-full text-left text-base md:text-xl 
                            font-bold select-none truncate
                        text-black dark:text-white">
                {textoAccion}
            </p>


            {/* Botón de Facebook 
            <div onClick={handleFacebookAuth}>
                <BotonRegIniSesion
                    icono={<FaFacebook className="text-base md:text-xl text-blue-700 " />}
                    nombreIcono="Facebook"
                />
            </div>
            */}


            {/* Botón de Google - Versión oculta con estilo personalizado 
            <div className="relative cursor-pointer">
                <div className="absolute inset-0 opacity-0 z-10">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                        theme="outline"
                        size="large"
                        text={esRegistro ? "signup_with" : "signin_with"}
                    />
                </div>
                <div className="relative z-0">
                    <BotonRegIniSesion
                        icono={<FaGoogle className="text-base md:text-xl text-red-600" />}
                        nombreIcono="Google"
                    />
                </div>
            </div>
            */}

            <p className="w-full text-center text-base md:text-xl 
                            select-none truncate
                        text-black dark:text-white">
                o
            </p>

            <CorreoContrasena
                textoContrasena="Contraseña"
                noRestablecer={true}
            />

            {!esRegistro && (

                <div
                    onClick={handleRestablecerContrasena}
                    className="w-fit">
                    <p className="mt-1 text-left text-base md:text-xl 
                                select-none cursor-pointer
                            text-black dark:text-white">
                        ¿Olvidó su contraseña?
                    </p>
                </div>
            )}

        </div>
    );
}