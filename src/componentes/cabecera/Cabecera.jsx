import React from "react";

import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import {
    toggleVerOpcionesCabecera, toogleVerModo, toggleVerOrden, toggleVerMenuHamburguesa
} from "../../store/layoutSlice";

import {
    HiDotsVertical, HiChevronLeft, HiX, HiOutlineBookOpen, HiMenu
} from "react-icons/hi";


export default function Cabecera({ paginaPrincipal, paginaBusqueda,
    paginaPapelera, paginaEstado, paginaRegIniSesion }) {

    const verModo = useSelector((state) => state.layout.verModo);

    const verOrden = useSelector((state) => state.layout.verOrden);

    const dispatch = useDispatch();

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

    const handleVerMenuHamburguesa = () => {
        dispatch(toggleVerMenuHamburguesa())
    }

    return (
        <div className="flex-shrink-0 z-10 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-row items-center justify-between p-2 gap-2">

                {paginaBusqueda && (
                    <div className="w-fit">
                        <Link to="/panel-principal">
                            <HiChevronLeft className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                        </Link>
                    </div>
                )}

                {paginaPapelera && (
                    <div className="w-fit">
                        <Link to="/panel-principal">
                            <HiX className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                        </Link>
                    </div>
                )}

                {paginaEstado && (
                    <div className="w-fit">
                        <Link to="/panel-principal">
                            <HiChevronLeft className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                        </Link>
                    </div>
                )}

                {paginaPrincipal && (
                    <div className="active:bg-gray-300 dark:active:bg-gray-600
                                    w-fit rounded-sm cursor-pointer
                                    flex items-center"
                        onClick={handleVerMenuHamburguesa}>
                        <HiMenu className="text-2xl md:text-3xl text-black dark:text-white" />
                    </div>
                )}

                {paginaPrincipal && (
                    <Link to="/"
                        className="w-fit flex flex-row items-center gap-2">
                        <div>
                            <HiOutlineBookOpen className="text-2xl md:text-3xl text-black dark:text-white" />
                        </div>
                        <p className="w-full text-center text-xl md:text-2xl 
                                    font-bold select-none truncate
                                    text-black dark:text-white">
                            MisNotas360
                        </p>
                    </Link>
                )}

                {paginaBusqueda && (
                    <p className="w-full text-center text-xl md:text-2xl select-none truncate
                    text-blue-600 dark:text-white">Buscar</p>
                )}

                {paginaPapelera && (
                    <p className="w-full text-center text-xl md:text-2xl select-none truncate
                    text-red-600 dark:text-white">Papelera</p>
                )}

                {paginaEstado && (
                    <p className="w-full text-center text-xl md:text-2xl select-none truncate
                    text-blue-600 dark:text-white">Estados</p>
                )}

                {paginaRegIniSesion && (
                    <Link to="/" className="w-fit 
                                    flex flex-row items-center gap-2">
                        <HiOutlineBookOpen className="text-2xl md:text-3xl 
                                                text-black dark:text-white" />
                        <p className="w-full text-left text-xl md:text-2xl
                                    font-bold select-none truncate
                                text-black dark:text-white">
                            MisNotas360
                        </p>
                    </Link>

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