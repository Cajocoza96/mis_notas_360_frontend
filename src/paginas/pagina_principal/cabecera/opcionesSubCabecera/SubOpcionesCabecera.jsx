import React from "react";

export default function SubOpcionesCabecera({ circulo, nombreOpcion }){
    return (
        <div className="w-[95%] mx-auto flex flex-row items-center justify-center gap-2">
            <p className="text-center text-base md:text-xl px-1">
                {nombreOpcion}
            </p>
            {circulo}
        </div>
    );
}