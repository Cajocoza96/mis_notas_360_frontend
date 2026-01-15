import React from "react";
import ConexionMonitor from "./componentes/conexion_monitor/ConexionMonitor";
import Rutas from "./rutas/Rutas";

function App() {
    return (
        <div
            className="bg-white dark:bg-gray-800"
            style={{
                position: 'relative',
                minHeight: '100dvh',
                overflow: 'hidden' // Evita scrollbar durante transiciones
            }}
        >
            <ConexionMonitor>
                <Rutas />
            </ConexionMonitor>
        </div>
    );
}

export default App;