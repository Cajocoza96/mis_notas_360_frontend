import React from "react";

import { HiMenuAlt3, HiCube, HiArrowDown, HiDotsVertical } from "react-icons/hi";

import { HiViewColumns } from "react-icons/hi2";

export default function Cabecera({ toggleOrganizarPorColumna, organizarPorColumna }) {

    return (
        <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-row items-center justify-between">

                <div className="active:bg-gray-300 w-fit p-2 rounded-sm cursor-pointer
                                flex items-center"
                    onClick={toggleOrganizarPorColumna}>

                    {organizarPorColumna && (
                        <HiMenuAlt3 className="text-xl md:text-2xl text-black" />
                    )}

                    {!organizarPorColumna && (
                        <HiViewColumns className="text-xl md:text-2xl text-black" />
                    )}

                    <HiArrowDown className="text-sm md:text-base  text-black" />
                </div>

                <p className="w-full text-center text-base md:text-xl font-bold text-black select-none truncate">MisNotas360</p>

                <div className="active:bg-gray-300 w-fit p-2 rounded-sm cursor-pointer
                        flex items-center">
                    <HiDotsVertical className="text-2xl md:text-3xl text-black cursor-pointer" />
                </div>

            </div>

        </div>
    );
}