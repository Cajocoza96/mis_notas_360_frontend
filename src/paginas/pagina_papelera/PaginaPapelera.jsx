import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Cuerpo from "../../componentes/cuerpo/Cuerpo";
import Footer from "../../componentes/footer/Footer";

export default function PaginaPapelera() {
    return (
        <div className="h-dvh bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden 
                        flex flex-col">

            <Cabecera
                paginaPapelera={true}
                papelera={true}
            />

            <Cuerpo
                notaNoEliminada={false}
                notaBusquedaNotaEliminada={true}
                verNotaEliminada={true}

            />

            <Footer
                eliminarTodo={true}
            />

        </div>
    );
}