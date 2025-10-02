import React from "react";

import { useSelector } from "react-redux";

export default function SubOpcionesCabecera({ circulo, nombreOpcion,
    textoFechaCanttexto, fechaCantNumero,
    className = "", ...props }) {

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const verOpcCabPagVisPrev = useSelector((state) => state.layout.verOpcCabPagVisPrev);

    return (
        <div className={`w-[95%] mx-auto flex flex-row items-center gap-2 ${className}`} {...props}>

            {verOpcionesCabecera && (
                <>
                    <p className="text-base md:text-xl px-1">
                        {nombreOpcion}
                    </p>
                    {circulo}
                </>
            )}

            {verOpcCabPagVisPrev && (
                <>
                    <p className="text-center text-base md:text-xl px-1 text-blue-600 dark:text-white">
                        {textoFechaCanttexto}
                    </p>

                    <p className="text-center text-base md:text-xl px-1 text-black dark:text-white">
                        {fechaCantNumero}
                    </p>
                </>
            )}

        </div>
    );
}