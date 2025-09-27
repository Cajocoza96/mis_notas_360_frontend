import React from "react";

import Cabecera from "../../componentes/cabecera/Cabecera";

export default function PaginaPapelera(){
    return(
        <div className="h-[100svh] bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden 
                        flex flex-col">
            
            <Cabecera 
                paginaPapelera={true}
                papelera={true}
            />

        </div>
    );
}