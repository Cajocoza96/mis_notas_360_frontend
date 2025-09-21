import React, { useState } from "react";

import Cabecera from "./cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "./cuerpo/Cuerpo";

export default function PanelPrincipal() {

    const [organizarPorColumna, setOrganizarPorColumna] = useState(true);

    const toggleOrganizarPorColumna = () => {
        setOrganizarPorColumna(!organizarPorColumna)
    }

    return (
        <div className="h-[100svh] bg-white flex flex-col min-h-0 min-w-0 overflow-hidden">
            <Cabecera 
                organizarPorColumna = {organizarPorColumna}
                toggleOrganizarPorColumna = {toggleOrganizarPorColumna}
            />

            <Cuerpo 
                organizarPorColumna = {organizarPorColumna}
            />

            <div className="flex-shrink-0 h-15 lg:h-18"></div>
            <Footer />
        </div>
    );
}