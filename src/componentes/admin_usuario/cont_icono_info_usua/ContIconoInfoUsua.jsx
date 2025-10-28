import React from "react";

export default function ContIconoInfoUsua({ titulo, texto, iconoInfoUsua,
    onClick, className = "", ...props }) {
    return (
        <div className="w-[95%] mx-auto">
            <div className={`p-2 flex flex-row items-center gap-2 select-none 
                            ${className}`} {...props}
                onClick={onClick}>

                <div className="text-2xl md:text-3xl">
                    {iconoInfoUsua}
                </div>

                <div className="flex flex-col">
                    <p className="text-base md:text-xl">
                        {titulo}
                    </p>

                    <p className="text-sm md:text-base">
                        {texto}
                    </p>
                </div>
            </div>

        </div>
    );
}