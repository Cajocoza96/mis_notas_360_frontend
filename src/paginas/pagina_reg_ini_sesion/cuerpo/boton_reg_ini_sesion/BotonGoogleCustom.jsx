import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

export default function BotonGoogleCustom({ 
    onSuccess, 
    onError, 
    esRegistro 
}) {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Obtener información del usuario con el token de acceso
                const userInfoResponse = await fetch(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );
                
                const userInfo = await userInfoResponse.json();
                
                // Crear un objeto similar al credential de GoogleLogin
                const googleData = {
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    sub: userInfo.sub, // Google ID
                };
                
                await onSuccess(googleData);
            } catch (error) {
                onError(error);
            }
        },
        onError: onError,
        flow: 'implicit', // o 'auth-code' según tu configuración
    });

    return (
        <div
            onClick={() => login()}
            className="w-full border border-gray-500 dark:border-gray-600 
                        bg-white dark:bg-gray-950
                        hover:bg-gray-200 dark:hover:bg-gray-900
                        active:bg-gray-200 dark:active:bg-gray-900
                        rounded-md p-3 overflow-hidden
                        flex flex-row items-center justify-center gap-2 
                        cursor-pointer select-none transition-colors"
        >
            <FcGoogle className="text-base md:text-xl text-red-600" />
            <p className="text-base md:text-xl text-black dark:text-white">
                {esRegistro ? "Registrarse con Google" : "Iniciar sesión con Google"}
            </p>
        </div>
    );
}