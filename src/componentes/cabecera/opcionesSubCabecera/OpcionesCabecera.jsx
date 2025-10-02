import React from "react";

export default function OpcionesCabecera({ iconoOpcion, nombreOpcion, className = "", ...props }) {
    return (
        <div className={`w-[95%] mx-auto flex flex-row items-center gap-2 ${className}`} {...props}>
            {iconoOpcion}
            <p className="text-base md:text-xl px-1">
                {nombreOpcion}
            </p>
        </div>
    );
}