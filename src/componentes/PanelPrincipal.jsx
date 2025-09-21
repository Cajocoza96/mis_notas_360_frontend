import React from "react";

import Cabecera from "./cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "./cuerpo/Cuerpo";

export default function PanelPrincipal() {

    return (
        <div className="h-[100svh] bg-white flex flex-col min-h-0 min-w-0 overflow-hidden">
            <Cabecera />

            <Cuerpo />

            <div className="flex-shrink-0 h-15 lg:h-18"></div>
            <Footer />
        </div>
    );
}