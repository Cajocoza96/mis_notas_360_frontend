import React from "react";

import { Routes, Route } from "react-router-dom";

import PanelPrincipal from "../paginas/pagina_principal/PanelPrincipal";
import CrearEditNota from "../paginas/crear_edit_nota/CrearEditNota";

export default function Rutas(){
    return(
        <Routes>
            <Route path="/" element={<PanelPrincipal />}></Route>
            <Route path="/agregar-nota" element={<CrearEditNota />}></Route>
        </Routes>
    );
}