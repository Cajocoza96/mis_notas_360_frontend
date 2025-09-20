import React from "react";

import { HiSquares2X2, HiStar } from "react-icons/hi2";

import { HiSearch, HiPlus } from "react-icons/hi";

export default function Footer() {

    return (
        <div className="flex-shrink-0 mb-1 min-h-0">

            <div className="grid grid-cols-5 items-center">

                <div className="w-full h-full p-1 active:bg-gray-300 rounded-sm cursor-pointer
                                flex items-center justify-center">
                    <HiSquares2X2 className="text-2xl md:text-3xl text-blue-600" />
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 rounded-sm cursor-pointer
                                flex items-center justify-center">
                    <HiSearch className="text-2xl md:text-3xl text-blue-600" />
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 rounded-sm cursor-pointer
                                flex items-center justify-center">
                    <div className="bg-blue-600 rounded-[50%] p-2
                                flex item-center justify-center">
                        <HiPlus className="text-2xl md:text-3xl text-white" />
                    </div>
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 rounded-sm cursor-pointer
                                flex items-center justify-center">
                    <HiStar className="text-2xl md:text-3xl text-blue-600" />
                </div>

                <div className="w-full h-full p-1 active:bg-gray-300 rounded-sm cursor-pointer
                                flex items-center justify-center">
                    <div className="rounded-[50%] p-3 border border-black
                                    [background:linear-gradient(135deg,#2563eb_50%,white_50%)]"></div>
                </div>
            </div>

        </div>
    );
}