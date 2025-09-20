import React from "react";

import Cabecera from "./cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "./cuerpo/Cuerpo";

export default function PanelPrincipal() {

    return (
        <div className="h-[100svh] bg-white flex flex-col min-h-0">
            <Cabecera />
            <Cuerpo />
            <Footer />
        </div>
    );
}