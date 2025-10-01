import React from "react";

import NotaVistaPrevia from "../../paginas/pagina_principal/cuerpo/nota_vista_previa/NotaVistaPrevia";

import EliminadaNotaVistaPrevia from "../../paginas/pagina_papelera/cuerpo/eliminada_nota_vista_previa/EliminadaNotaVistaPrevia";

import EstadosVistaPrevia from "../../paginas/pagina_estado/cuerpo/estados_vista_previa/EstadosVistaPrevia";

import { useSelector } from "react-redux";

export default function Cuerpo({ notaNoEliminada, notaBusquedaNotaEliminada,
    verContenidoCuerpo, verNotaBusqueda, verNotaEliminada, verTodosEstados }) {

    const organizarPorColumna = useSelector((state) => state.layout.organizarPorColumna);

    return (
        <>
            {notaNoEliminada && (
                <div className={`w-[95%] mx-auto overflow-y-auto 
                                overflow-x-hidden min-h-0 min-w-0 pb-3
                                grid
                ${organizarPorColumna ? 'grid-cols-2 2xs:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1'} gap-5 lg:gap-3`}>

                    {verContenidoCuerpo && (
                        Array.from({ length: 1 }, (_, index) => (
                            <NotaVistaPrevia texto="Hola mundo" key={index} />
                        ))
                    )}

                    {verContenidoCuerpo && (
                        Array.from({ length: 1 }, (_, index) => (
                            <NotaVistaPrevia texto="Hola mi nombre es Carlos Jose Cogollo Zapateiro tengo 29 años" key={index} />
                        ))
                    )}

                    {verContenidoCuerpo && (
                        Array.from({ length: 1 }, (_, index) => (
                            <NotaVistaPrevia texto="Soy ingeniero de software, estudie en la universidad de Cartagena, termine mis estudios hace 1 año y un poco mas" key={index} />
                        ))
                    )}

                    {verContenidoCuerpo && (
                        Array.from({ length: 17 }, (_, index) => (
                            <NotaVistaPrevia texto="Wandu se fue a la guerra que dolor que dolor que pena" key={index} />
                        ))
                    )}

                    {verNotaBusqueda && (
                        Array.from({ length: 4 }, (_, index) => (
                            <NotaVistaPrevia texto="Wandu se fue a la guerra que dolor que dolor que pena" key={index} />
                        ))
                    )}
                </div>
            )}

            {notaBusquedaNotaEliminada && (
                <div className="w-[95%] mx-auto overflow-y-auto 
                                overflow-x-hidden min-h-0 min-w-0 pb-3
                                grid grid-cols-1 gap-5 lg:gap-3">
                    {verNotaEliminada && (
                        Array.from({ length: 20 }, (_, index) => (
                            <EliminadaNotaVistaPrevia key={index} />
                        ))
                    )}

                    {verTodosEstados && (
                        <>
                            <EstadosVistaPrevia
                                tipoEstado="No asignado"
                                cantidadEstado="10"
                            />

                            <EstadosVistaPrevia
                                tipoEstado="Pendiente"
                                cantidadEstado="7"
                            />

                            <EstadosVistaPrevia
                                tipoEstado="Finalizado"
                                cantidadEstado="2"
                            />
                        </>
                    )}

                </div>
            )}

        </>
    );
}