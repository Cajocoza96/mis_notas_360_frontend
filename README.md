📒 MisNotas360

MisNotas360 es una aplicación web diseñada para la creación, organización y gestión de anotaciones personales, impulsada con herramientas de Inteligencia Artificial.
Su objetivo principal es ofrecer a los usuarios un espacio eficiente donde puedan registrar ideas, gestionar tareas y estructurar información de manera dinámica y moderna.

La aplicación cuenta con un frontend desarrollado en React + Vite, un backend en Node.js con Express, y una base de datos PostgreSQL alojada en Supabase.

🚀 Características

1 Crear anotaciones con:
-Título
-Cuerpo de la nota
-Estado: No asignado, Pendiente o Finalizado
-Tareas adicionales

2 Herramientas de IA integradas:
-Corrección de ortografía y gramática
-Mejora de redacción
-Resumen de texto
-Conversión de texto en tareas
-Generación de contenido

3 Compartir anotaciones:
-Copiar al portapapeles
-Compartir en aplicaciones compatibles del dispositivo

4 Vista previa de anotaciones en el panel principal:
-Fragmento del contenido
-Estado de la anotación
-Marcar como favorita

5 Conteo de anotaciones por estado y filtrado por:
-Estado específico
-Todos los estados

6 Filtros de búsqueda:
-Búsqueda por texto
-Búsqueda de caracteres específicos dentro de la anotación

7 Filtrado exclusivo de anotaciones favoritas

8 Alternar vista de anotaciones:
-Vista en columna
-Vista en fila

9 Información detallada:
-Fecha de creación y modificación
-Conteo de caracteres del título, nota y tareas
-Conteo de tareas, tareas completada y tareas no completada

10 Ordenamiento de anotaciones por:
-Vista previa (Ascendente / Descendente)
-Fecha de creación
-Fecha de modificación

11 Ordenamiento de tareas por:
-Fecha de creación
-Ascendente o descendente

12 Selección de tema:
-Claro
-Oscuro
-Tema del sistema

13 Papelera de reciclaje:
-Gestión de anotaciones eliminadas
-Restauración de anotaciones

14 Sistema de autenticación:
-Usuario y contraseña
-Mínimo 8 caracteres
-Al menos una letra minúscula
-Una letra mayúscula
-Un número
-Un símbolo
-Autenticación con Google
-(Próximamente) Autenticación con Facebook

🧠 Tecnologías Utilizadas
🖥️ Frontend:
-React 19
-Vite
-React Router DOM
-Redux Toolkit
-Tailwind CSS
-Framer Motion
-Lottie React
-React Icons
-React Loading Skeleton
-JWT Decode
-OAuth con Google
-tsParticles
-Despliegue: Vercel

⚙️ Backend (privado por seguridad)
-Node.js
-Express
-JSON Web Tokens (JWT)
-Bcrypt.js
-Groq SDK (IA)
-Axios
-Helmet
-Express Rate Limit
-CORS
-Dotenv
-Despliegue: Render

🛢️ Base de datos (privado por seguridad)
-PostgreSQL
-Supabase (Base de datos PostgreSQL)

📦 Instalación
🔹 Frontend
git clone https://github.com/Cajocoza96/mis_notas_360_frontend.git
cd mis_notas_360_frontend
npm install

🔒 Sobre el backend
El código del backend y la base de datos se mantienen privados por motivos de seguridad y buenas prácticas profesionales.
La aplicación en producción funciona con una API real protegida mediante autenticación y control de acceso.

📌 Estado del Proyecto
🚧 En desarrollo continuo
Se planea agregar nuevas integraciones de autenticación, mejoras de IA, optimización de rendimiento
y corrección de errores.