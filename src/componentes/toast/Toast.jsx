import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

export default function Toast() {
  const verToast = useSelector((state) => state.acceso.verToast);
  const mensajeToast = useSelector((state) => state.acceso.mensajeToast);

  return (
    <AnimatePresence>
      {verToast && (
        <motion.div
          key="toast"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                    bg-gray-300 dark:bg-gray-700
                    outline outline-gray-300 dark:outline-gray-700
                    text-black dark:text-white px-4 py-3 rounded-md 
                    shadow-xl flex items-center justify-center 
                    w-[95%] z-90 backdrop-blur-sm"
        >
          <span className="text-center text-sm md:text-base 2xl:text-3xl font-medium">
            {mensajeToast || "Error desconocido"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}