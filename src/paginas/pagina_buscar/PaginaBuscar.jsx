import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";

import Cuerpo from "../../componentes/cuerpo/Cuerpo";

export default function PaginaBuscar() {
    return (
        <div className="h-dvh bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden 
                        flex flex-col">
            <Cabecera
                paginaBusqueda={true}
                paginaPrincipal={false}
                paginaPapelera={false}
            />

            <div className="w-[95%] mx-auto mb-3">
                <input 
                    className="w-full text-base md:text-xl 
                                border-0 focus:outline-none
                                text-black dark:text-white"
                    placeholder="Notas" />
            </div>

            <Cuerpo 
                notaBusquedaNotaEliminada={false}
                notaNoEliminada={true}
                verNotaBusqueda={true}
            />
        </div>
    );
}