import React from "react";

import { useSelector } from "react-redux";

import Cabecera from "../../componentes/cabecera/Cabecera";
import Footer from "./footer/Footer";
import Cuerpo from "../../componentes/cuerpo/Cuerpo"
import ContOpSubCabecera from "../../componentes/cabecera/opcionesSubCabecera/ContOpSubCabecera";
import ModalConfirmacion from "../../componentes/modal/ModalConfirmacion";

import PaletaDeColores from "../../componentes/paleta_de_colores/PaletaDeColores";

export default function PanelPrincipal() {

    const verOpcionesCabecera = useSelector((state) => state.layout.verOpcionesCabecera);

    const verModalCrear = useSelector((state) => state.layout.verModalCrear);

    const verPaletaColores = useSelector((state) => state.layout.verPaletaColores);

    return (
        <div className="h-dvh bg-white dark:bg-gray-800 
                        overflow-hidden 
                        flex flex-col justify-between">

            {verOpcionesCabecera && (
                <ContOpSubCabecera />
            )}

            {verModalCrear && (
                <ModalConfirmacion textoPregunta="¿Desea crear una nota?" />
            )}

            {verPaletaColores && (
                <PaletaDeColores />
            )}

            <Cabecera
                paginaPrincipal={true}
                paginaBusqueda={false}
                paginaPapelera={false} />

            <Cuerpo
                notaBusquedaNotaEliminada={false}
                notaNoEliminada={true}
                verContenidoCuerpo={true}

            />
            <Footer />
        </div>
    );
}