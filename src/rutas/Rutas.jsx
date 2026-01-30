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
import PaginaIntro from "../paginas/pagina_intro/PaginaIntro";

// Componentes
import RutaProtegida from "./RutaProtegida";
import RutaPublica from "./RutaPublica";
import RutaIntro from "./RutaIntro";
import RutaPrincipal from "./RutaPrincipal";
import RequiereBienvenida from "./RequiereBienvenida";
import PageTransition from "./PageTransition";

import useConexionInternet from "../hooks/useConexionInternet";

export default function Rutas() {
    const location = useLocation();
    const dispatch = useDispatch();

    const { isOnline } = useConexionInternet();

    useEffect(() => {
        // Resetear todos los estados cuando cambia la ruta
        dispatch(resetAllLayoutState());
        dispatch(resetAllTareasState());
        dispatch(resetAllANotacionesState());
        dispatch(resetAllAccesoState());
    }, [location.pathname, dispatch, !isOnline]);

    return (
        <Routes location={location} key={location.pathname}>

            <Route
                path="/pagina-intro"
                element={
                    <RutaProtegida>
                        <RutaIntro>
                            <PageTransition>
                                <PaginaIntro />
                            </PageTransition>
                        </RutaIntro>
                    </RutaProtegida>
                }
            />

            {/* Ruta principal - segunda vez en adelante */}
            <Route
                path="/"
                element={
                    <RequiereBienvenida>
                        <RutaPrincipal>
                            <PageTransition>
                                <PaginaBienvenida />
                            </PageTransition>
                        </RutaPrincipal>
                    </RequiereBienvenida>
                }
            />

            <Route
                path="/panel-principal"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PanelPrincipal />
                            </PageTransition>
                        </RequiereBienvenida>
                    </RutaProtegida>
                }
            />

            <Route
                path="/agregar-nota"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PaginaCrearEditNota />
                            </PageTransition>
                        </RequiereBienvenida>
                    </RutaProtegida>
                }
            />

            <Route
                path="/vista-previa/nota/:id"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PaginaVistaPrevia />
                            </PageTransition>
                        </RequiereBienvenida>
                    </RutaProtegida>
                }
            />

            <Route
                path="/editar/nota/:id"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PaginaCrearEditNota />
                            </PageTransition>
                        </RequiereBienvenida>
                    </RutaProtegida>
                }
            />

            <Route
                path="/buscar"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PaginaBuscar />
                            </PageTransition>
                        </RequiereBienvenida>
                    </RutaProtegida>
                }
            />

            <Route
                path="/papelera"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PaginaPapelera />
                            </PageTransition>
                        </RequiereBienvenida>
                    </RutaProtegida>
                }
            />

            <Route
                path="/estados"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PaginaEstado />
                            </PageTransition>
                        </RequiereBienvenida>
                    </RutaProtegida>
                }
            />

            <Route
                path="/informacion-usuario"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PaginaInfoUsuario />
                            </PageTransition>
                        </RequiereBienvenida>
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
                path="/problemas-conocidos"
                element={
                    <PageTransition>
                        <PaginaTerminosPoliticas />
                    </PageTransition>
                }
            />

            <Route
                path="/nota-no-encontrada"
                element={
                    <RutaProtegida>
                        <RequiereBienvenida>
                            <PageTransition>
                                <PaginaErrorNotaNoEncontrada />
                            </PageTransition>
                        </RequiereBienvenida>
                    </RutaProtegida>
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