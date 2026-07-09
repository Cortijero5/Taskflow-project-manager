import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Creamos la aplicación de Express.
// "app" será el objeto principal donde configuramos rutas y middlewares.
const app = express();

// Puerto donde se ejecutará la API.
// Si existe PORT en .env, usamos ese. Si no, usamos 3000.
const PORT = process.env.PORT || 3000;

// Comprobamos que existe JWT_SECRET.
// Si no existe, el backend se detiene para evitar generar/verificar tokens mal configurados.
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en el archivo .env");
}

// Helmet añade cabeceras HTTP de seguridad básicas.
app.use(helmet());

// Permitimos que el frontend de Vite pueda hacer peticiones a esta API.
// En desarrollo, Vite normalmente corre en http://localhost:5173.
app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

// Middleware para que Express pueda leer JSON en las peticiones.
// Limitamos el tamaño para evitar recibir cuerpos enormes innecesarios.
app.use(express.json({ limit: "1mb" }));

// Ruta de prueba para comprobar que el backend está funcionando.
// GET http://localhost:3000/api/health
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "TaskFlow API is running",
    });
});

// Rutas de autenticación.
// /api/auth/register
// /api/auth/login
// /api/auth/me
app.use("/api/auth", authRoutes);

// Rutas de proyectos.
// Cualquier ruta que empiece por /api/projects se gestionará en projectRoutes.
app.use("/api/projects", projectRoutes);

// Rutas de tareas.
// Cualquier ruta que empiece por /api/tasks se gestionará en taskRoutes.
app.use("/api/tasks", taskRoutes);

// Arrancamos el servidor y lo dejamos escuchando peticiones.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});