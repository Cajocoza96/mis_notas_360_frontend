import React from "react";

import { HiOutlineBell, HiSwitchVertical } from "react-icons/hi";

import { BsToggle2Off, BsToggle2On } from "react-icons/bs";

export default function InterNotificaciones() {
    return (
        <div className="text-black dark:text-white 
                        flex flex-row items-center gap-4">
            
            <div className="text-2xl md:text-3xl">
                {/* 
                <BsToggle2Off />

                
                <BsToggle2On />
                */}
            </div>

            <p className="text-base md:text-lg">
                Notificaciones
            </p>

        </div>
    );
}