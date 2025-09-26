import React from "react";

import { Routes, Route } from "react-router-dom";

import PanelPrincipal from "../paginas/pagina_principal/PanelPrincipal";
import CrearEditNota from "../paginas/crear_edit_nota/CrearEditNota";
import PaginaVistaPrevia from "../paginas/pagina_vista_previa/PaginaVistaPrevia";

export default function Rutas(){
    return(
        <Routes>
            <Route path="/" element={<PanelPrincipal />}></Route>
            <Route path="/agregar-nota" element={<CrearEditNota />}></Route>
            <Route path="/vista-previa/nota" element={<PaginaVistaPrevia />}></Route>
        </Routes>
    );
}