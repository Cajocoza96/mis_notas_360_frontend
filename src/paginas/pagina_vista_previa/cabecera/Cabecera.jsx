import React from "react";

import { HiChevronLeft, HiDotsVertical, HiOutlinePencil } from "react-icons/hi";

import { HiOutlineStar } from "react-icons/hi2";

import { Link } from "react-router-dom";

export default function Cabecera() {
    return (
        <div className="w-full fixed top-0 p-2
                        bg-white dark:bg-gray-800
                        z-10 min-h-0 min-w-0
                        flex flex-col gap-4">

            <div className="flex flex-row items-center justify-between">
                <Link to="/">
                    <HiChevronLeft className="text-xl md:text-2xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                </Link>

                <div className="w-20 flex flex-row items-center justify-between">
                    <HiOutlineStar className="text-2xl md:text-3xl cursor-pointer text-blue-600 dark:text-white" />
                    <HiDotsVertical className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer" />
                </div>
            </div>

            <div className="w-full p-1 flex flex-row items-center justify-between">
                <p className="text-sm md:text-base 
                            text-blue-600 dark:text-white">
                    Categoría
                </p>

                <p className="text-sm md:text-base 
                            text-black dark:text-white">
                    25/09/2025
                </p>
            </div>

            <div className="w-full p-1 flex flex-row items-center justify-between">
                <p className="text-base md:text-xl 
                            text-black dark:text-white">
                    Sin título
                </p>

                <HiOutlinePencil className="text-2xl md:text-3xl cursor-pointer text-blue-600 dark:text-white"/>
            </div>
            
        </div>
    );
}