import React from "react";

import NotaVistaPrevia from "./nota_vista_previa/NotaVistaPrevia";

export default function Cuerpo() {
    return (
        <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 pb-3
                        grid grid-cols-2 2xs:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-3  border border-red-600">

            {Array.from({ length: 1 }, (_, index) => (
                <NotaVistaPrevia texto="Hola mundo" key={index} />
            ))}

            {Array.from({ length: 4 }, (_, index) => (
                <NotaVistaPrevia texto="hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola hola" key={index} />
            ))}

        </div>
    );
}