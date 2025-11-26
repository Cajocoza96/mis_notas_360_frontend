import React from "react";

import { useNavigate } from "react-router-dom";

import infoTerminosPoliticas from "../../../data/infoTerminosPoliticas.json";

export default function SeccionTerminosPoliticas() {

    const  inforTermPol = infoTerminosPoliticas.seccionTerminosPoliticas;

    const navigate = useNavigate();

    const handleTerminosDeServicio = () => navigate("/terminos-de-servicio");

    const handlePoliticaDePrivacidad = () => navigate("/politica-de-privacidad");
    

    return (
        <div className="w-full p-3 bg-violet-950 dark:bg-gray-900">
            <p className="text-xs md:text-sm text-center">
                <span className="text-gray-300 dark:text-gray-400">{inforTermPol.texto1}</span> <span onClick={handleTerminosDeServicio} className="text-white font-semibold cursor-pointer">{inforTermPol.texto2Terminos}</span> <span className="text-gray-300 dark:text-gray-400">{inforTermPol.texto3}</span>  <span translate="no" className="text-gray-300 dark:text-gray-400">{inforTermPol.texto4MisNotas360}</span> <span className="text-gray-300 dark:text-gray-400">{inforTermPol.texto5}</span> <span onClick={handlePoliticaDePrivacidad} className="text-white font-semibold cursor-pointer">{inforTermPol.texto6Politicas}</span> 
            </p>
        </div>
    );
}