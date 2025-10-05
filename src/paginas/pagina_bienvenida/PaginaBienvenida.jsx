import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { BookOpen } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function PaginaBienvenida() {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const navigate = useNavigate();

    const handleNavegarRegistrarCuenta = () => navigate("/registrar");
    const handleNavegarInicioSesion = () => navigate("/iniciar-sesion");

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

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-4">
                {/* Logo/Icon */}
                <div className="mt-2 mb-8 animate-float">
                    <div className="bg-white/10 backdrop-blur-lg p-4 rounded-3xl shadow-2xl border border-white/20">
                        <BookOpen className="w-16 h-16 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-center tracking-tight">
                    MisNotas360
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-12 text-center max-w-2xl">
                    Organiza tus ideas, captura tus pensamientos, sincroniza en todos tus dispositivos
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16">
                    <button className="bg-white text-purple-900 px-8 py-4 
                                        rounded-full font-semibold text-lg shadow-xl 
                                        hover:shadow-2xl hover:scale-105 
                                        transition-all duration-300 cursor-pointer"
                        onClick={handleNavegarInicioSesion}>
                        Iniciar Sesión
                    </button>
                    <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 
                                        rounded-full font-semibold text-lg border-2 
                                        border-white/30 hover:bg-white/20 hover:scale-105 
                                        transition-all duration-300 cursor-pointer"
                            onClick={handleNavegarRegistrarCuenta}>
                        Registrarse
                    </button>
                </div>
            </div>

            {/* Custom Animation */}
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