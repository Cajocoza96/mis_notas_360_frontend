import React from "react";

import NotaVistaPrevia from "./nota_vista_previa/NotaVistaPrevia";

export default function Cuerpo(){
    return(
        <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 
                        flex flex-col flex-1 items-center gap-3 border border-black">

            {Array.from({ length: 10}, (_, index)=> (
                <NotaVistaPrevia key={index}/>
            ))}
            
        </div>
    );
}