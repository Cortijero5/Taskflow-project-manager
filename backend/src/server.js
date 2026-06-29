import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

// Creamos la aplicación de Express.
// "app" será el objeto principal donde configuramos rutas y middlewares.
const app = express();

// Puerto donde se ejecutará la API.
// El frontend usa Vite en 5173 y el backend usará 3000.
const PORT = 3000;

// Permitimos que el frontend de Vite pueda hacer peticiones a esta API.
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

// Middleware para que Express pueda leer JSON en las peticiones.
// Esto será necesario cuando React envíe datos al backend.
app.use(express.json());

// Ruta de prueba para comprobar que el backend está funcionando.
// GET http://localhost:3000/api/health
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "TaskFlow API is running",
    });
});

// Conectamos todas las rutas relacionadas con tareas.
// Cualquier ruta que empiece por /api/tasks se gestionará en taskRoutes.
app.use("/api/tasks", taskRoutes);

// Arrancamos el servidor y lo dejamos escuchando peticiones.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});