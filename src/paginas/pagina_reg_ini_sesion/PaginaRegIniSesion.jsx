import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";

import Footer from "./footer/Footer";

export default function PaginaRegIniSesion() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-800 
                        grid grid-rows-[auto_1fr_auto]">
            <Cabecera
                paginaRegIniSesion={true}
            />

            <Cuerpo />

            <Footer />

        </div>
    );
}