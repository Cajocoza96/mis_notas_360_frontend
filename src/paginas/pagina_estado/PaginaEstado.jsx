import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";

import Cuerpo from "../../componentes/cuerpo/Cuerpo";

export default function PaginaEstado(){
    return(
        <div className="h-[100svh] bg-white dark:bg-gray-800 
                        min-h-0 min-w-0 overflow-hidden 
                        flex flex-col">

        <Cabecera 
            paginaEstado={true}   
        />

        <Cuerpo 
            notaBusquedaNotaEliminada={true}
            verTodosEstados={true}
        />

        </div>
    );
}