import React from "react";

export default function OpcionesCabecera({ iconoOpcion, nombreOpcion }) {
    return (
        <div className="w-[95%] mx-auto flex flex-row items-center justify-start gap-2">
            {iconoOpcion}
            <p className="text-base md:text-xl text-black  line-clamp-3 w-full px-1">
                {nombreOpcion}
            </p>
        </div>
    );
}