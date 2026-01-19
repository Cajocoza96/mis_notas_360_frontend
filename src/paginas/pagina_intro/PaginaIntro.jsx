import React, { useState, useEffect, useCallback } from "react";
import BotonAccion from "../../componentes/botones/BotonAccion";
import { HiOutlineBookOpen, HiHand } from "react-icons/hi";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { marcarBienvenidaVista } from "../../services/authService";
import { actualizarUsuarioLocal } from "../../store/authSlice";
import Lottie from "lottie-react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import modalIntro from "../../assets/lottie/modal_pagina_intro/modalIntro.json";

import useConexionInternet from "../../hooks/useConexionInternet";

import CargandoNoHayNada from "../../componentes/cargando_no_hay_nada/CargandoNoHayNada";

import { logDesarrollo, errorDesarrollo, registrarError } from "../../utils/errorHandler";

import Toast from "../../componentes/toast/Toast";

export default function PaginaIntro() {

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const [procesando, setProcesando] = useState(false);

    const MiBoton = motion.create(BotonAccion);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isOnline } = useConexionInternet();

    const verToast = useSelector((state) => state.acceso.verToast);

    // ✅ Bloquear navegación hacia atrás
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            // Forzar a quedarse en pagina-intro
            navigate('/pagina-intro', { replace: true });
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    const handleContinuar = async () => {
        if (!isOnline || procesando) {
            return;
        }

        try {
            setProcesando(true);
            await marcarBienvenidaVista();
            dispatch(actualizarUsuarioLocal({ vioBienvenida: true }));
            navigate('/', { replace: true });
            setProcesando(false);

        } catch (error) {
            setProcesando(true);
            errorDesarrollo('Error al marcar bienvenida:', error);
            navigate('/', { replace: true });
            setProcesando(false);
        }
    };

    return (
        <div key="pagina-intro-wrapper" className="relative h-dvh bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 
                        dark:from-gray-900 dark:via-purple-900 dark:to-violet-900
                        text-black dark:text-white 
                        text-base md:text-lg 
                        flex flex-col justify-center">

            {verToast && (
                <Toast />
            )}

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
                                enable: false,
                                mode: "push",
                            },
                            onHover: {
                                enable: false,
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

            {/* Contenido principal */}
            <div className="relative z-10 w-[80%] max-w-2xl max-h-[90dvh] mx-auto
                            bg-white/80 dark:bg-gray-800/80
                            backdrop-blur-lg shadow-2xl p-4 overflow-hidden
                            border border-violet-200 dark:border-violet-500/30
                            flex flex-col items-center">

                <div className="p-2 flex flex-row items-center 
                                flex-shrink-0  gap-3 text-center">
                    <motion.div
                        key="hand-animation"
                        animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                    >
                        <HiHand className="text-4xl md:text-5xl text-yellow-500" />
                    </motion.div>

                    <p className="font-bold select-none text-2xl md:text-3xl" translate="no">
                        ¡Bienvenido!
                    </p>
                </div>

                <div className="overflow-y-auto overflow-x-hidden min-h-0
                                flex flex-col flex-1 items-center">
                    <motion.div
                        key="content-animation"
                        className="flex flex-col items-center gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >

                        <div className="w-fit select-none flex flex-row items-center gap-2">
                            <div>
                                <HiOutlineBookOpen className="text-2xl md:text-3xl text-black dark:text-white" />
                            </div>
                            <p className="text-center text-lg md:text-xl
                                    font-bold
                                    text-black dark:text-white" translate="no">
                                MisNotas360
                            </p>
                        </div>
                    </motion.div>

                    <motion.p
                        key="text-animation"
                        className="text-center text-gray-700 dark:text-gray-300 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Parece que es tu primera vez aquí. Escribe, organiza y gestiona tus anotaciones
                        fácilmente, con herramientas de IA.
                    </motion.p>

                    <div className="flex flex-col 2xs:flex-row 
                                    items-center justify-center 
                                    gap-2 2xs:gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="w-[45%] 2xs:w-[30%] lg:w-[25%] 
                                        flex items-center justify-center">
                            <Lottie className="w-full object-cover"
                                animationData={modalIntro} loop={true} />
                        </motion.div>

                        <motion.div
                            key="button-animation"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="mt-4 flex flex-col"
                        >
                            {procesando ? <CargandoNoHayNada iconoDeCarga={true} /> :
                                <MiBoton
                                    className={`bg-violet-600 text-white
                                hover:bg-violet-700 active:bg-violet-800
                                ${!isOnline || procesando ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                rounded-full px-8 py-3 font-semibold`}
                                    accion="Continuar"
                                    onClick={handleContinuar}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                />
                            }
                        </motion.div>

                    </div>
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