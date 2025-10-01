import React from "react";

export default function Footer({ eliminarTodo }) {
    return (
        <>
            {eliminarTodo && (
                <div className="fixed bottom-0 p-3 z-10 min-h-0 min-w-0 w-full
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