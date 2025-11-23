import React from "react";

import infoTerminosPoliticas from "../../../data/infoTerminosPoliticas.json";

export default function Footer() {

    const infoMisNotas360 = infoTerminosPoliticas.seccionTerminosPoliticas;

    return (
        <div className="bg-violet-800 p-2 w-full select-none">
            <p className="text-sm md:text-base text-center text-white">
                <span>{infoMisNotas360.texto8fechaReservado} {infoMisNotas360.texto4MisNotas360} {infoMisNotas360.texto9DerechosReservados}</span>
            </p>
        </div>
    );
}


