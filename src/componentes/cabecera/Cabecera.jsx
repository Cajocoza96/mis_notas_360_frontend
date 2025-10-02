import React from "react";

import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import {
    toggleOrganizarPorColumna, toggleVerOpcionesCabecera,
    toogleVerModo, toggleVerOrden
} from "../../store/layoutSlice";

import {
    HiMenuAlt3, HiArrowDown, HiDotsVertical,
    HiChevronLeft, HiX
} from "react-icons/hi";

import { HiViewColumns } from "react-icons/hi2";

export default function Cabecera({ paginaPrincipal, paginaBusqueda,
    paginaPapelera, paginaEstado }) {

    const organizarPorColumna = useSelector((state) => state.layout.organizarPorColumna);

    const verModo = useSelector((state) => state.layout.verModo);

    const verOrden = useSelector((state) => state.layout.verOrden);

    const dispatch = useDispatch();

    const handleOrganizacion = () => {
        dispatch(toggleOrganizarPorColumna());
    }

    const handleVerOpcionesCabecera = () => {
        dispatch(toggleVerOpcionesCabecera())

        if (verModo) {
            dispatch(toogleVerModo())
        } else if (verOrden) {
            dispatch(toggleVerOrden())
        } else {
            return
        }
    }


    return (
        <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-row items-center justify-between p-2">

                {paginaBusqueda && (
                    <div className="w-fit">
                        <Link to="/">
                            <HiChevronLeft className="text-xl md:text-2xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                        </Link>
                    </div>
                )}

                {paginaPapelera && (
                    <div className="w-fit">
                        <Link to="/">
                            <HiX className="text-xl md:text-2xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                        </Link>
                    </div>
                )}

                {paginaEstado && (
                    <Link to="/">
                        <HiChevronLeft className="text-xl md:text-2xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                    </Link>
                )}

                {paginaPrincipal && (
                    <div className="active:bg-gray-300 dark:active:bg-gray-600
                    w-fit rounded-sm cursor-pointer
                    flex items-center"
                        onClick={handleOrganizacion}>

                        {organizarPorColumna && (
                            <HiMenuAlt3 className="text-xl md:text-2xl text-black dark:text-white" />
                        )}

                        {!organizarPorColumna && (
                            <HiViewColumns className="text-xl md:text-2xl text-black dark:text-white" />
                        )}

                        <HiArrowDown className="text-sm md:text-base text-black dark:text-white" />
                    </div>
                )}

                {paginaPrincipal && (
                    <p className="w-full text-center text-base md:text-xl font-bold select-none truncate
                    text-black dark:text-white">MisNotas360</p>
                )}

                {paginaBusqueda && (
                    <p className="w-full text-center text-base md:text-xl select-none truncate
                    text-blue-600 dark:text-white">Buscar</p>
                )}

                {paginaPapelera && (
                    <p className="w-full text-center text-base md:text-xl select-none truncate
                    text-red-600 dark:text-white">Papelera</p>
                )}

                {paginaEstado && (
                    <p className="w-full text-center text-base md:text-xl select-none truncate
                    text-blue-600 dark:text-white">Estados</p>
                )}

                {paginaPrincipal && (
                    <div className="active:bg-gray-300 dark:active:bg-gray-600 
                                w-fit rounded-sm cursor-pointer
                                flex items-center"
                        onClick={handleVerOpcionesCabecera}>
                        <HiDotsVertical className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer" />
                    </div>
                )}

            </div>

        </div>
    );
}