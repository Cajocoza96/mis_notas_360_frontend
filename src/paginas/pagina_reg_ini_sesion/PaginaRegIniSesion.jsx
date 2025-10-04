import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";

import Footer from "./footer/Footer";

export default function PaginaRegIniSesion() {
    return (
        <div className="min-h-[100svh] bg-white dark:bg-gray-800 
                        min-w-0 overflow-hidden 
                        grid grid-rows-[1fr_auto]">
            <div>
                <Cabecera
                    paginaRegIniSesion={true}
                />

                <Cuerpo />
            </div>

            <Footer />
        </div>
    );
}