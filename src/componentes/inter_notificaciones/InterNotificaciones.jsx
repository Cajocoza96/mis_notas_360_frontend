import React from "react";

import { HiOutlineBell, HiSwitchVertical } from "react-icons/hi";

import { BsToggle2Off, BsToggle2On } from "react-icons/bs";

export default function InterNotificaciones() {
    return (
        <div className="text-black dark:text-white 
                        flex flex-row items-center gap-4">
            
            <div className="text-2xl md:text-3xl">
                {/*Cuando estan desactivadas las notificaciones debe aparecer este icono 
                <BsToggle2Off />

                Cuando estan activadas las notificaciones debe aparecer este icono
                <BsToggle2On />

                Por defecto debe aparecer desactivada las notificaciones, si el usuario 
                las activa se debe guardar en la base de datos, se tiene que mantener 
                siempre el estado si estan activadas o desactivadas, debe mantenerse si 
                se refrezca el navegador, se borra los datos del navegador, se cambia de 
                navegador, se ve desde el mobile o pc
                */}
            </div>

            <p className="text-base md:text-lg">
                Notificaciones
            </p>

        </div>
    );
}