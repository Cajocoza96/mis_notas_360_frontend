import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerModalCrear } from "../../store/layoutSlice";

import { useNavigate } from "react-router-dom";

export default function ModalConfirmacion({ textoPregunta }) {

    const navigate = useNavigate();

    const crearNota = () => {
        dispatch(toggleVerModalCrear());
        navigate("/agregar-nota");
    }
        

    const dispatch = useDispatch();

    const handleVerModalCrear = () => {
        dispatch(toggleVerModalCrear())
    }

    return (
        <>
            <div className="fixed inset-0 z-30 bg-black/70" onClick={handleVerModalCrear}></div>

            <div className="bg-white dark:bg-gray-800 
                            z-50 p-3 overflow-hidden
                        absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2
                        w-[90%] h-auto ">

                <div className="mx-auto w-full flex flex-col gap-4 2xl:gap-5">
                    <div className="flex flex-col gap-2">

                        <p className="text-base md:text-xl
                            text-black dark:text-white">
                            {textoPregunta}
                        </p>
                    </div>

                    <div className="flex flex-row items-center justify-end gap-6 2xl:gap-7">
                        <p
                            className="text-base md:text-xl
                                        text-black dark:text-white cursor-pointer"
                            onClick={handleVerModalCrear}>
                            Cancelar
                        </p>

                        <p
                            className="text-base md:text-xl
                                        text-blue-800 dark:text-white cursor-pointer"
                            onClick={crearNota}>
                            Aceptar
                        </p>
                    </div>

                </div>

            </div>
        </>
    );
}