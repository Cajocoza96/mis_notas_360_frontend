import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";

// Para resetear los estados redux cuando se regrese o adelante en la página
import { resetAllLayoutState } from "../store/layoutSlice";
import { resetAllTareasState } from "../store/tareasSlice";
import { resetAllANotacionesState } from "../store/anotacionesSlice";
import { resetAllAccesoState } from "../store/accesoSlice";

// Páginas
import PaginaBienvenida from "../paginas/pagina_bienvenida/PaginaBienvenida";
import PanelPrincipal from "../paginas/pagina_principal/PanelPrincipal";
import PaginaCrearEditNota from "../paginas/Pagina_crear_edit_nota/PaginaCrearEditNota";
import PaginaVistaPrevia from "../paginas/pagina_vista_previa/PaginaVistaPrevia";
import PaginaBuscar from "../paginas/pagina_buscar/PaginaBuscar";
import PaginaPapelera from "../paginas/pagina_papelera/PaginaPapelera";
import PaginaEstado from "../paginas/pagina_estado/PaginaEstado";
import PaginaInfoUsuario from "../paginas/pagina_info_usuario/PaginaInfoUsuario";
import PaginaRegIniSesion from "../paginas/pagina_reg_ini_sesion/PaginaRegIniSesion";
import PaginaTerminosPoliticas from "../paginas/pagina_terminos_politicas/PaginaTerminosPoliticas";
import PaginaErrorNotaNoEncontrada from "../paginas/pagina_error_nota_no_encontrada/PaginaErrorNotaNoEncontrada";

// Componentes
import RutaProtegida from "./RutaProtegida";
import RutaPublica from "./RutaPublica";
import PageTransition from "./PageTransition";

export default function Rutas() {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        // Resetear todos los estados cuando cambia la ruta
        dispatch(resetAllLayoutState());
        dispatch(resetAllTareasState());
        dispatch(resetAllANotacionesState());
        dispatch(resetAllAccesoState());
    }, [location.pathname, dispatch]);

    return (
        <Routes location={location} key={location.pathname}>
            <Route
                path="/"
                element={
                    <PageTransition>
                        <PaginaBienvenida />
                    </PageTransition>
                }
            />

            <Route
                path="/panel-principal"
                element={
                    <RutaProtegida>
                        <PageTransition>
                            <PanelPrincipal />
                        </PageTransition>
                    </RutaProtegida>
                }
            />

            <Route
                path="/agregar-nota"
                element={
                    <RutaProtegida>
                        <PageTransition>
                            <PaginaCrearEditNota />
                        </PageTransition>
                    </RutaProtegida>
                }
            />

            <Route
                path="/vista-previa/nota/:id"
                element={
                    <RutaProtegida>
                        <PageTransition>
                            <PaginaVistaPrevia />
                        </PageTransition>
                    </RutaProtegida>
                }
            />

            <Route
                path="/editar/nota/:id"
                element={
                    <RutaProtegida>
                        <PageTransition>
                            <PaginaCrearEditNota />
                        </PageTransition>
                    </RutaProtegida>
                }
            />

            <Route
                path="/buscar"
                element={
                    <RutaProtegida>
                        <PageTransition>
                            <PaginaBuscar />
                        </PageTransition>
                    </RutaProtegida>
                }
            />

            <Route
                path="/papelera"
                element={
                    <RutaProtegida>
                        <PageTransition>
                            <PaginaPapelera />
                        </PageTransition>
                    </RutaProtegida>
                }
            />

            <Route
                path="/estados"
                element={
                    <RutaProtegida>
                        <PageTransition>
                            <PaginaEstado />
                        </PageTransition>
                    </RutaProtegida>
                }
            />

            <Route
                path="/informacion-usuario"
                element={
                    <RutaProtegida>
                        <PageTransition>
                            <PaginaInfoUsuario />
                        </PageTransition>
                    </RutaProtegida>
                }
            />

            <Route
                path="/registrar"
                element={
                    <RutaPublica>
                        <PageTransition>
                            <PaginaRegIniSesion />
                        </PageTransition>
                    </RutaPublica>
                }
            />

            <Route
                path="/iniciar-sesion"
                element={
                    <RutaPublica>
                        <PageTransition>
                            <PaginaRegIniSesion />
                        </PageTransition>
                    </RutaPublica>
                }
            />

            <Route
                path="/terminos-de-servicio"
                element={
                    <PageTransition>
                        <PaginaTerminosPoliticas />
                    </PageTransition>
                }
            />

            <Route
                path="/politica-de-privacidad"
                element={
                    <PageTransition>
                        <PaginaTerminosPoliticas />
                    </PageTransition>
                }
            />

            <Route
                path="/informacion-eliminar-cuenta"
                element={
                    <PageTransition>
                        <PaginaTerminosPoliticas />
                    </PageTransition>
                }
            />

            <Route
                path="/nota-no-encontrada"
                element={
                    <PageTransition>
                        <PaginaErrorNotaNoEncontrada />
                    </PageTransition>
                }
            />

            <Route
                path="*"
                element={
                    <PageTransition>
                        <PaginaErrorNotaNoEncontrada />
                    </PageTransition>
                }
            />
        </Routes>
    );
}