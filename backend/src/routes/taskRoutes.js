import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    allowedPriorities,
    allowedStatuses,
    TASK_PRIORITIES,
    TASK_STATUSES,
} from "../constants/taskOptions.js";

// Router nos permite agrupar rutas relacionadas en un archivo separado.
const router = express.Router();

const MIN_TASK_TITLE_LENGTH = 2;
const MAX_TASK_TITLE_LENGTH = 100;
const MAX_TASK_DESCRIPTION_LENGTH = 200;

// Todas las rutas de tareas requieren usuario autenticado.
router.use(authMiddleware);

function validateTaskData({ title, description, status, priority }, { partial = false } = {}) {
    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();

    if (!partial && !trimmedTitle) {
        return "El título de la tarea es obligatorio.";
    }

    if (title !== undefined && !trimmedTitle) {
        return "El título de la tarea no puede estar vacío.";
    }

    if (trimmedTitle && trimmedTitle.length < MIN_TASK_TITLE_LENGTH) {
        return `El título de la tarea debe tener al menos ${MIN_TASK_TITLE_LENGTH} caracteres.`;
    }

    if (trimmedTitle && trimmedTitle.length > MAX_TASK_TITLE_LENGTH) {
        return `El título de la tarea no puede superar los ${MAX_TASK_TITLE_LENGTH} caracteres.`;
    }

    if (trimmedDescription && trimmedDescription.length > MAX_TASK_DESCRIPTION_LENGTH) {
        return `La descripción no puede superar los ${MAX_TASK_DESCRIPTION_LENGTH} caracteres.`;
    }

    if (status !== undefined && !allowedStatuses.includes(status)) {
        return "Estado de tarea no válido.";
    }

    if (priority !== undefined && !allowedPriorities.includes(priority)) {
        return "Prioridad de tarea no válida.";
    }

    return null;
}

function parseProjectId(projectId) {
    if (projectId === undefined || projectId === null || projectId === "") {
        return null;
    }

    const parsedProjectId = Number(projectId);

    if (Number.isNaN(parsedProjectId) || parsedProjectId <= 0) {
        return "invalid";
    }

    return parsedProjectId;
}

// Ruta para obtener tareas desde MySQL.
// Si llega projectId por query param, devuelve solo tareas de ese proyecto.
// GET /api/tasks
// GET /api/tasks?projectId=1
// GET /api/tasks?projectId=unassigned
router.get("/", async (req, res) => {
    const { projectId } = req.query;

    const where = {
        userId: req.user.userId,
    };

    if (projectId) {
        if (projectId === "unassigned") {
            where.projectId = null;
        } else {
            const parsedProjectId = Number(projectId);

            if (Number.isNaN(parsedProjectId) || parsedProjectId <= 0) {
                return res.status(400).json({
                    message: "ID de proyecto no válido.",
                });
            }

            where.projectId = parsedProjectId;
        }
    }

    try {
        const tasks = await prisma.task.findMany({
            where,
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
    const { title, description, status, priority, projectId } = req.body;

    const validationError = validateTaskData({
        title,
        description,
        status,
        priority,
    });

    if (validationError) {
        return res.status(400).json({
            message: validationError,
        });
    }

    const parsedProjectId = parseProjectId(projectId);

    if (parsedProjectId === "invalid") {
        return res.status(400).json({
            message: "ID de proyecto no válido.",
        });
    }

    try {
        if (parsedProjectId) {
            const project = await prisma.project.findFirst({
                where: {
                    id: parsedProjectId,
                    userId: req.user.userId,
                },
            });

            if (!project) {
                return res.status(404).json({
                    message: "Proyecto no encontrado.",
                });
            }
        }

        const newTask = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                status: status || TASK_STATUSES.TODO,
                priority: priority || TASK_PRIORITIES.MEDIUM,
                projectId: parsedProjectId,
                userId: req.user.userId,
            },
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({
            message: "No se pudo crear la tarea.",
        });
    }
});

// Ruta para actualizar datos generales de una tarea.
// PATCH /api/tasks/:id
router.patch("/:id", async (req, res) => {
    const taskId = Number(req.params.id);
    const { title, description, status, priority } = req.body;

    if (Number.isNaN(taskId) || taskId <= 0) {
        return res.status(400).json({
            message: "ID de tarea no válido.",
        });
    }

    const validationError = validateTaskData(
        {
            title,
            description,
            status,
            priority,
        },
        {
            partial: true,
        },
    );

    if (validationError) {
        return res.status(400).json({
            message: validationError,
        });
    }

    try {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: req.user.userId,
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
                ...(title !== undefined && { title: title.trim() }),
                ...(description !== undefined && {
                    description: description.trim() || null,
                }),
                ...(status !== undefined && { status }),
                ...(priority !== undefined && { priority }),
            },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({
            message: "No se pudo actualizar la tarea.",
        });
    }
});

// Ruta para eliminar una tarea por su id en MySQL.
// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId) || taskId <= 0) {
        return res.status(400).json({
            message: "ID de tarea no válido.",
        });
    }

    try {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: req.user.userId,
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

    if (Number.isNaN(taskId) || taskId <= 0) {
        return res.status(400).json({
            message: "ID de tarea no válido.",
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Estado de tarea no válido.",
        });
    }

    try {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: req.user.userId,
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