import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleVerMenuHamburguesa } from "../../store/layoutSlice";
import { useAuth } from "../../hooks/useAuth";
import { HiOutlineUser, HiChevronDown } from "react-icons/hi";
import CargandoNoHayNada from "../cargando_no_hay_nada/CargandoNoHayNada";
import useConexionInternet from "../../hooks/useConexionInternet";

export default function AdminUsuario() {
    const dispatch = useDispatch();

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const { usuario, cargando } = useAuth();

    const navigate = useNavigate();

    const { isOnline } = useConexionInternet();

    // Generar color de fondo aleatorio basado en el nombre
    const avatarBg = useMemo(() => {
        if (!usuario?.nombreCuenta) return 'bg-blue-500';

        const colores = [
            'bg-green-500',
            'bg-blue-500',
            'bg-red-500',
            'bg-yellow-500',
            'bg-orange-500',
            'bg-violet-500',
            'bg-green-600',
            'bg-blue-600',
            'bg-red-600',
            'bg-yellow-600',
            'bg-orange-600',
            'bg-violet-600'
        ];

        // Usar la suma de los códigos de caracteres para generar un índice
        const sum = usuario.nombreCuenta.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colores[sum % colores.length];
    }, [usuario?.nombreCuenta]);

    // Obtener primera letra del nombre
    const primeraLetra = useMemo(() => {
        if (!usuario?.nombreCuenta) return '';
        return usuario.nombreCuenta.charAt(0).toUpperCase();
    }, [usuario?.nombreCuenta]);

    const handleInfoUsuario = () => {
        if (verMenuHamburguesa) {
            dispatch(toggleVerMenuHamburguesa());
        }

        if (!isOnline) {
            return;
        } else {
            navigate("/informacion-usuario")
        }

    }

    if (cargando) {
        return (
            <div className="p-2 select-none 
                        flex flex-row items-center justify-start gap-2">
                <CargandoNoHayNada
                    iconoDeCarga={true}
                />

            </div>

        );
    }

    // Determinar si es cuenta local
    const esCuentaLocal = !usuario?.imagenPerfil;

    return (
        <div
            className={`text-black dark:text-white p-2 select-none
                        hover:bg-gray-300 active:bg-gray-300
                        ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        dark:hover:bg-gray-700 dark:active:bg-gray-700 
                        flex flex-row items-center justify-start gap-2`}
            onClick={handleInfoUsuario}
        >
            {/* Avatar */}
            {esCuentaLocal ? (
                // Cuenta local: icono de usuario
                <div className="w-7 h-7 lg:w-9 lg:h-9 flex items-center justify-center">
                    <HiOutlineUser className="text-2xl md:text-3xl" />
                </div>
            ) : usuario?.imagenPerfil ? (
                // Cuenta OAuth con imagen
                <img
                    translate="no"
                    src={usuario.imagenPerfil}
                    alt={usuario.nombreCuenta || usuario.nombreUsuario}
                    className="w-7 h-7 lg:w-9 lg:h-9 rounded-full object-cover"
                    onError={(e) => {
                        // Si la imagen falla al cargar, mostrar letra
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}

            {/* Fallback: Primera letra con color aleatorio (oculto por defecto) */}
            {!esCuentaLocal && (
                <div
                    translate="no"
                    className={`w-7 h-7 lg:w-9 lg:h-9 rounded-full ${avatarBg} text-white 
                                flex items-center justify-center font-bold text-xl
                                ${usuario?.imagenPerfil ? 'hidden' : 'flex'}`}
                >
                    {primeraLetra}
                </div>
            )}

            {/* Nombre del usuario */}
            <p className="truncate text-left text-base md:text-lg" translate="no">
                {usuario?.nombreCuenta || usuario?.nombreUsuario}
            </p>

            <HiChevronDown className="text-2xl md:text-3xl" />
        </div>
    );
}