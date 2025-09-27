import React from "react";

import { Routes, Route } from "react-router-dom";

import PanelPrincipal from "../paginas/pagina_principal/PanelPrincipal";
import PaginaCrearEditNota from "../paginas/Pagina_crear_edit_nota/PaginaCrearEditNota";
import PaginaVistaPrevia from "../paginas/pagina_vista_previa/PaginaVistaPrevia";
import PaginaBuscar from "../paginas/pagina_buscar/PaginaBuscar";
import PaginaPapelera from "../paginas/pagina_papelera/PaginaPapelera";

export default function Rutas(){
    return(
        <Routes>
            <Route path="/" element={<PanelPrincipal />}></Route>
            <Route path="/agregar-nota" element={<PaginaCrearEditNota />}></Route>
            <Route path="/vista-previa/nota" element={<PaginaVistaPrevia />}></Route>
            <Route path="/buscar" element={<PaginaBuscar />}></Route>
            <Route path="/papelera" element={<PaginaPapelera />}></Route>
        </Routes>
    );
}