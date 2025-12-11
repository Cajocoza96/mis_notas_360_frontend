import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { motion } from "framer-motion";

import { toggleVerMenuHamburguesa } from "../../store/layoutSlice";

import {
    restaurarAnotacion, papeleraAnotacion, eliminarAnotacion, eliminarMultiplesAnotaciones,
    eliminarTodasAnotaciones, mostrarNotificacion, ocultarNotificacion
} from "../../store/anotacionesSlice";

import {
    toggleVerModalCrearNota, toggleVerModalPapeleraNota, toggleVerModalPapeleraTodasLasNotas,
    toggleVerModalRestaurarNota, toggleVerModalEliminarNotaDefinitiva,
    toggleVerModalEliminarTodasLasNotasDefinitivo
} from "../../store/tareasSlice";

import { toggleVerModalEliminarUsuario, toggleVerModalCerrarSesion } from "../../store/accesoSlice";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { useContadores } from "../../hooks/useContadores";

import {
    moverAPapelera, moverTodasAPapelera,
    restaurarDesdePapelera,
    eliminarDefinitivamente, eliminarTodasDefinitivamente,
    vaciarPapelera
} from "../../services/anotacionesService";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../utils/errorHandler";

export default function ModalConfirmacion({ textoPregunta, restaurarTexto, eliminarPregunta, eliminarAceptar }) {
    const location = useLocation();

    const { actualizarContadores } = useContadores();

    const [procesando, setProcesando] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { cerrarSesion, eliminarCuenta } = useAuth();

    const anotacionesSeleccionadas = useSelector((state) => state.anotaciones.anotacionesSeleccionadas);

    // Determinar si estamos en modo vista previa para ir a panel principal
    const esModoVistaPrevia = location.pathname.includes('/vista-previa/nota/');

    const esPanelPrincipal = location.pathname.includes('/panel-principal');

    //Obtener la ID de la anotacion desde Redux
    const anotacionIdRedux = useSelector((state) => state.tareas.anotacionId);

    const crearNota = () => {
        dispatch(toggleVerModalCrearNota());
        navigate("/agregar-nota");
    };

    // Función para enviar la nota a la papelera
    const papeleraNota = async () => {

        // usar el ID de Redux (Para papelera) o el de params (Para vista previa)
        const anotacionId = anotacionIdRedux || id;

        if (!anotacionId) {
            errorDesarrollo('No se encontró el ID de la anotación');
            alert('Error: No se pudo identificar la anotación');
            return;
        }

        setProcesando(true);

        try {
            const data = await moverAPapelera(anotacionId);

            await actualizarContadores();
            logDesarrollo('Nota movida a papelera:', data);

            // Actualizar Redux: eliminar la anotación de la lista
            dispatch(papeleraAnotacion(anotacionId));

            // Cerrar el modal
            dispatch(toggleVerModalPapeleraNota());

            // ✅ Mostrar notificación de éxito para enviar a papelera
            dispatch(mostrarNotificacion({
                mensaje: '¡Nota enviada a papelera!',
                esError: false
            }));

            // Ocultar el modal automaticamente despues de 3 segundos
            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);


            if (!esPanelPrincipal) {
                setTimeout(() => {
                    // Navegar al panel principal
                    navigate("/panel-principal");
                }, 2000);
            }


        } catch (error) {

            // Cerrar el modal
            dispatch(toggleVerModalPapeleraNota());

            // ✅ Mostrar notificación de error
            dispatch(mostrarNotificacion({
                mensaje: '¡Error al enviar la nota a la papelera!',
                esError: true
            }));

            // Ocultar el modal automaticamente despues de 2 segundos
            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

        } finally {
            setProcesando(false);
        }
    };

    // Función para mover múltiples notas a papelera
    const papeleraTodasLasNotas = async () => {
        setProcesando(true);

        try {
            // Verificar que hay anotaciones seleccionadas
            if (!anotacionesSeleccionadas || anotacionesSeleccionadas.length === 0) {
                throw new Error('No hay anotaciones seleccionadas');
            }

            logDesarrollo('📤 IDs a mover a papelera:', anotacionesSeleccionadas);
            
            const data = await moverTodasAPapelera(anotacionesSeleccionadas, false);

            await actualizarContadores();
            logDesarrollo('✅ Notas movidas a papelera:', data);

            // Eliminar las anotaciones de la vista
            dispatch(eliminarMultiplesAnotaciones(anotacionesSeleccionadas));

            // Cerrar el modal
            dispatch(toggleVerModalPapeleraTodasLasNotas());

            // Mostrar notificación de éxito
            dispatch(mostrarNotificacion({
                mensaje: `¡${anotacionesSeleccionadas.length} ${anotacionesSeleccionadas.length === 1 ? 'nota enviada a la papelera!' : 'notas enviadas a la papelera!'}`,
                esError: false
            }));

            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

        } catch (error) {
            errorDesarrollo('❌ Error al mover notas a papelera:', error);
            
            dispatch(toggleVerModalPapeleraTodasLasNotas());

            dispatch(mostrarNotificacion({
                mensaje: `${anotacionesSeleccionadas.length === 1 ? '¡Error al enviar la nota a la papelera!' : '¡Error al enviar las notas a la papelera!'}`,
                esError: true
            }));

            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

        } finally {
            setProcesando(false);
        }
    };

    // Función para restaurar la nota desde la papelera
    const restaurarNota = async () => {

        // usar el ID de Redux (Para papelera) o el de params (Para vista previa)
        const anotacionId = anotacionIdRedux || id;

        if (!anotacionId) {
            errorDesarrollo('No se encontró el ID de la anotación');
            alert('Error: No se pudo identificar la anotación');
            return;
        }

        setProcesando(true);

        try {
            const data = await restaurarDesdePapelera(anotacionId);

            await actualizarContadores();
            logDesarrollo('Nota restaurada desde la papelera:', data);

            // Actualizar Redux: eliminar la anotación de la lista de papelera
            dispatch(restaurarAnotacion(anotacionId));

            // Cerrar el modal
            dispatch(toggleVerModalRestaurarNota());

            // ✅ Mostrar notificación de éxito para restaurar
            dispatch(mostrarNotificacion({
                mensaje: '¡Nota restaurada!',
                esError: false
            }));

            // Ocultar el modal automaticamente despues de 2 segundos
            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

        } catch (error) {

            // Cerrar el modal
            dispatch(toggleVerModalRestaurarNota());

            // ✅ Mostrar notificación de error
            dispatch(mostrarNotificacion({
                mensaje: '¡Error al restaurar la nota!',
                esError: true
            }));

            // Ocultar el modal automaticamente despues de 2 segundos
            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

        } finally {
            setProcesando(false);
        }
    };

    // Función para eliminar la nota definitiva desde la papelera
    const eliminarNotaDefinitiva = async () => {

        // usar el ID de Redux (Para papelera) o el de params (Para vista previa)
        const anotacionId = anotacionIdRedux || id;

        if (!anotacionId) {
            errorDesarrollo('No se encontró el ID de la anotación');
            alert('Error: No se pudo identificar la anotación');
            return;
        }

        setProcesando(true);

        try {
            const data = await eliminarDefinitivamente(anotacionId);

            await actualizarContadores();

            logDesarrollo(`Nota eliminada definitivamente desde la ${esModoVistaPrevia ? 'vista previa' : 'papelera'}`, data);

            // Actualizar Redux: eliminar la anotación de la lista de papelera
            dispatch(eliminarAnotacion(anotacionId));

            // Cerrar el modal
            dispatch(toggleVerModalEliminarNotaDefinitiva());

            // ✅ Mostrar notificación de éxito para enviar a papelera
            dispatch(mostrarNotificacion({
                mensaje: '¡Nota eliminada definitivamente!',
                esError: false
            }));

            // Ocultar el modal automaticamente despues de 3 segundos
            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

            if (esModoVistaPrevia) {
                setTimeout(() => {
                    // Navegar al panel principal
                    navigate("/panel-principal");
                }, 2000);
            }

        } catch (error) {

            // Cerrar el modal
            dispatch(toggleVerModalEliminarNotaDefinitiva());

            // ✅ Mostrar notificación de error
            dispatch(mostrarNotificacion({
                mensaje: '¡Error al eliminar la nota definitivamente!',
                esError: true
            }));

            // Ocultar el modal automaticamente despues de 2 segundos
            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

        } finally {
            setProcesando(false);
        }
    };


    // Función que elimina definitivamente las anotaciones en papelera o pagina principal
    const eliminarTodasLasNotasDefinitiva = async () => {
        setProcesando(true);

        try {
            let data;
            let cantidadEliminadas = 0;
            
            // Si estamos en /papelera, vaciar papelera
            if (location.pathname.includes('/papelera')) {
                data = await vaciarPapelera();
                cantidadEliminadas = data.cantidad || 0; // Asumiendo que el backend devuelve la cantidad
                
                logDesarrollo('✅ Han sido eliminadas definitivamente todas las notas desde la papelera:', data);
                
                // Actualizar Redux: limpiar todas las anotaciones
                dispatch(eliminarTodasAnotaciones());
                
            } else {
                // Si estamos en /panel-principal, eliminar las seleccionadas
                if (!anotacionesSeleccionadas || anotacionesSeleccionadas.length === 0) {
                    throw new Error('No hay anotaciones seleccionadas');
                }
                
                cantidadEliminadas = anotacionesSeleccionadas.length;
                
                logDesarrollo('📤 IDs a eliminar definitivamente:', anotacionesSeleccionadas);
                
                data = await eliminarTodasDefinitivamente(anotacionesSeleccionadas, false);
                
                logDesarrollo('✅ Notas eliminadas definitivamente:', data);
                
                // Eliminar las anotaciones de la vista
                dispatch(eliminarMultiplesAnotaciones(anotacionesSeleccionadas));
            }

            await actualizarContadores();

            // Cerrar el modal
            dispatch(toggleVerModalEliminarTodasLasNotasDefinitivo());

            // Mostrar notificación de éxito
            dispatch(mostrarNotificacion({
                mensaje: `¡${cantidadEliminadas} ${cantidadEliminadas === 1 ? 'nota eliminada definitivamente!' : 'notas eliminadas definitivamente!'} `,
                esError: false
            }));

            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

        } catch (error) {
            errorDesarrollo('❌ Error al eliminar notas definitivamente:', error);
            
            dispatch(toggleVerModalEliminarTodasLasNotasDefinitivo());

            dispatch(mostrarNotificacion({
                mensaje: `${cantidadEliminadas === 1 ? '¡Error al eliminar la nota definitivamente!' : '¡Error al eliminar las notas definitivamente!'}`,
                esError: true
            }));

            setTimeout(() => {
                dispatch(ocultarNotificacion());
            }, 2000);

        } finally {
            setProcesando(false);
        }
    };

    const handleVerModalCrearNota = () => {
        dispatch(toggleVerModalCrearNota());
    };

    const handleVerModalPapeleraNota = () => {
        dispatch(toggleVerModalPapeleraNota());
    }

    const handleVerModalPapeleraTodasLasNotas = () => {
        dispatch(toggleVerModalPapeleraTodasLasNotas());
    }

    const handleVerModalRestaurarNota = () => {
        dispatch(toggleVerModalRestaurarNota());
    }

    const handleVerModalEliminarNotaDefinitiva = () => {
        dispatch(toggleVerModalEliminarNotaDefinitiva());
    }

    const handleVerModalEliminarTodasLasNotasDefinitivo = () => {
        dispatch(toggleVerModalEliminarTodasLasNotasDefinitivo());
    }

    const handleVerModalEliminarUsuario = () => {
        dispatch(toggleVerModalEliminarUsuario());
    };

    const handleVerModalCerrarSesion = () => {
        dispatch(toggleVerModalCerrarSesion());
    };

    const verModalCrearNota = useSelector((state) => state.tareas.verModalCrearNota);
    const verModalPapeleraNota = useSelector((state) => state.tareas.verModalPapeleraNota);
    const verModalPapeleraTodasLasNotas = useSelector((state) => state.tareas.verModalPapeleraTodasLasNotas);
    const verModalRestaurarNota = useSelector((state) => state.tareas.verModalRestaurarNota);
    const verModalEliminarNotaDefinitiva = useSelector((state) => state.tareas.verModalEliminarNotaDefinitiva);
    const verModalEliminarTodasLasNotasDefinitivo = useSelector((state) => state.tareas.verModalEliminarTodasLasNotasDefinitivo);

    const verModalEliminarUsuario = useSelector((state) => state.acceso.verModalEliminarUsuario);
    const verModalCerrarSesion = useSelector((state) => state.acceso.verModalCerrarSesion);

    // Función para manejar la acción de Aceptar
    const handleAceptar = async () => {
        if (verModalCrearNota) {
            crearNota();
        } else if (verModalPapeleraNota) {
            papeleraNota();
        } else if (verModalPapeleraTodasLasNotas) {
            papeleraTodasLasNotas();
        } else if (verModalRestaurarNota) {
            restaurarNota();
        } else if (verModalEliminarNotaDefinitiva) {
            eliminarNotaDefinitiva();
        } else if (verModalEliminarTodasLasNotasDefinitivo) {
            eliminarTodasLasNotasDefinitiva();
        } else if (verModalEliminarUsuario) {
            setProcesando(true);
            dispatch(toggleVerMenuHamburguesa());
            const resultado = await eliminarCuenta();
            setProcesando(false);

            if (!resultado.exito) {
                // El error ya se maneja en el hook, aquí solo cerramos el modal
                handleVerModalEliminarUsuario();
            }
            // Si fue exitoso, la navegación ya se hizo en el hook
        } else if (verModalCerrarSesion) {
            setProcesando(true);

            requestAnimationFrame(() => {
                dispatch(toggleVerMenuHamburguesa());
                cerrarSesion();
                // No necesitamos setProcesando(false) porque ya navegamos
            })
        }
    }

    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 bg-black/70
                            flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                    if (procesando) return; // No permitir cerrar mientras procesa

                    if (verModalCrearNota) {
                        handleVerModalCrearNota();

                        /*Esto tiene que ver para eso de la papelera */
                    } else if (verModalPapeleraNota) {
                        handleVerModalPapeleraNota();
                    } else if (verModalPapeleraTodasLasNotas) {
                        handleVerModalPapeleraTodasLasNotas();
                    } else if (verModalRestaurarNota) {
                        handleVerModalRestaurarNota();
                    } else if (verModalEliminarNotaDefinitiva) {
                        handleVerModalEliminarNotaDefinitiva();
                    } else if (verModalEliminarTodasLasNotasDefinitivo) {
                        handleVerModalEliminarTodasLasNotasDefinitivo();
                    } else if (verModalEliminarUsuario) {
                        handleVerModalEliminarUsuario();
                    } else if (verModalCerrarSesion) {
                        handleVerModalCerrarSesion();
                    }
                }}>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 select-none
                            z-50 p-3 overflow-hidden rounded-lg
                            w-[90%] h-auto shadow-2xl">

                    <div className="mx-auto w-full flex flex-col gap-4 2xl:gap-5">
                        <div className="flex flex-col gap-2">
                            <p className={`text-base md:text-lg
                                    ${restaurarTexto ? 'text-blue-600 dark:text-blue-500' :
                                    eliminarPregunta ? 'text-red-600 dark:text-red-500' : 'text-black dark:text-white'}`}>
                                {textoPregunta}
                            </p>

                            {procesando && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Procesando...
                                </p>
                            )}
                        </div>

                        <div className="flex flex-row items-center justify-end gap-6 2xl:gap-7">
                            <p
                                className={`text-base md:text-lg
                                        text-black dark:text-white 
                                        ${procesando ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={() => {
                                    if (procesando) return;

                                    if (verModalCrearNota) {
                                        handleVerModalCrearNota();

                                        /*Esto tiene que ver para eso de la papelera */
                                    } else if (verModalPapeleraNota) {
                                        handleVerModalPapeleraNota();
                                    } else if (verModalPapeleraTodasLasNotas) {
                                        handleVerModalPapeleraTodasLasNotas();
                                    } else if (verModalRestaurarNota) {
                                        handleVerModalRestaurarNota();
                                    } else if (verModalEliminarNotaDefinitiva) {
                                        handleVerModalEliminarNotaDefinitiva();
                                    } else if (verModalEliminarTodasLasNotasDefinitivo) {
                                        handleVerModalEliminarTodasLasNotasDefinitivo();
                                    } else if (verModalEliminarUsuario) {
                                        handleVerModalEliminarUsuario();
                                    } else if (verModalCerrarSesion) {
                                        handleVerModalCerrarSesion();
                                    }
                                }}>
                                Cancelar
                            </p>

                            <p
                                className={`text-base md:text-lg
                                        ${restaurarTexto ? 'text-blue-600 dark:text-blue-500' :
                                        eliminarAceptar ? 'text-red-600 dark:text-red-500' : 'text-violet-800 dark:text-violet-400'} 
                                        ${procesando ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer font-semibold'}`}
                                onClick={() => {
                                    if (procesando) return;
                                    handleAceptar();
                                }}>
                                {procesando ? 'Procesando...' : 'Aceptar'}
                            </p>
                        </div>
                    </div>
                </div>

            </motion.div>
        </>
    );

};
