import React from "react";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";

export default function GlobalLoadingOverlay() {
    const verificandoToken = useSelector((state) => state.loading.verificandoToken);

    if (!verificandoToken) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/60 
                        flex items-center justify-center
                        backdrop-blur-sm"
            style={{ pointerEvents: 'auto' }}
        >
            <FaSpinner className="animate-spin text-xl md:text-2xl text-white" />
        </div>
    );
}