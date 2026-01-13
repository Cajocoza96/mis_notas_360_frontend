import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

export default function Toast() {
  const verToast = useSelector((state) => state.acceso.verToast);
  const mensajeToast = useSelector((state) => state.acceso.mensajeToast);

  // ✅ Función para renderizar el mensaje con saltos de línea
  const renderizarMensaje = () => {
    if (!mensajeToast) return "Error desconocido";

    // Si el mensaje contiene ". " (punto seguido de espacio), dividirlo
    if (mensajeToast.includes('. ')) {
      const mensajes = mensajeToast.split('. ').filter(msg => msg.trim() !== '');
      
      return (
        <div className="flex flex-col gap-2">
          {mensajes.map((mensaje, index) => (
            <span key={index} className="text-center text-sm md:text-base font-medium">
              • {mensaje.trim()}{index < mensajes.length - 1 ? '.' : ''}
            </span>
          ))}
        </div>
      );
    }

    // Si no tiene ". ", renderizar normal
    return mensajeToast;
  };

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
                    bg-black dark:bg-gray-300
                    outline outline-gray-300 dark:outline-gray-700
                    text-white dark:text-black px-4 py-3 rounded-md 
                    shadow-xl flex items-center justify-center 
                    w-[95%] max-h-[90dvh] z-90 backdrop-blur-sm"
        >
          {renderizarMensaje()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}