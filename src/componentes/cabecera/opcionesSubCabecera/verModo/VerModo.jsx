import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerOpcionesCabecera } from "../../../../store/layoutSlice";

import { toggleVerModo } from "../../../../store/preferenciaSlice.js";

import SubOpcionesCabecera from "../SubOpcionesCabecera";

import { useTheme } from "../../../../hooks/useTheme.js";

import { HiCheckCircle } from "react-icons/hi";

export default function VerModo() {

    const { theme, setTheme, themeKeys } = useTheme();

    const dispatch = useDispatch();

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme)

        requestAnimationFrame(() => {
            dispatch(toggleVerModo())
            dispatch(toggleVerOpcionesCabecera())
        })

    }

    return (
        <>
            <div className="w-full p-1 border-b border-gray-400 select-none
                                        text-black dark:text-white
                                        bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => handleThemeChange(themeKeys.claro)}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Claro"

                    circulo={theme === "claro" && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-violet-800 dark:text-violet-400" />
                    )}
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => handleThemeChange(themeKeys.oscuro)}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Oscuro"

                    circulo={theme === "oscuro" && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-violet-800 dark:text-violet-400" />
                    )}
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => handleThemeChange(themeKeys.sistema)}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Sistema (predeterminado)"

                    circulo={theme === "sistema" && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-violet-800 dark:text-violet-400" />
                    )}
                />
            </div>
        </>
    );
}