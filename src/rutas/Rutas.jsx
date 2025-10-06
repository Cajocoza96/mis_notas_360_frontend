import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import PaginaBienvenida from "../paginas/pagina_bienvenida/PaginaBienvenida";
import PanelPrincipal from "../paginas/pagina_principal/PanelPrincipal";
import PaginaCrearEditNota from "../paginas/Pagina_crear_edit_nota/PaginaCrearEditNota";
import PaginaVistaPrevia from "../paginas/pagina_vista_previa/PaginaVistaPrevia";
import PaginaBuscar from "../paginas/pagina_buscar/PaginaBuscar";
import PaginaPapelera from "../paginas/pagina_papelera/PaginaPapelera";
import PaginaEstado from "../paginas/pagina_estado/PaginaEstado";

import PaginaRegIniSesion from "../paginas/pagina_reg_ini_sesion/PaginaRegIniSesion";

export default function Rutas() {

    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PaginaBienvenida />}></Route>
                <Route path="/panel-principal" element={<PanelPrincipal />}></Route>
                <Route path="/agregar-nota" element={<PaginaCrearEditNota />}></Route>
                <Route path="/vista-previa/nota" element={<PaginaVistaPrevia />}></Route>
                <Route path="/buscar" element={<PaginaBuscar />}></Route>
                <Route path="/papelera" element={<PaginaPapelera />}></Route>
                <Route path="/estados" element={<PaginaEstado />}></Route>

                <Route path="/registrar" element={<PaginaRegIniSesion />}></Route>
                <Route path="/iniciar-sesion" element={<PaginaRegIniSesion />}></Route>
            </Routes>
        </AnimatePresence>
    );
}