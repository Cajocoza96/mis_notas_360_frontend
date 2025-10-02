import React from "react";

import { HiChevronLeft, HiOutlinePencil, HiDotsVertical } from "react-icons/hi";

import { useDispatch } from "react-redux";

import { toggleVerOpcCabPagVisPrev } from "../../../store/layoutSlice";

import { HiOutlineStar } from "react-icons/hi2";

import { Link } from "react-router-dom";

export default function Cabecera() {

    const dispatch = useDispatch();

    const handleVerOpcCabPagVisPrev = () => {
        dispatch(toggleVerOpcCabPagVisPrev())
    }

    return (
        <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">

            <div className="w-[95%] mx-auto flex flex-col gap-2">

                <div className="flex flex-row items-center justify-between p-2">
                    <Link to="/">
                        <HiChevronLeft className="text-xl md:text-2xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                    </Link>

                    <div className="w-20 flex flex-row items-center justify-between">
                        <HiOutlineStar className="text-2xl md:text-3xl text-blue-600 dark:text-white cursor-pointer" />
                        
                        <HiDotsVertical 
                            className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer"
                            onClick={handleVerOpcCabPagVisPrev} />
                    </div>
                </div>

                <div className="p-1 flex flex-row items-center justify-between">
                    <p className="text-sm md:text-base 
                            text-blue-600 dark:text-white">
                        Estado (finalizado, pendiente, no asignado)
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

                    <HiOutlinePencil className="text-2xl md:text-3xl cursor-pointer text-blue-600 dark:text-white" />
                </div>

            </div>

        </div>
    );
}