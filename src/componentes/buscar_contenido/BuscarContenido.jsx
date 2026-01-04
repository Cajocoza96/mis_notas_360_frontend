import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    toggleVerInputBusqueda,
    setTerminoBusqueda,
    setCoincidenciaActual,
    setTotalCoincidencias
} from "../../store/tareasSlice";
import { HiSearch, HiChevronUp, HiChevronDown, HiX } from "react-icons/hi";

export default function BuscarContenido() {
    const verInputBusqueda = useSelector((state) => state.tareas.verInputBusqueda);
    const terminoBusqueda = useSelector((state) => state.tareas.terminoBusqueda);
    const coincidenciaActual = useSelector((state) => state.tareas.coincidenciaActual);
    const totalCoincidencias = useSelector((state) => state.tareas.totalCoincidencias);
    const titulo = useSelector((state) => state.tareas.titulo);
    const nota = useSelector((state) => state.tareas.nota);
    const tareas = useSelector((state) => state.tareas.tareas);
    const { anotacionActual } = useSelector((state) => state.anotaciones);

    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const coincidenciasRef = useRef([]);
    const actualizacionTimeoutRef = useRef(null);
    const [isUserTyping, setIsUserTyping] = useState(false);

    const handleVerInputBusqueda = () => {
        dispatch(toggleVerInputBusqueda());
        if (verInputBusqueda) {
            // Limpiar búsqueda al cerrar
            dispatch(setTerminoBusqueda(""));
            dispatch(setCoincidenciaActual(0));
            dispatch(setTotalCoincidencias(0));
            limpiarResaltados();
        }
    };

    // Enfocar el input cuando se abre
    useEffect(() => {
        if (verInputBusqueda && inputRef.current) {
            inputRef.current.focus();
        }
    }, [verInputBusqueda]);

    const limpiarResaltados = () => {
        // Limpiar resaltados en título
        const tituloElement = document.querySelector('[data-campo="titulo"]');
        if (tituloElement) {
            const textoOriginal = tituloElement.innerText;
            tituloElement.innerHTML = "";
            tituloElement.innerText = textoOriginal;
        }

        const tituloElement2 = document.querySelector('[data-campo="titulo-2"]');
        if (tituloElement2) {
            const textoOriginal = tituloElement2.innerText;
            tituloElement2.innerHTML = "";
            tituloElement2.innerText = textoOriginal;
        }

        // Limpiar resaltados en nota
        const notaElement = document.querySelector('[data-campo="nota"]');
        if (notaElement) {
            const textoOriginal = notaElement.innerText;
            notaElement.innerHTML = "";
            notaElement.innerText = textoOriginal;
        }

        // Limpiar resaltados en tareas
        const tareasElements = document.querySelectorAll('[data-tarea-texto]');
        tareasElements.forEach(tareaElement => {
            const textoOriginal = tareaElement.innerText;
            tareaElement.innerHTML = "";
            tareaElement.innerText = textoOriginal;
        });

        coincidenciasRef.current = [];
    };

    // ✅ Función para guardar la posición del cursor
    const guardarPosicionCursor = (elemento) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;

        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(elemento);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        const offset = preCaretRange.toString().length;

        return offset;
    };

    // ✅ Función para restaurar la posición del cursor
    const restaurarPosicionCursor = (elemento, offset) => {
        if (offset === null || offset === undefined) return;

        const selection = window.getSelection();
        const range = document.createRange();

        let charCount = 0;
        let nodeStack = [elemento];
        let node;
        let foundStart = false;

        while (!foundStart && (node = nodeStack.pop())) {
            if (node.nodeType === Node.TEXT_NODE) {
                const nextCharCount = charCount + node.length;
                if (offset <= nextCharCount) {
                    range.setStart(node, offset - charCount);
                    range.setEnd(node, offset - charCount);
                    foundStart = true;
                }
                charCount = nextCharCount;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        if (foundStart) {
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const buscarCoincidencias = (termino) => {
        if (!termino || termino.trim() === "") {
            limpiarResaltados();
            dispatch(setCoincidenciaActual(0));
            dispatch(setTotalCoincidencias(0));
            return;
        }

        const terminoLower = termino.toLowerCase();
        let indiceGlobal = 0;
        const nuevasCoincidencias = [];

        // Función para resaltar texto
        const resaltarTexto = (elemento, texto, campo, tareaId = null) => {
            if (!texto) return;

            // ✅ Guardar posición del cursor ANTES de modificar
            const esFocused = document.activeElement === elemento;
            const cursorOffset = esFocused ? guardarPosicionCursor(elemento) : null;

            const textoLower = texto.toLowerCase();
            let lastIndex = 0;
            const fragments = [];

            let index = textoLower.indexOf(terminoLower);
            while (index !== -1) {
                // Texto antes de la coincidencia
                if (index > lastIndex) {
                    fragments.push(document.createTextNode(texto.substring(lastIndex, index)));
                }

                // Coincidencia resaltada
                const span = document.createElement('span');
                span.className = 'busqueda-highlight';
                span.setAttribute('data-indice', indiceGlobal);
                span.textContent = texto.substring(index, index + termino.length);
                fragments.push(span);

                // Guardar referencia de la coincidencia
                nuevasCoincidencias.push({
                    elemento: span,
                    campo,
                    tareaId,
                    indice: indiceGlobal
                });

                indiceGlobal++;
                lastIndex = index + termino.length;
                index = textoLower.indexOf(terminoLower, lastIndex);
            }

            // Texto después de la última coincidencia
            if (lastIndex < texto.length) {
                fragments.push(document.createTextNode(texto.substring(lastIndex)));
            }

            // Limpiar y agregar fragmentos
            elemento.innerHTML = "";
            fragments.forEach(frag => elemento.appendChild(frag));

            // ✅ Restaurar posición del cursor DESPUÉS de modificar
            if (esFocused && cursorOffset !== null) {
                requestAnimationFrame(() => {
                    restaurarPosicionCursor(elemento, cursorOffset);
                });
            }
        };

        // Buscar en título
        const tituloElement = document.querySelector('[data-campo="titulo"]');
        if (tituloElement && titulo) {
            resaltarTexto(tituloElement, titulo, 'titulo');
        }

        // Buscar en título 2
        const tituloElement2 = document.querySelector('[data-campo="titulo-2"]');
        if (tituloElement2 && anotacionActual.titulo) {
            resaltarTexto(tituloElement2, anotacionActual.titulo, 'titulo-2');
        }

        // Buscar en nota
        const notaElement = document.querySelector('[data-campo="nota"]');
        if (notaElement && nota) {
            resaltarTexto(notaElement, nota, 'nota');
        }

        // Buscar en tareas
        tareas.forEach(tarea => {
            const tareaElement = document.querySelector(`[data-tarea-id="${tarea.id}"]`);
            if (tareaElement && tarea.texto) {
                resaltarTexto(tareaElement, tarea.texto, 'tarea', tarea.id);
            }
        });

        coincidenciasRef.current = nuevasCoincidencias;

        // Actualizar totales
        dispatch(setTotalCoincidencias(nuevasCoincidencias.length));

        if (nuevasCoincidencias.length > 0) {
            // Mantener la coincidencia actual si es válida, sino ir a la primera
            const nuevaCoincidenciaActual = coincidenciaActual > 0 && coincidenciaActual <= nuevasCoincidencias.length
                ? coincidenciaActual
                : 1;
            dispatch(setCoincidenciaActual(nuevaCoincidenciaActual));
            scrollACoincidencia(nuevaCoincidenciaActual - 1);
        } else {
            dispatch(setCoincidenciaActual(0));
        }
    };

    const scrollACoincidencia = (indice) => {
        // Remover resaltado activo anterior
        document.querySelectorAll('.busqueda-highlight-active').forEach(el => {
            el.classList.remove('busqueda-highlight-active');
        });

        // Agregar resaltado activo a la coincidencia actual
        const coincidencia = coincidenciasRef.current[indice];
        if (coincidencia && coincidencia.elemento) {
            coincidencia.elemento.classList.add('busqueda-highlight-active');

            // ✅ Hacer scroll solo dentro del contenedor, no de toda la página
            // Buscar el contenedor con scroll (CuerpoEdicion o Cabecera)
            let contenedor = coincidencia.elemento.closest('.overflow-y-auto');

            if (contenedor) {
                // Obtener posiciones
                const elementoRect = coincidencia.elemento.getBoundingClientRect();
                const contenedorRect = contenedor.getBoundingClientRect();

                // Calcular el offset relativo al contenedor
                const offsetTop = coincidencia.elemento.offsetTop;
                const contenedorHeight = contenedor.clientHeight;
                const elementoHeight = coincidencia.elemento.offsetHeight;

                // Calcular la posición para centrar el elemento
                const scrollTop = offsetTop - (contenedorHeight / 2) + (elementoHeight / 2);

                // Hacer scroll suave solo dentro del contenedor
                contenedor.scrollTo({
                    top: Math.max(0, scrollTop),
                    behavior: 'smooth'
                });
            } else {
                // Fallback: si no encontramos el contenedor, usar scrollIntoView pero con block: 'nearest'
                coincidencia.elemento.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        }
    };

    const handleInputChange = (e) => {
        const valor = e.target.value;
        dispatch(setTerminoBusqueda(valor));
        buscarCoincidencias(valor);
    };

    const irASiguiente = () => {
        if (totalCoincidencias === 0) return;

        const siguiente = coincidenciaActual >= totalCoincidencias ? 1 : coincidenciaActual + 1;
        dispatch(setCoincidenciaActual(siguiente));
        scrollACoincidencia(siguiente - 1);
    };

    const irAAnterior = () => {
        if (totalCoincidencias === 0) return;

        const anterior = coincidenciaActual <= 1 ? totalCoincidencias : coincidenciaActual - 1;
        dispatch(setCoincidenciaActual(anterior));
        scrollACoincidencia(anterior - 1);
    };

    // ✅ Detectar cuando el usuario está escribiendo
    useEffect(() => {
        const handleInput = () => {
            setIsUserTyping(true);

            // Limpiar timeout anterior
            if (actualizacionTimeoutRef.current) {
                clearTimeout(actualizacionTimeoutRef.current);
            }

            // Esperar 1 segundo después de que el usuario deje de escribir
            actualizacionTimeoutRef.current = setTimeout(() => {
                setIsUserTyping(false);
            }, 1000);
        };

        const tituloElement = document.querySelector('[data-campo="titulo"]');

        const tituloElement2 = document.querySelector('[data-campo="titulo-2"]');
        
        const notaElement = document.querySelector('[data-campo="nota"]');

        if (tituloElement) {
            tituloElement.addEventListener('input', handleInput);
        }
        if (tituloElement2) {
            tituloElement2.addEventListener('input', handleInput);
        }
        if (notaElement) {
            notaElement.addEventListener('input', handleInput);
        }

        return () => {
            if (tituloElement) {
                tituloElement.removeEventListener('input', handleInput);
            }
            if (tituloElement2) {
                tituloElement2.removeEventListener('input', handleInput);
            }
            if (notaElement) {
                notaElement.removeEventListener('input', handleInput);
            }
            if (actualizacionTimeoutRef.current) {
                clearTimeout(actualizacionTimeoutRef.current);
            }
        };
    }, []);

    // ✅ Efecto que tiene objetivo de actualizar búsqueda cuando cambia el contenido (pero NO cuando el usuario está escribiendo)
    useEffect(() => {
        if (verInputBusqueda && terminoBusqueda && !isUserTyping) {
            buscarCoincidencias(terminoBusqueda);
        }
    }, [titulo, nota, tareas, verInputBusqueda, terminoBusqueda, isUserTyping]);

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            limpiarResaltados();
            if (actualizacionTimeoutRef.current) {
                clearTimeout(actualizacionTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <style>{`
                .busqueda-highlight {
                    background-color: #fef08a;
                    color: #000;
                }
                .busqueda-highlight-active {
                    background-color: #facc15;
                    color: #000;
                }
                .dark .busqueda-highlight {
                    background-color: #854d0e;
                    color: #fff;
                }
                .dark .busqueda-highlight-active {
                    background-color: #a16207;
                    color: #fff;
                }
            `}</style>

            <div className={`${verInputBusqueda ? 'w-full' : ''}`}>
                {!verInputBusqueda && (
                    <div className="p-1 active:bg-gray-300 dark:active:bg-gray-600
                                    rounded-sm cursor-pointer"
                        onClick={handleVerInputBusqueda}>
                        <HiSearch className="text-2xl md:text-3xl text-violet-800 dark:text-white" />
                    </div>
                )}

                {verInputBusqueda && (
                    <div className="ml-3 flex flex-row items-center justify-end gap-3">
                        <div className="w-full border-b-2 border-violet-500">
                            <input
                                ref={inputRef}
                                type="text"
                                maxLength={500}
                                value={terminoBusqueda}
                                onChange={handleInputChange}
                                placeholder="Buscar..."
                                className="w-full text-base md:text-lg 
                                            focus:outline-none bg-transparent
                                            text-black dark:text-white"
                            />
                        </div>

                        <div className="text-center
                                        text-sm md:text-base 
                                        text-black dark:text-white select-none">
                            {totalCoincidencias > 0 ?
                                (
                                    <p>
                                        {coincidenciaActual}/{totalCoincidencias}
                                    </p>
                                ) : (
                                    <p>
                                        0/0
                                    </p>
                                )
                            }
                        </div>

                        <div className="flex flex-row items-center">
                            <div
                                className={`p-1 rounded-sm ${totalCoincidencias > 0 ? 'active:bg-gray-300 dark:active:bg-gray-600 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                onClick={irAAnterior}>
                                <HiChevronUp className="text-2xl md:text-3xl text-violet-800 dark:text-white" />
                            </div>

                            <div
                                className={`p-1 rounded-sm ${totalCoincidencias > 0 ? 'active:bg-gray-300 dark:active:bg-gray-600 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                onClick={irASiguiente}>
                                <HiChevronDown className="text-2xl md:text-3xl text-violet-800 dark:text-white" />
                            </div>

                            <div className="p-1 active:bg-gray-300 dark:active:bg-gray-600
                                        rounded-sm cursor-pointer"
                                onClick={handleVerInputBusqueda}>
                                <HiX className="text-2xl md:text-3xl text-violet-800 dark:text-white" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}