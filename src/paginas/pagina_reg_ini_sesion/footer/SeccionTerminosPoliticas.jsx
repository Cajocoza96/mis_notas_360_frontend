import React from "react";

import infoTerminosPoliticas from "../../../data/infoTerminosPoliticas.json";

export default function SeccionTerminosPoliticas() {

    const  inforTermPol = infoTerminosPoliticas.seccionTerminosPoliticas;

    return (
        <div className="w-full p-3 bg-violet-700 dark:bg-gray-900">
            <p className="text-xs md:text-sm text-center">
                <span className="text-gray-400">{inforTermPol.texto1}</span> <span className="text-white font-semibold">{inforTermPol.texto2Terminos}</span> <span className="text-gray-400">{inforTermPol.texto3}</span>  <span className="text-gray-400">{inforTermPol.texto4MisNotas360}</span> <span className="text-gray-400">{inforTermPol.texto5}</span> <span className="text-white font-semibold">{inforTermPol.texto6Politicas}</span> 
            </p>
        </div>
    );
}