import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerMenuHamburguesa } from "../../store/layoutSlice";

export default function MenuHamburguesa() {

    const dispatch = useDispatch();

    const handleVerMenuHamburguesa = () => {
        dispatch(toggleVerMenuHamburguesa())
    }

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs"
                onClick={handleVerMenuHamburguesa}></div>
                
            <div className="h-dvh w-[70%] lg:w-[40%]
                        fixed inset-0 z-40 overflow-hidden
                        bg-blue-600 dark:bg-gray-800 
                        flex flex-col ">
            </div>
        </>
    );
}