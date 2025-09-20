import React from "react";

import { HiOutlineStar } from "react-icons/hi2";

export default function NotaVistaPrevia({ texto }) {
    return (
        <div className="w-full p-2 rounded-md bg-blue-200 overflow-hidden
                        flex flex-col items-center  gap-1">

            <div className="w-full flex flex-col items-start">
                <HiOutlineStar className="text-2xl md:text-3xl text-blue-600 cursor-pointer" />
            </div>

            <div className="w-full h-full  flex flex-col items-center">

                <p className="text-base md:text-xl text-black"></p>

                <div className="border border-black w-full h-full flex items-center justify-center">
                    <p className="text-base md:text-xl text-black">
                        {texto}
                    </p>
                </div>
            </div>

        </div>
    );
}