import React from "react";

import { useSelector } from "react-redux";

import Cabecera from "./cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "./cuerpo/Cuerpo";

import ContOpCabecera from "./cabecera/opcionesCabecera/ContOpCabecera";

export default function PanelPrincipal() {

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    return (
        <div className="h-[100svh] bg-white min-h-0 min-w-0 overflow-hidden relative 
                        flex flex-col ">

            {verOpcionesCabecera && (
                <ContOpCabecera/>
            )}

            <Cabecera/>

            <Cuerpo />

            <div className="flex-shrink-0 h-15 lg:h-18"></div>
            <Footer />
        </div>
    );
}