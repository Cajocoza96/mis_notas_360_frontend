import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "./cuerpo/Cuerpo";

export default function PaginaRegIniSesion(){
    return(
        <div className="h-[100svh] bg-white dark:bg-gray-800 
                        min-h-0 min-w-0 overflow-hidden 
                        flex flex-col">
        
        <Cabecera 
            paginaRegIniSesion={true}
        />

        <Cuerpo />
        </div>
    );
}