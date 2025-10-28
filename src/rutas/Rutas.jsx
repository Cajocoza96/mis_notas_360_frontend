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
import PaginaInfoUsuario from "../paginas/pagina_info_usuario/PaginaInfoUsuario";

import PaginaRegIniSesion from "../paginas/pagina_reg_ini_sesion/PaginaRegIniSesion";

import RutaProtegida from "./RutaProtegida";
import RutaPublica from "./RutaPublica";

import PaginaError from "../paginas/pagina_error/PaginaError";

export default function Rutas() {

    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                <Route path="*" element={<PaginaError />}></Route>

                <Route path="/" element={<PaginaBienvenida />}></Route>


                <Route path="/panel-principal"
                    element={
                        <RutaProtegida>
                            <PanelPrincipal />
                        </RutaProtegida>
                    }>

                </Route>

                {/* Ruta para agregar nueva nota */}
                <Route path="/agregar-nota"
                    element={
                        <RutaProtegida>
                            <PaginaCrearEditNota />
                        </RutaProtegida>
                    }>
                </Route>

                {/* Ruta para vista previa (solo lectura) */}
                <Route path="/vista-previa/nota/:id"
                    element={
                        <RutaProtegida>
                            <PaginaVistaPrevia />
                        </RutaProtegida>
                    }>
                </Route>

                {/* Ruta para editar nota existente */}
                <Route path="/editar/nota/:id"
                    element={
                        <RutaProtegida>
                            <PaginaCrearEditNota />
                        </RutaProtegida>
                    }>
                </Route>


                <Route path="/buscar"
                    element={
                        <RutaProtegida>
                            <PaginaBuscar />
                        </RutaProtegida>
                    }>
                </Route>

                <Route path="/papelera"
                    element={
                        <RutaProtegida>
                            <PaginaPapelera />
                        </RutaProtegida>
                    }>
                </Route>

                <Route path="/estados"
                    element={
                        <RutaProtegida>
                            <PaginaEstado />
                        </RutaProtegida>
                    }>
                </Route>

                <Route path="/informacion-usuario"
                    element={
                        <RutaProtegida>
                            <PaginaInfoUsuario />
                        </RutaProtegida>
                    }>
                </Route>



                <Route path="/registrar"
                    element={
                        <RutaPublica>
                            <PaginaRegIniSesion />
                        </RutaPublica>
                    }>
                </Route>


                <Route path="/iniciar-sesion"
                    element={
                        <RutaPublica>
                            <PaginaRegIniSesion />
                        </RutaPublica>
                    }>
                </Route>


            </Routes>
        </AnimatePresence>
    );
}