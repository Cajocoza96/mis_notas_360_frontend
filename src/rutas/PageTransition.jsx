import React from "react";
import { motion } from "framer-motion";

/**
 * Wrapper para transiciones suaves entre rutas
 * Estilo Facebook Lite: mantiene la vista anterior mientras carga la nueva
 */
export default function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.3,
                ease: "easeInOut"
            }}
            style={{
                position: 'absolute',
                width: '100%',
                minHeight: '100vh'
            }}
        >
            {children}
        </motion.div>
    );
}