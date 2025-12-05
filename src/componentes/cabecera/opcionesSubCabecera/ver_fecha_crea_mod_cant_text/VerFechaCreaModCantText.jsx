import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import SubOpcionesCabecera from "../SubOpcionesCabecera";
import { formatearFechaConHora } from "../../../../utils/dateUtils";

export default function VerFechaCreaModCantText() {
    // ✅ Obtener la anotación actual desde Redux
    const { anotacionActual } = useSelector((state) => state.anotaciones);

    const [cargando, setCargando] = useState(false);

    // ✅ Calcular totales de caracteres usando useMemo para optimizar
    const totales = useMemo(() => {
        if (!anotacionActual) {
            return {
                titulo: 0,
                nota: 0,
                tareas: 0,
                total: 0
            };
        }

        const cantTitulo = anotacionActual.cant_caract_titulo || 0;
        const cantNota = anotacionActual.cant_caract_nota || 0;
        
        // Calcular total de caracteres de todas las tareas
        const cantTareas = anotacionActual.tareas?.reduce((total, tarea) => {
            return total + (tarea.cant_caract_tarea || 0);
        }, 0) || 0;

        return {
            titulo: cantTitulo,
            nota: cantNota,
            tareas: cantTareas,
            total: cantTitulo + cantNota + cantTareas
        };
    }, [anotacionActual]);

    // Mostrar estado de carga
    if (cargando) {
        return (
            <div className="w-full p-1 select-none bg-white dark:bg-gray-800">
                <p className="text-base md:text-lg text-black dark:text-white text-center py-4">
                    Cargando...
                </p>
            </div>
        );
    }

    // Verificar que exista la anotación
    if (!anotacionActual) {
        return (
            <div className="w-full p-1 select-none bg-white dark:bg-gray-800">
                <p className="text-base md:text-lg text-black dark:text-white text-center py-4">
                    No hay datos disponibles
                </p>
            </div>
        );
    }

    // ✅ Comparar fechas usando timestamps (más robusto y preciso)
    const fechasIguales = new Date(anotacionActual.fecha_creacion).getTime() ===
        new Date(anotacionActual.fecha_modificacion).getTime();

    // Formatear fechas para mostrar
    const fechaCreacionFormateada = formatearFechaConHora(anotacionActual.fecha_creacion);
    const fechaModificacionFormateada = formatearFechaConHora(anotacionActual.fecha_modificacion);

    return (
        <div className="w-full p-1 select-none
                        bg-white dark:bg-gray-800">

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Fecha de creación"
                fechaCantNumero={fechaCreacionFormateada}
            />

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Fecha de modificación"
                fechaCantNumero={fechasIguales ? "--" : fechaModificacionFormateada}
            />

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Cantidad carácteres título"
                fechaCantNumero={totales.titulo}
            />

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Cantidad carácteres nota"
                fechaCantNumero={totales.nota}
            />

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Cantidad carácteres tareas"
                fechaCantNumero={totales.tareas}
            />

            <SubOpcionesCabecera
                className="justify-between"
                textoFechaCanttexto="Cantidad carácteres total"
                fechaCantNumero={totales.total}
            />

        </div>
    );
}