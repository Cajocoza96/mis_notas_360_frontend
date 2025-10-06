import React from "react";
import { HiOutlineUser } from "react-icons/hi";

export default function Usuario() {
    return (
        <div className="text-black dark:text-white p-2 select-none
                                flex flex-row items-center gap-2">
            <HiOutlineUser className="text-2xl md:text-3xl" />
            <p className="truncate text-base md:text-xl">Wandu el guerrero</p>
        </div>
    );
}