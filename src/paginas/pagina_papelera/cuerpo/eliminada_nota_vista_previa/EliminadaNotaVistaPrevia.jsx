import React from "react";

import { HiOutlineRefresh, HiXCircle } from "react-icons/hi";

export default function EliminadaNotaVistaPrevia() {
    return (
        <div className="w-full h-20 p-2 rounded-md select-none
                        flex flex-row items-center justify-between gap-1 overflow-hidden
                        bg-gray-200 dark:bg-black">

            <div className="flex flex-col items-center">
                <p className="text-base md:text-xl px-1
                            text-black dark:text-white">
                    El del Gas
                </p>
                <p className="text-sm md:text-base px-1
                            text-blue-600 dark:text-white">
                    30/09/2025
                </p>
            </div>

            <div className="flex flex-row items-center gap-6">
                <HiOutlineRefresh className="text-2xl md:text-3xl cursor-pointer
                                        text-black dark:text-white"/>

                <HiXCircle className="text-2xl md:text-3xl cursor-pointer
                                text-red-600"/>
            </div>
        </div>
    );
}