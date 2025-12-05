import React from "react";

export default function ContIconoInfoUsua({ titulo, texto, iconoInfoUsua,
    onClick, className = "", ...props }) {
    return (
        <div className="w-[95%] mx-auto">
            <div className={`p-2 select-none
                            flex flex-col 2xs:flex-row items-center justify-start gap-2 
                            ${className}`} {...props}
                onClick={onClick}>

                <div className="text-2xl md:text-3xl">
                    {iconoInfoUsua}
                </div>

                <div className="flex flex-col">
                    <p className="text-base md:text-lg text-center 2xs:text-left">
                        {titulo}
                    </p>

                    <p className="text-sm md:text-base text-center 2xs:text-left">
                        {texto}
                    </p>
                </div>
            </div>

        </div>
    );
}