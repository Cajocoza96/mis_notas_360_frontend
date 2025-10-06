import React, { useCallback } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { HiOutlineBookOpen } from "react-icons/hi";

import { useNavigate } from "react-router-dom";

import BotonAccion from "../../componentes/botones/BotonAccion";

export default function PaginaBienvenida() {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const navigate = useNavigate();

    const handleNavegarRegistrarCuenta = () => navigate("/registrar");
    const handleNavegarInicioSesion = () => navigate("/iniciar-sesion");

    const MiBoton = motion.create(BotonAccion);

    return (
        <div className="relative min-h-dvh bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
            {/* Particles Background */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                            resize: true,
                        },
                        modes: {
                            push: {
                                quantity: 4,
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: "#ffffff",
                        },
                        links: {
                            color: "#ffffff",
                            distance: 150,
                            enable: true,
                            opacity: 0.3,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 2,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 80,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 5 },
                        },
                    },
                    detectRetina: true,
                }}
                className="absolute inset-0"
            />

            <div className="relative z-10 flex flex-col items-center justify-center gap-4 lg:gap-8 min-h-dvh px-4">


                <div className="flex flex-col gap-3">

                    <div className="animate-bounce flex flex-row items-center justify-center gap-2">
                        <HiOutlineBookOpen className="text-2xl md:text-3xl text-white" />
                        <p className="text-2xl md:text-3xl font-bold text-white text-center tracking-tight">
                            MisNotas360
                        </p>
                    </div>

                    <p className="text-base md:text-xl text-white/80 text-center">
                        Organiza tus ideas, captura tus pensamientos, sincroniza en todos tus dispositivos
                    </p>
                </div>

                <div className="flex flex-col items-center gap-5">

                    <MiBoton
                        className="bg-white text-purple-900 
                                    hover:text-red-600 active:text-red-600
                                    hover:bg-gray-300 active:bg-gray-200
                                rounded-full"
                        accion="Iniciar sesión"
                        onClick={handleNavegarInicioSesion}
                        whileHover={{
                            scale: 1.15,
                            boxShadow: "0px 4px 20px rgba(147, 51, 234, 0.4)"
                        }}
                        whileTap={{
                            scale: 0.96,
                            boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    />

                    <MiBoton
                        className=" bg-green-600 text-white
                                    hover:bg-green-800 active:bg-green-700
                                    rounded-full"
                        accion="Registrarse"
                        onClick={handleNavegarRegistrarCuenta}
                        whileHover={{
                            scale: 1.15,
                            boxShadow: "0px 4px 20px rgba(147, 51, 234, 0.4)"
                        }}
                        whileTap={{
                            scale: 0.96,
                            boxShadow: "0px 2px 8px rgba(147, 51, 234, 0.3"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    />

                </div>


            </div>

            <style>{` 
                        @keyframes float {
                            0%, 100% {
                                transform: translateY(0px);
                            }
                                50% {
                                    transform: translateY(-20px);
                                }
                        }
                        .animate-float {
                        animation: float 3s ease-in-out infinite;
                        }
                    `}</style>
        </div>
    );
}