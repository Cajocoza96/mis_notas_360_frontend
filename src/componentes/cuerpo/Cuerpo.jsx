import React from "react";

import NotaVistaPrevia from "./nota_vista_previa/NotaVistaPrevia";

export default function Cuerpo() {
    return (
        <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 pb-3
                        grid grid-cols-2 2xs:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-3">

            {Array.from({ length: 1 }, (_, index) => (
                <NotaVistaPrevia texto="Hola mundo" key={index} />
            ))}

            {Array.from({ length: 1 }, (_, index) => (
                <NotaVistaPrevia texto="Hola mi nombre es Carlos Jose Cogollo Zapateiro tengo 29 años" key={index} />
            ))}

            {Array.from({ length: 1 }, (_, index) => (
                <NotaVistaPrevia texto="Soy ingeniero de software, estudie en la universidad de Cartagena, termine mis estudios hace 1 año y un poco mas" key={index} />
            ))}

            {Array.from({ length: 17 }, (_, index) => (
                <NotaVistaPrevia texto="Wandu se fue a la guerra que dolor que dolor que pena" key={index} />
            ))}

        </div>
    );
}