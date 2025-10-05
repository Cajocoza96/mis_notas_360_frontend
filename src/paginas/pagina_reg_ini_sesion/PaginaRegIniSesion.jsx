import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";

import Footer from "./footer/Footer";

export default function PaginaRegIniSesion() {
    return (
        <div className="min-h-dvh w-full bg-white dark:bg-gray-800 
                        overflow-x-hidden overscroll-none
                        flex flex-col justify-between">

            <div className="flex-1 min-h-0">
                <Cabecera
                    paginaRegIniSesion={true}
                />

                <Cuerpo />
            </div>


            <Footer />

        </div>
    );
}