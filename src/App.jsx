import React from "react";
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
            <Rutas />
        </div>
    );
}

export default App;