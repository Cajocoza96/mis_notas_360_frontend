import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";

import Footer from "./footer/Footer";

export default function PaginaRegIniSesion() {
    return (
        <div className="min-h-[100svh] bg-white dark:bg-gray-800 
                        min-w-0 overflow-hidden 
                        flex flex-col justify-between">
            <div>
                <Cabecera
                    paginaRegIniSesion={true}
                />

                <Cuerpo />
            </div>

            <div className="h-15 lg:h-18"></div>
            <Footer />

        </div>
    );
}