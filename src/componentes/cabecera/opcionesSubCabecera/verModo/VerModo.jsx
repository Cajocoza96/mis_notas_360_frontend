import React from "react";

import { useDispatch } from "react-redux";

import { toggleVerOpcionesCabecera, toogleVerModo } from "../../../../store/layoutSlice";

import SubOpcionesCabecera from "../SubOpcionesCabecera";

import { useTheme } from "../../../../hooks/useTheme.js";

import { HiCheckCircle } from "react-icons/hi";

export default function VerModo() {

    const { theme, setTheme, themeKeys } = useTheme();

    const dispatch = useDispatch();

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme)

        requestAnimationFrame(() => {
            dispatch(toogleVerModo())
            dispatch(toggleVerOpcionesCabecera())
        })

    }

    return (
        <>
            <div className="w-full p-1 border-b border-gray-400 select-none
                                        text-black dark:text-white
                                        bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => handleThemeChange(themeKeys.light)}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Claro"

                    circulo={theme === "light" && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-blue-600" />
                    )}
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => handleThemeChange(themeKeys.dark)}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Oscuro"

                    circulo={theme === "dark" && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-blue-600" />
                    )}
                />
            </div>

            <div className="w-full p-1 border-b border-gray-400 select-none
                                        text-black dark:text-white 
                                        bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => handleThemeChange(themeKeys.system)}>
                <SubOpcionesCabecera
                    className="justify-center"
                    nombreOpcion="Sistema (predeterminado)"

                    circulo={theme === "system" && (
                        <HiCheckCircle className="text-2xl md:text-3xl text-blue-600" />
                    )}
                />
            </div>
        </>
    );
}