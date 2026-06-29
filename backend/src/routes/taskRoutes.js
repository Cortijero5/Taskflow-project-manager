import express from "express";

// Router nos permite agrupar rutas relacionadas en un archivo separado.
const router = express.Router();

// Tareas temporales guardadas en memoria.
// Más adelante esto vendrá de MySQL usando Prisma.
let tasks = [];

// Ruta para obtener todas las tareas.
// GET /api/tasks
router.get("/", (req, res) => {
    res.json(tasks);
});

// Ruta para crear una nueva tarea.
// POST /api/tasks
router.post("/", (req, res) => {
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
// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
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

// Ruta para actualizar solo el estado de una tarea.
// PATCH /api/tasks/:id/status
router.patch("/:id/status", (req, res) => {
    const taskId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = ["TODO", "IN_PROGRESS", "DONE"];

    // Validamos que el estado enviado sea uno de los permitidos.
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Estado de tarea no válido.",
        });
    }

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Tarea no encontrada.",
        });
    }

    // Creamos una nueva versión de la tarea con el estado actualizado.
    const updatedTask = {
        ...tasks[taskIndex],
        status,
    };

    tasks[taskIndex] = updatedTask;

    res.json(updatedTask);
});

export default router;