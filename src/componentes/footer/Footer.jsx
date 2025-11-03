import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerModalEliminarTodasLasNotasDefinitivo } from "../../store/tareasSlice";

export default function Footer({ textoCantElimi }) {

    const dispatch = useDispatch();

    const handleVerModalEliminarTodasLasNotasDefinitivo = () => {
        dispatch(toggleVerModalEliminarTodasLasNotasDefinitivo());
    }

    return (
        <div
            onClick={handleVerModalEliminarTodasLasNotasDefinitivo}
            className="p-3 z-10  w-full
                        bg-red-600 cursor-pointer">

            <p className="w-full text-center text-base md:text-xl select-none truncate
                    text-white">
                {textoCantElimi}
            </p>

        </div>
    );
}