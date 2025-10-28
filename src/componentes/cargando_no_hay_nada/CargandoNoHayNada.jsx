import React from "react";

import { FaSpinner } from "react-icons/fa";

export default function CargandoNoHayNada() {
    return (
        <>
            <div className="fixed inset-0 z-90 bg-black/60
                            flex items-center justify-center">
                <FaSpinner className="animate-spin text-xl md:text-2xl text-white" />
            </div>
        </>
    );
}