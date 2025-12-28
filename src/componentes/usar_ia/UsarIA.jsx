import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerModalModosIA } from "../../store/tareasSlice";

export default function UsarIA() {

    const dispatch = useDispatch();

    const handleVerModalModosIA = () => {
        dispatch(toggleVerModalModosIA());
    }

    return (
        <p
            onClick={handleVerModalModosIA}
            className="text-base md:text-lg select-none cursor-pointer
                                                text-black dark:text-white">
            Usar IA
        </p>
    );
}