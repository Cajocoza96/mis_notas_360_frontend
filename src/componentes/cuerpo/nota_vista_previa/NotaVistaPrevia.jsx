import React from "react";

import { HiOutlineStar } from "react-icons/hi2";

export default function NotaVistaPrevia() {
    return (
        <div className="w-70 h-auto p-1 rounded-md bg-blue-200
                        flex flex-col items-center justify-center gap-1">

            <div className="w-full flex flex-col items-start">
                <HiOutlineStar className="text-2xl md:text-3xl text-blue-600 cursor-pointer" />
            </div>

            <div className="w-full flex flex-col items-center">
                <p className="text-base md:text-xl text-black"></p>

                <p className="text-base md:text-xl text-black">
                    Scarlett Sage, Sarah Vandella Sarah Vandella Kat Dior
                </p>
            </div>

        </div>
    );
}