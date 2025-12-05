import React from "react";

import { Link, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import {
    toggleVerOpcionesCabecera, toggleVerMenuHamburguesa
} from "../../store/layoutSlice";

import { toggleVerModo, toggleVerOrden } from "../../store/preferenciaSlice";

import {
    HiDotsVertical, HiChevronLeft, HiX, HiOutlineBookOpen, HiMenu,
    HiMinusCircle, HiClock, HiCheckCircle, HiStar
} from "react-icons/hi";


export default function Cabecera({ paginaPrincipal, paginaBusqueda,
    paginaPapelera, paginaEstado, paginaRegIniSesion, paginaInfoUsuario,
    paginaTerminosPoliticas, tituloTerminoPolitica, irATerminoPolitica }) {

    const verModo = useSelector((state) => state.preferencia.verModo);

    const verOrden = useSelector((state) => state.preferencia.verOrden);

    const verAnotacEstado = useSelector((state) => state.preferencia.verAnotacEstado);

    const verSoloFavoritos = useSelector((state) => state.preferencia.verSoloFavoritos);

    const dispatch = useDispatch();

    const handleVerOpcionesCabecera = () => {
        dispatch(toggleVerOpcionesCabecera())

        if (verModo) {
            dispatch(toggleVerModo())
        } else if (verOrden) {
            dispatch(toggleVerOrden())
        } else {
            return
        }
    }

    const handleVerMenuHamburguesa = () => {
        dispatch(toggleVerMenuHamburguesa())
    }

    const location = useLocation();

    const esTerminoDeServicio = location.pathname === "/terminos-de-servicio";

    const esPoliticaDePrivacidad = location.pathname === "/politica-de-privacidad";

    const esTerminoPolitica = esTerminoDeServicio || esPoliticaDePrivacidad;

    const rutaDestino = esTerminoDeServicio ? "/politica-de-privacidad" : "/terminos-de-servicio";
    

    return (
        <div className="flex-shrink-0 z-10 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-row items-center justify-between py-2 gap-2">

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

                {paginaInfoUsuario && (
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
                        <p className="w-full text-center text-lg md:text-xl
                                    font-bold select-none truncate
                                    text-black dark:text-white" translate="no">
                            MisNotas360
                        </p>

                        {verSoloFavoritos && (
                            <div className="">
                                <HiStar className="text-2xl md:text-3xl 
                                                    text-violet-700 dark:text-white" />
                            </div>
                        )}

                        <div className="text-2xl md:text-3xl">
                            {verAnotacEstado === 'ver_no_asignado'
                                ? <HiMinusCircle className="text-blue-700" /> :
                                verAnotacEstado === 'ver_pendiente'
                                    ? <HiClock className="text-yellow-700" /> :
                                    verAnotacEstado === 'ver_finalizado'
                                        ? <HiCheckCircle className="text-green-700" /> :
                                        verAnotacEstado === 'ver_todos_estados'
                                            ? '' : ''}
                        </div>
                    </Link>
                )}

                {paginaBusqueda && (
                    <p className="w-full text-center text-lg md:text-xl select-none truncate
                    text-violet-800 dark:text-white">Buscar</p>
                )}

                {paginaPapelera && (
                    <p className="w-full text-center text-lg md:text-xl select-none truncate
                    text-red-600 dark:text-white">Papelera</p>
                )}

                {paginaEstado && (
                    <p className="w-full text-center text-lg md:text-xl select-none truncate
                    text-violet-800 dark:text-white">Estados</p>
                )}

                {paginaInfoUsuario && (
                    <p className="w-full text-center text-lg md:text-xl select-none truncate
                    text-violet-800 dark:text-white">Información usuario</p>
                )}

                {paginaRegIniSesion && (
                    <Link to="/" className="w-fit mx-auto
                                    flex flex-row items-center gap-2">
                        <HiOutlineBookOpen className="text-2xl md:text-3xl 
                                                text-black dark:text-white" />
                        <p className="w-full text-center text-lg md:text-xl
                                    font-bold select-none truncate
                                text-black dark:text-white" translate="no">
                            MisNotas360
                        </p>
                    </Link>

                )}

                {paginaTerminosPoliticas && (

                    <div className="w-fit mx-auto
                                    flex flex-col justify-center items-center gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <Link to="/">
                                <HiChevronLeft className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                            </Link>

                            <p className="w-full text-center text-lg md:text-xl
                                    font-bold truncate
                                text-black dark:text-white">
                                {tituloTerminoPolitica}
                            </p>
                        </div>

                        {esTerminoPolitica && (
                            <p className="w-fit text-center text-base md:text-xl 
                            select-none cursor-pointer
                        text-black dark:text-white">
                                <Link to={rutaDestino}>
                                    ir a {irATerminoPolitica}
                                </Link>
                            </p>
                        )}

                    </div>
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