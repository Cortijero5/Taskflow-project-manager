import express from "express";
import cors from "cors";

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

// Tareas temporales guardadas en memoria.
// Más adelante esto vendrá de MySQL usando Prisma.
let tasks = [];

// Ruta de prueba para comprobar que el backend está funcionando.
// GET http://localhost:3000/api/health
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "TaskFlow API is running",
    });
});

// Ruta para obtener todas las tareas.
// GET http://localhost:3000/api/tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Ruta para crear una nueva tarea.
// POST http://localhost:3000/api/tasks
app.post("/api/tasks", (req, res) => {
    const { title, description, status, priority } = req.body;

    // Validación básica: no permitimos tareas sin título.
    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "El título de la tarea es obligatorio.",
        });
    }

    const newTask = {
        id: Date.now(),
        title,
        description: description || "",
        status: status || "TODO",
        priority: priority || "MEDIUM",
    };

    tasks = [newTask, ...tasks];

    res.status(201).json(newTask);
});

// Ruta para eliminar una tarea por su id.
// DELETE http://localhost:3000/api/tasks/:id
app.delete("/api/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const taskExists = tasks.some((task) => task.id === taskId);

    if (!taskExists) {
        return res.status(404).json({
            message: "Tarea no encontrada.",
        });
    }

    tasks = tasks.filter((task) => task.id !== taskId);

    res.json({
        message: "Tarea eliminada correctamente.",
        id: taskId,
    });
});

// Arrancamos el servidor y lo dejamos escuchando peticiones.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});