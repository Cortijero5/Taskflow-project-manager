import express from "express";
import prisma from "../lib/prisma.js";

// Router nos permite agrupar rutas relacionadas en un archivo separado.
const router = express.Router();

const allowedStatuses = ["TODO", "IN_PROGRESS", "DONE"];
const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

// Ruta para obtener todas las tareas desde MySQL.
// GET /api/tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "No se pudieron cargar las tareas.",
        });
    }
});

// Ruta para crear una nueva tarea en MySQL.
// POST /api/tasks
router.post("/", async (req, res) => {
    const { title, description, status, priority } = req.body;

    // Validación básica: no permitimos tareas sin título.
    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "El título de la tarea es obligatorio.",
        });
    }

    // Validamos que el estado enviado sea correcto.
    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Estado de tarea no válido.",
        });
    }

    // Validamos que la prioridad enviada sea correcta.
    if (priority && !allowedPriorities.includes(priority)) {
        return res.status(400).json({
            message: "Prioridad de tarea no válida.",
        });
    }

    try {
        const newTask = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                status: status || "TODO",
                priority: priority || "MEDIUM",
            },
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({
            message: "No se pudo crear la tarea.",
        });
    }
});

// Ruta para eliminar una tarea por su id en MySQL.
// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
        return res.status(400).json({
            message: "ID de tarea no válido.",
        });
    }

    try {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!task) {
            return res.status(404).json({
                message: "Tarea no encontrada.",
            });
        }

        await prisma.task.delete({
            where: {
                id: taskId,
            },
        });

        res.json({
            message: "Tarea eliminada correctamente.",
            id: taskId,
        });
    } catch (error) {
        res.status(500).json({
            message: "No se pudo eliminar la tarea.",
        });
    }
});

// Ruta para actualizar solo el estado de una tarea en MySQL.
// PATCH /api/tasks/:id/status
router.patch("/:id/status", async (req, res) => {
    const taskId = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(taskId)) {
        return res.status(400).json({
            message: "ID de tarea no válido.",
        });
    }

    // Validamos que el estado enviado sea uno de los permitidos.
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Estado de tarea no válido.",
        });
    }

    try {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!task) {
            return res.status(404).json({
                message: "Tarea no encontrada.",
            });
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                status,
            },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({
            message: "No se pudo actualizar la tarea.",
        });
    }
});

export default router;