import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerOpcionesCabecera } from "../../../store/layoutSlice";

import OpcionesCabecera from "./OpcionesCabecera";

import { HiMenuAlt3, HiOutlineMoon, HiOutlineTrash } from "react-icons/hi";

export default function ContOpCabecera() {

    const dispatch = useDispatch();

    const handleVerOpcionesCabecera = () => {
            dispatch(toggleVerOpcionesCabecera());
    }

    return (
        <>
            <div className="fixed inset-0 z-20 bg-black/50" onClick={handleVerOpcionesCabecera}></div>
            <div className="fixed bottom-0 z-20 w-full h-auto bg-white">

                <div className="w-full p-1 border-b border-gray-400">
                    <OpcionesCabecera
                        iconoOpcion={<HiMenuAlt3 className="text-xl md:text-2xl text-black" />}
                        nombreOpcion="Ordenar"
                    />
                </div>

                <div className="w-full p-1 border-b border-gray-400">
                    <OpcionesCabecera
                        iconoOpcion={<HiOutlineMoon className="text-xl md:text-2xl text-black" />}
                        nombreOpcion="Modo oscuro"
                    />
                </div>

                <div className="w-full p-1 border-b border-gray-400">
                    <OpcionesCabecera
                        iconoOpcion={<HiOutlineTrash className="text-xl md:text-2xl text-black" />}
                        nombreOpcion="Papelera"
                    />
                </div>

            </div>
        </>
    );
}