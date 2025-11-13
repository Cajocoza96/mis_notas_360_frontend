import React from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

export default function GlobalLoadingOverlay() {
    const verificandoToken = useSelector((state) => state.loading.verificandoToken);
    const cargandoAnotacion = useSelector((state) => state.anotaciones.cargando);

    // Mostrar overlay si está verificando token O cargando anotación
    const mostrarOverlay = verificandoToken || cargandoAnotacion;

    return (
        <AnimatePresence>
            {mostrarOverlay && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    backgroundColor: [
                        'rgba(91, 33, 182, 0.3)',
                        'rgba(91, 33, 182, 0.55)',
                        'rgba(91, 33, 182, 0.3)',
                        'rgba(91, 33, 182, 0.55)'
                    ]
                }}
                exit={{ opacity: 0 }}
                transition={{
                    opacity: { duration: 0.3 },
                    backgroundColor: {
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop"
                    }
                }}
                    className="fixed inset-0 z-[9999] bg-black/70"
                    style={{ 
                        pointerEvents: 'auto',
                        position: 'fixed', // Asegura que esté fijo
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}
                >
                </motion.div>
            )}
        </AnimatePresence>
    );
}