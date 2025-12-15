import React from "react";

import { useDispatch } from "react-redux";

import { useLocation } from "react-router-dom";

import { toggleVerModalEliminarTodasLasNotasDefinitivo } from "../../store/tareasSlice";

import useConexionInternet from "../../hooks/useConexionInternet";

export default function Footer({ textoCantElimi }) {

    const { isOnline } = useConexionInternet();

    const location = useLocation();

    const esPapelera = location.pathname.includes('/papelera');

    const dispatch = useDispatch();

    const handleVerModalEliminarTodasLasNotasDefinitivo = () => {
        dispatch(toggleVerModalEliminarTodasLasNotasDefinitivo());
    }

    return (
        <>
            {isOnline && esPapelera && (
                <div
                    onClick={handleVerModalEliminarTodasLasNotasDefinitivo}
                    className="p-3 z-10  w-full
                        bg-red-600 cursor-pointer">

                    <p className="w-full text-center text-base md:text-lg select-none truncate
                    text-white">
                        {textoCantElimi}
                    </p>

                </div>
            )}
        </>

    );
}