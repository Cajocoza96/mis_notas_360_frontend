import React from "react";

export default function Footer({ eliminarTodo }) {
    return (
        <>
            {eliminarTodo && (
                <div className="p-3 z-10  w-full
                        bg-red-600 cursor-pointer">

                    <p className="w-full text-center text-base md:text-xl select-none truncate
                    text-white">
                        Eliminar todo
                    </p>

                </div>
            )}
        </>
    );
}