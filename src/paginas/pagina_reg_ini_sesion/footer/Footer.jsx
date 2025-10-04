import React from "react";

export default function Footer(){
    return(
        <div className="w-full p-4 bg-blue-600 dark:bg-black fixed bottom-0">
            <p className="w-full truncate text-sm md:text-base text-white text-center">
                ¿Necesitas una cuenta? <span className="cursor-pointer">Regístrate</span>
            </p>
        </div>
    );
}