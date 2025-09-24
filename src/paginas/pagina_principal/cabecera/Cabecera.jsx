import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { toggleOrganizarPorColumna, toggleVerOpcionesCabecera, toogleVerModo } from "../../../store/layoutSlice";

import { HiMenuAlt3, HiArrowDown, HiDotsVertical } from "react-icons/hi";

import { HiViewColumns } from "react-icons/hi2";

export default function Cabecera() {

    const organizarPorColumna = useSelector((state) => state.layout.organizarPorColumna);

    const verModo = useSelector((state) => state.layout.verModo);

    const dispatch = useDispatch();

    const handleOrganizacion = () => {
        dispatch(toggleOrganizarPorColumna());
    }

    const handleVerOpcionesCabecera = () => {
        dispatch(toggleVerOpcionesCabecera())

        if(verModo){
            dispatch(toogleVerModo())
        }else{
            return
        }  
    }


    return (
        <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-row items-center justify-between">

                <div className="active:bg-gray-300 dark:active:bg-gray-600
                                w-fit p-2 rounded-sm cursor-pointer
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

                <p className="w-full text-center text-base md:text-xl font-bold select-none truncate
                            text-black dark:text-white">MisNotas360</p>

                <div className="active:bg-gray-300 dark:active:bg-gray-600 
                                w-fit p-2 rounded-sm cursor-pointer
                                flex items-center"
                    onClick={handleVerOpcionesCabecera}>
                    <HiDotsVertical className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer" />
                </div>

            </div>

        </div>
    );
}