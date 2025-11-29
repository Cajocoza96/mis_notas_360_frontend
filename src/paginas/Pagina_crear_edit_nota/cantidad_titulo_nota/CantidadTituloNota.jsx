import React from "react";
import { useSelector } from "react-redux";

export default function CantidadTituloNota() {
    const { titulo, nota } = useSelector((state) => state.tareas);

    // ✅ Limpiar espacios y saltos de línea para contar correctamente
    const tituloLimpio = titulo ? titulo.trim() : "";
    const notaLimpia = nota ? nota.trim() : "";
    
    // ✅ Si está vacío después de limpiar, es 0
    const cantTitulo = tituloLimpio === "" ? 0 : titulo.length;
    const cantNota = notaLimpia === "" ? 0 : nota.length;

    const limiteExcedidoTitulo = cantTitulo >= 255;
    const limiteExcedidoNota = cantNota >= 50000;

    return (
        <div className="p-2 z-10 w-full bg-gray-300 dark:bg-gray-900 select-none
                        flex flex-row justify-between">
            
            <p className="text-sm md:text-base text-black dark:text-white">
                Titulo <span className={limiteExcedidoTitulo ? "text-red-600" : ""}>
                    {cantTitulo}/255
                </span>
            </p>
            
            <p className="text-sm md:text-base text-black dark:text-white">
                Nota <span className={limiteExcedidoNota ? "text-red-600" : ""}>
                    {cantNota}/50000
                </span>
            </p>
        </div>
    );
}