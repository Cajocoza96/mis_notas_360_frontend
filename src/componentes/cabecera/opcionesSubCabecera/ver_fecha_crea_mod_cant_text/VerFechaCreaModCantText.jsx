import React from "react";

import SubOpcionesCabecera from "../SubOpcionesCabecera";

export default function VerFechaCreaModCantText() {
    return (
        <div className="w-full p-1 select-none
                        bg-white dark:bg-gray-800">

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Fecha de creación"
                fechaCantNumero="01/10/2025"
            />

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Fecha de modificación"
                fechaCantNumero="02/20/2025"
            />

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Cantidad de texto"
                fechaCantNumero="400"
            />

        </div>
    );
}