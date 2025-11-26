import React from "react";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";

import { toggleVerMenuHamburguesa } from "../../store/layoutSlice";

import { HiOutlineBookOpen } from "react-icons/hi";

import AdminUsuario from "../admin_usuario/AdminUsuario";

export default function MenuHamburguesa() {

    const dispatch = useDispatch();

    const handleVerMenuHamburguesa = () => {
        dispatch(toggleVerMenuHamburguesa())
    }

    return (
        <>  
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs"
                onClick={handleVerMenuHamburguesa}></div>

            <motion.div
                className="h-dvh w-[80%] lg:w-[40%] p-2
                                fixed inset-0 z-40
                                bg-white dark:bg-gray-800"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}>

                <div className="h-full w-full 2xs:w-[80%] lg:w-[85%] overflow-hidden 
                            flex flex-col justify-between">
                    <Link to="/"
                        className="w-fit p-2  flex flex-row items-center gap-2">
                        <div>
                            <HiOutlineBookOpen className="text-2xl md:text-3xl  text-black dark:text-white" />
                        </div>
                        <p className="w-full text-left text-base md:text-xl 
                                    font-bold select-none truncate
                                    text-black dark:text-white" translate="no">
                            MisNotas360
                        </p>
                    </Link>

                    <div>
                        <AdminUsuario />
                    </div>

                </div>
            </motion.div>
        </>
    );
}