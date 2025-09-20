import React from "react";

import { HiMenuAlt3, HiArrowDown, HiDotsVertical } from "react-icons/hi";

export default function Cabecera() {

    return (
        <div className="flex-shrink-0 z-10 min-h-0">

            <div className="w-[95%] mx-auto flex flex-row items-center justify-between">

                <div className="active:bg-gray-300 w-fit p-2 rounded-sm cursor-pointer
                        flex items-center">
                    <HiMenuAlt3 className="text-xl md:text-2xl text-black" />
                    <HiArrowDown className="text-sm md:text-base  text-black" />
                </div>

                <div className="">
                    <p className="text-base md:text-xl font-bold text-black">MisNotas360</p>
                </div>

                <div className="active:bg-gray-300 w-fit p-2 rounded-sm cursor-pointer
                        flex items-center">
                    <HiDotsVertical className="text-2xl md:text-3xl text-black cursor-pointer" />
                </div>

            </div>

        </div>
    );
}