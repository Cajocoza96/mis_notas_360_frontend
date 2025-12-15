import React from "react";

import { HiOutlineStar, HiStar, HiViewColumns } from "react-icons/hi2";

import { HiSearch, HiPlus, HiMenuAlt3, HiArrowDown } from "react-icons/hi";

import { useSelector, useDispatch } from "react-redux";

import {
    toggleOrganizarPorColumna, toggleVerSoloFavoritos,
    guardarOrgColumna, guardarVerSoloFavoritos
} from "../../../store/preferenciaSlice";

import { toggleVerModalCrearNota } from "../../../store/tareasSlice";

import { useNavigate } from "react-router-dom";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../../utils/errorHandler";

import useConexionInternet from "../../../hooks/useConexionInternet";

export default function Footer() {

    const { isOnline } = useConexionInternet();

    const dispatch = useDispatch();

    const handleVerModalCrearNota = () => {
        if (!isOnline) {
            return
        } else {
            dispatch(toggleVerModalCrearNota())
        }
    }

    const navigate = useNavigate();

    const handleNavegarBuscar = () => navigate("/buscar");

    const handleNavegarEstado = () => navigate("/estados");

    const organizarPorColumna = useSelector((state) => state.preferencia.organizarPorColumna);
    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);

    const handleOrganizacion = () => {
        if (!isOnline) {
            return
        } else {
            // Primero cambia el estado local
            dispatch(toggleOrganizarPorColumna());

            // Luego guarda en el backend
            const nuevoValor = !organizarPorColumna;
            dispatch(guardarOrgColumna(nuevoValor));
        }
    }

    // ✅ Simplificado: solo actualizar preferencia, Cuerpo.jsx se encarga de recargar
    const handleToggleFavoritos = async () => {
        const nuevoValor = !verSoloFavoritos;

        try {
            if (!isOnline) {
                return
            } else {
                // Guardar en el backend primero
                await dispatch(guardarVerSoloFavoritos(nuevoValor)).unwrap();
            }
            // ✅ El useEffect de Cuerpo.jsx detectará el cambio y recargará automáticamente
            // NO necesitas llamar a cargarAnotaciones() aquí
        } catch (error) {
            errorDesarrollo('Error al cambiar filtro de favoritos:', error);
        }
    }

    return (
        <div className="flex-shrink-0 p-2 z-10 w-full select-none">

            <div className="grid grid-cols-5 items-center">

                <div className="w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm cursor-pointer
                                flex items-center justify-center"
                    onClick={handleNavegarEstado}>
                    <p className="text-base md:text-lg
                                text-violet-800 dark:text-white">
                        Estados
                    </p>
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm cursor-pointer
                                flex items-center justify-center"
                    onClick={handleNavegarBuscar}>
                    <HiSearch className="text-2xl md:text-3xl text-violet-800 dark:text-white" />
                </div>

                <div className={`w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm  ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                flex items-center justify-center`}
                    onClick={handleVerModalCrearNota}>
                    <div className="bg-violet-800 rounded-[50%] p-2
                                flex item-center justify-center">
                        <HiPlus className="text-2xl md:text-3xl text-white" />
                    </div>
                </div>


                <div
                    onClick={handleToggleFavoritos}
                    className={`w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                text-2xl md:text-3xl text-violet-800 dark:text-white
                                rounded-sm 
                                ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                flex items-center justify-center`}>
                    {verSoloFavoritos ? <HiStar /> : <HiOutlineStar />}
                </div>

                <div className={`w-full h-full p-1 active:bg-gray-300 dark:active:bg-gray-600
                                rounded-sm
                                ${!isOnline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                flex items-center justify-center`}
                    onClick={handleOrganizacion}>
                    {organizarPorColumna && (
                        <HiMenuAlt3 className="text-2xl md:text-3xl text-violet-800 dark:text-white" />
                    )}

                    {!organizarPorColumna && (
                        <HiViewColumns className="text-2xl md:text-3xl text-violet-800 dark:text-white" />
                    )}

                    <HiArrowDown className="text-base md:text-lg text-violet-800 dark:text-white" />
                </div>
            </div>

        </div>
    );
}