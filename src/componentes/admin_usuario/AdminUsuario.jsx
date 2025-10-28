import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleVerMenuHamburguesa } from "../../store/layoutSlice";
import { useAuth } from "../../hooks/useAuth";
import { HiOutlineUser, HiChevronDown } from "react-icons/hi";

export default function AdminUsuario() {
    const dispatch = useDispatch();

    const verMenuHamburguesa = useSelector((state) => state.layout.verMenuHamburguesa);

    const { usuario, cargando } = useAuth();

    const navigate = useNavigate();

    const handleInfoUsuario = () => {
        if (verMenuHamburguesa) {
            dispatch(toggleVerMenuHamburguesa());
        }
        navigate("/informacion-usuario")
    }

    if (cargando) {
        return (
            <div className="flex flex-col justify-center p-2">
                <div className="text-black dark:text-white p-2 select-none flex flex-row items-center gap-2">
                    <HiOutlineUser className="text-2xl md:text-3xl" />
                    <p className="truncate text-base md:text-xl">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-black dark:text-white p-2 select-none cursor-pointer
                        hover:bg-gray-300 active:bg-gray-300
                        dark:hover:bg-gray-700 dark:active:bg-gray-700 

                        flex flex-row items-center justify-start gap-2"
            onClick={handleInfoUsuario}>

            {usuario?.imagenPerfil ? (
                <img
                    src={usuario?.imagenPerfil || 'No disponible'}
                    alt={usuario?.nombreCuenta || usuario?.nombreUsuario || 'Usuario'}
                    className="w-12 h-12 rounded-full object-cover" />
            ) : (
                <HiOutlineUser className="text-2xl md:text-3xl" />
            )}

            <p className="truncate text-left text-base md:text-xl">
                {usuario?.nombreCuenta || usuario?.nombreUsuario || 'Usuario'}
            </p>

            <HiChevronDown className="text-2xl md:text-3xl" />
        </div>
    );
}