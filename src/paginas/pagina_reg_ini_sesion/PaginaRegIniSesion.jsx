import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";

import Footer from "./footer/Footer";

export default function PaginaRegIniSesion() {
    return (
        <div className="min-h-dvh bg-white dark:bg-gray-800 
                        overflow-hidden 
                        flex flex-col justify-between">
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