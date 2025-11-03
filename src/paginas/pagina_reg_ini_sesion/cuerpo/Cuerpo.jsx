import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setVerToast } from "../../../store/accesoSlice";
import BotonRegIniSesion from "./boton_reg_ini_sesion/BotonRegIniSesion";
import CorreoContrasena from "./correo_contrasena/CorreoContrasena";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import infoRegIniSesion from "../../../data/infoRegIniSesion.json";
import { autenticarConGoogle, autenticarConFacebook } from "../../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toggleVerMenuHamburguesa } from "../../../store/layoutSlice";

export default function Cuerpo({ setMensajeToast }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const esRegistro = location.pathname === "/registrar";
    const textoAccion = esRegistro ? infoRegIniSesion.registrate.accionCuenta : infoRegIniSesion.iniciar.accionCuenta;

    const mostrarToast = (mensaje) => {
        setMensajeToast(mensaje);
        dispatch(setVerToast(true));

        setTimeout(() => {
            dispatch(setVerToast(false));
        }, 3000);
    };

    // Función para manejar autenticación con Google
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Decodificar el token JWT de Google
            const decoded = jwtDecode(credentialResponse.credential);

            const googleData = {
                googleId: decoded.sub, // ID único de Google
                email: decoded.email,
                nombreCuenta: decoded.name,
                imagenPerfil: decoded.picture
            };

            // Autenticar con tu backend
            await autenticarConGoogle(googleData);

            if (verMenuHamburguesa) {
                dispatch(toggleVerMenuHamburguesa());
            }
            navigate("/panel-principal");

        } catch (error) {
            mostrarToast(error.message || "Error al autenticar con Google");
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
                        mostrarToast(error.message || "Error al autenticar con Facebook");
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

            {/* Botón de Facebook */}
            <div onClick={handleFacebookAuth}>
                <BotonRegIniSesion
                    icono={<FaFacebook className="text-base md:text-xl text-blue-700 " />}
                    nombreIcono="Facebook"
                />
            </div>

            {/* Botón de Google - Versión oculta con estilo personalizado */}
            <div className="relative">
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

            <p className="w-full text-center text-base md:text-xl 
                            select-none truncate
                        text-black dark:text-white">
                o
            </p>

            <CorreoContrasena setMensajeToast={setMensajeToast} />

        </div>
    );
}