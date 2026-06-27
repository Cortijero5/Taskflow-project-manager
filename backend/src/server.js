import express from "express";
import cors from "cors";

// Creamos la aplicación de Express.
// "app" será el objeto principal donde configuramos rutas y middlewares.
const app = express();

// Puerto donde se ejecutará la API.
// El frontend usa Vite en 5173 y el backend usará 3000.
const PORT = 3000;

// Middleware para que Express pueda leer JSON en las peticiones.
// Esto será necesario cuando React envíe datos al backend.
app.use(express.json());

// Permitimos que el frontend de Vite pueda hacer peticiones a esta API.
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

// Ruta de prueba para comprobar que el backend está funcionando.
// GET http://localhost:3000/api/health
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "TaskFlow API is running",
    });
});

// Arrancamos el servidor y lo dejamos escuchando peticiones.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});