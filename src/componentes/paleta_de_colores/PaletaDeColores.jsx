import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerPaletaColores } from "../../store/layoutSlice";

export default function PaletaDeColores() {

    const dispatch = useDispatch();

    const handleVerPaletaColores = () => {
        dispatch(toggleVerPaletaColores())
    }

    return (
        <>
            <div className="fixed inset-0 z-20 bg-black/70" 
                onClick={handleVerPaletaColores}></div>
            <div className="p-2 rounded-xl bg-white dark:bg-gray-800
                        flex flex-col gap-5 z-21 fixed bottom-20 right-3">
                            
                <div className="rounded-[50%] p-3 border border-black cursor-pointer
                            [background:linear-gradient(135deg,#EA580C_50%,transparent_50%)]"
                    onClick={handleVerPaletaColores}></div>

                <div className="rounded-[50%] p-3 border border-black cursor-pointer
                            [background:linear-gradient(135deg,#16A34A_50%,transparent_50%)]"
                    onClick={handleVerPaletaColores}></div>

                <div className="rounded-[50%] p-3 border border-black cursor-pointer
                            [background:linear-gradient(135deg,#7C3AED_50%,transparent_50%)]"
                    onClick={handleVerPaletaColores}></div>

                <div className="rounded-[50%] p-3 border border-black cursor-pointer
                            [background:linear-gradient(135deg,#2563eb_50%,transparent_50%)]"
                    onClick={handleVerPaletaColores}></div>
            </div>
        </>
    );
}