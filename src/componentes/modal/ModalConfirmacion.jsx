import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { toggleVerMenuHamburguesa } from "../../store/layoutSlice";

import {
    toggleVerModalCrearNota, toggleVerModalPapeleraNota,
    toggleVerModalRestaurarNota, toggleVerModalEliminarNotaDefinitiva, 
    toggleVerModalEliminarTodasLasNotasDefinitivo
} from "../../store/tareasSlice";

import { toggleVerModalEliminarUsuario, toggleVerModalCerrarSesion } from "../../store/accesoSlice";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { useContadores } from "../../hooks/useContadores";

export default function ModalConfirmacion({ textoPregunta }) {
    const { actualizarContadores } = useContadores();
    
    const API_URL = import.meta.env.VITE_API_URL;
    const [procesando, setProcesando] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { cerrarSesion, eliminarCuenta } = useAuth();

    //Obtener la ID de la anotacion desde Redux
    const anotacionIdRedux = useSelector((state) => state.tareas.anotacionId);

    const crearNota = () => {
        dispatch(toggleVerModalCrearNota());
        navigate("/agregar-nota");
    };

    // Función para enviar la nota a la papelera
    const papeleraNota = async () => {
        if (!id) {
            console.error('No se encontró el ID de la anotación');
            return;
        }

        setProcesando(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/anotaciones/papelera/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                await actualizarContadores();
                console.log('Nota movida a papelera:', data);

                // Cerrar el modal
                dispatch(toggleVerModalPapeleraNota());

                // Navegar al panel principal
                navigate("/panel-principal");
            } else {
                const errorData = await response.json();
                console.error('Error al mover a papelera:', errorData);
                alert('Error al eliminar la nota. Por favor intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al mover a papelera:', error);
            alert('Error de conexión. Por favor verifica tu conexión a internet.');
        } finally {
            setProcesando(false);
        }
    };

    // Función para restaurar la nota desde la papelera
    const restaurarNota = async () => {

        // usar el ID de Redux (Para papelera) o el de params (Para vista previa)
        const anotacionId = anotacionIdRedux || id;

        if (!anotacionId) {
            console.error('No se encontró el ID de la anotación');
            alert('Error: No se pudo identificar la anotación');
            return;
        }

        setProcesando(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/anotaciones/restaurar/${anotacionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                await actualizarContadores();
                console.log('Nota restaurada desde la papelera:', data);

                // Cerrar el modal
                dispatch(toggleVerModalRestaurarNota());

                // Navegar al panel principal
                window.location.reload();
                navigate("/papelera");

            } else {
                const errorData = await response.json();
                console.error('Error al restaurar nota desde la papelera:', errorData);
                alert('Error al restaurar nota desde la papelera. Por favor intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al restaurar nota desde la papelera:', error);
            alert('Error de conexión. Por favor verifica tu conexión a internet.');
        } finally {
            setProcesando(false);
        }
    };

    // Función para eliminar la nota definitiva desde la papelera
    const EliminarNotaDefinitiva = async () => {

        // usar el ID de Redux (Para papelera) o el de params (Para vista previa)
        const anotacionId = anotacionIdRedux || id;

        if (!anotacionId) {
            console.error('No se encontró el ID de la anotación');
            alert('Error: No se pudo identificar la anotación');
            return;
        }

        setProcesando(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/anotaciones/eliminar-definitivamente/${anotacionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                await actualizarContadores();
                console.log('Nota eliminada definitivamente desde la papelera:', data);

                // Cerrar el modal
                dispatch(toggleVerModalEliminarNotaDefinitiva());

                // Navegar al panel principal
                window.location.reload();
                navigate("/papelera");
                
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar la nota definitivamente desde la papelera:', errorData);
                alert('Error al eliminar la nota definitivamente desde la papelera. Por favor intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al eliminar la nota definitivamente desde la papelera:', error);
            alert('Error de conexión. Por favor verifica tu conexión a internet.');
        } finally {
            setProcesando(false);
        }
    };


    // Función para eliminar todas la nota definitiva desde la papelera
    const EliminarTodasLasNotasDefinitiva = async () => {

        setProcesando(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/anotaciones/obtener-papelera/vaciar`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                await actualizarContadores();
                console.log('Han sido eliminada definitivamente todas las notas desde la papelera:', data);

                // Cerrar el modal
                dispatch(toggleVerModalEliminarTodasLasNotasDefinitivo());

                // Navegar al panel principal
                window.location.reload();
                navigate("/papelera");
                
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar todas las notas definitivamente desde la papelera:', errorData);
                alert('Error al eliminar todas las notas definitivamente desde la papelera. Por favor intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al eliminar todas las notas definitivamente desde la papelera:', error);
            alert('Error de conexión. Por favor verifica tu conexión a internet.');
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
    const verModalRestaurarNota = useSelector((state) => state.tareas.verModalRestaurarNota);
    const verModalEliminarNotaDefinitiva = useSelector((state) => state.tareas.verModalEliminarNotaDefinitiva);
    const verModalEliminarTodasLasNotasDefinitivo = useSelector((state) => state.tareas.verModalEliminarTodasLasNotasDefinitivo);

    const verModalEliminarUsuario = useSelector((state) => state.acceso.verModalEliminarUsuario);
    const verModalCerrarSesion = useSelector((state) => state.acceso.verModalCerrarSesion);

    // Función para manejar la acción de Aceptar
    const handleAceptar = async () => {
        if (verModalCrearNota) {
            crearNota();

            /*Esto tiene que ver para eso de la papelera */
        } else if (verModalPapeleraNota) {
            papeleraNota();
        } else if (verModalRestaurarNota) {
            restaurarNota();
        } else if (verModalEliminarNotaDefinitiva) {
            EliminarNotaDefinitiva();
        } else if (verModalEliminarTodasLasNotasDefinitivo) {
            EliminarTodasLasNotasDefinitiva();
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
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/70"
                onClick={() => {
                    if (procesando) return; // No permitir cerrar mientras procesa

                    if (verModalCrearNota) {
                        handleVerModalCrearNota();

                        /*Esto tiene que ver para eso de la papelera */
                    } else if (verModalPapeleraNota) {
                        handleVerModalPapeleraNota();
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
            </div>

            <div className="bg-white dark:bg-gray-800 select-none
                            z-50 p-3 overflow-hidden rounded-lg
                        absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2
                        w-[90%] max-w-md h-auto shadow-2xl">

                <div className="mx-auto w-full flex flex-col gap-4 2xl:gap-5">
                    <div className="flex flex-col gap-2">
                        <p className="text-base md:text-xl
                            text-black dark:text-white">
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
                            className={`text-base md:text-xl
                                        text-black dark:text-white 
                                        ${procesando ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={() => {
                                if (procesando) return;

                                if (verModalCrearNota) {
                                    handleVerModalCrearNota();

                                    /*Esto tiene que ver para eso de la papelera */
                                } else if (verModalPapeleraNota) {
                                    handleVerModalPapeleraNota();
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
                            className={`text-base md:text-xl
                                        text-blue-800 dark:text-blue-400 
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
        </>
    );
}