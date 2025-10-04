import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";

import Footer from "./footer/Footer";

export default function PaginaRegIniSesion() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-800 
                        flex flex-col">
            <div className="flex-grow flex flex-col">
                <Cabecera
                    paginaRegIniSesion={true}
                />

                <Cuerpo />

                <Footer />
            </div>
        </div>
    );
}