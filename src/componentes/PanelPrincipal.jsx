import React from "react";

import { useSelector } from "react-redux";

import Cabecera from "./cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "./cuerpo/Cuerpo";
import ContOpSubCabecera from "./cabecera/opcionesSubCabecera/ContOpSubCabecera"

export default function PanelPrincipal() {

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    return (
        <div className="h-[100svh] bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden 
                        flex flex-col ">

            {verOpcionesCabecera && (
                <ContOpSubCabecera/>
            )}

            <Cabecera/>

            <Cuerpo />

            <div className="flex-shrink-0 h-15 lg:h-18"></div>
            <Footer />
        </div>
    );
}