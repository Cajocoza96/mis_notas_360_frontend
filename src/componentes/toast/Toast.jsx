import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

export default function Toast({ mensaje }) {
  const verToast = useSelector((state) => state.acceso.verToast);

  if (!verToast) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="toast"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                    bg-red-600 text-white px-4 py-3 rounded-2xl 
                    shadow-xl flex items-center justify-center 
                    w-fit max-w-sm z-50 backdrop-blur-sm"
      >
        <span className="text-center text-sm md:text-base 2xl:text-3xl font-medium">
          {mensaje || "Error desconocido"}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}