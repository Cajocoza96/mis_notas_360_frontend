import React from "react";

import { HiOutlineStar } from "react-icons/hi2";

export default function NotaVistaPrevia({ texto }) {
    return (
        <div className="w-full h-35 p-2 rounded-md bg-blue-200 select-none
                        flex flex-col items-center gap-1 overflow-hidden">

            <div className="w-full flex flex-col items-start">
                <HiOutlineStar className="text-2xl md:text-3xl text-blue-600 cursor-pointer" />
            </div>

            <div className="w-full h-25 text-center overflow-hidden 
                            flex flex-col items-center justify-center">
                <p className="text-base md:text-xl text-black  line-clamp-3 w-full px-1">
                    {texto}
                </p>
            </div>

        </div>
    );
}