import React from "react";

import { useSelector } from "react-redux";

import Cabecera from "./cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "./cuerpo/Cuerpo";
import ContOpSubCabecera from "./cabecera/opcionesSubCabecera/ContOpSubCabecera";
import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";

export default function PanelPrincipal() {

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const verModalCrear = useSelector((state) => state.layout.verModalCrear);

    return (
        <div className="h-[100svh] bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden 
                        flex flex-col">

            {verOpcionesCabecera && (
                <ContOpSubCabecera/>
            )}

            {verModalCrear && (
                <ModalConfirmacion textoPregunta="¿Desea crear una nota?"/>
            )}

            <Cabecera/>

            <Cuerpo />

            <div className="flex-shrink-0 h-15 lg:h-18"></div>
            <Footer />
        </div>
    );
}