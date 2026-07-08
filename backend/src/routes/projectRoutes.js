import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Router para agrupar todas las rutas relacionadas con proyectos.
const router = express.Router();

// Todas las rutas de proyectos requieren usuario autenticado.
router.use(authMiddleware);

// GET /api/projects
// Devuelve todos los proyectos guardados en MySQL.
router.get("/", async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: req.user.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                tasks: true,
            },
        });

        res.json(projects);
    } catch (error) {
        res.status(500).json({
            message: "No se pudieron cargar los proyectos.",
        });
    }
});

// POST /api/projects
// Crea un nuevo proyecto en MySQL.
router.post("/", async (req, res) => {
    const { name, description } = req.body;

    // Validación básica: no permitimos proyectos sin nombre.
    if (!name || !name.trim()) {
        return res.status(400).json({
            message: "El nombre del proyecto es obligatorio.",
        });
    }

    try {
        const newProject = await prisma.project.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                userId: req.user.userId,
            },
            include: {
                tasks: true,
            },
        });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({
            message: "No se pudo crear el proyecto.",
        });
    }
});

// PATCH /api/projects/:id
// Actualiza el nombre y/o descripción de un proyecto.
router.patch("/:id", async (req, res) => {
    const projectId = Number(req.params.id);
    const { name, description } = req.body;

    if (Number.isNaN(projectId)) {
        return res.status(400).json({
            message: "ID de proyecto no válido.",
        });
    }

    // Si se manda name, no permitimos que venga vacío.
    if (name !== undefined && !name.trim()) {
        return res.status(400).json({
            message: "El nombre del proyecto no puede estar vacío.",
        });
    }

    try {
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: req.user.userId,
            },
        });

        if (!project) {
            return res.status(404).json({
                message: "Proyecto no encontrado.",
            });
        }

        const updatedProject = await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(description !== undefined && {
                    description: description.trim() || null,
                }),
            },
            include: {
                tasks: true,
            },
        });

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({
            message: "No se pudo actualizar el proyecto.",
        });
    }
});

// DELETE /api/projects/:id
// Elimina un proyecto por su id.
// Las tareas asociadas no se borran: quedan con projectId en null por onDelete: SetNull.
router.delete("/:id", async (req, res) => {
    const projectId = Number(req.params.id);

    if (Number.isNaN(projectId)) {
        return res.status(400).json({
            message: "ID de proyecto no válido.",
        });
    }

    try {
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: req.user.userId,
            },
        });

        if (!project) {
            return res.status(404).json({
                message: "Proyecto no encontrado.",
            });
        }

        await prisma.project.delete({
            where: {
                id: projectId,
            },
        });

        res.json({
            message: "Proyecto eliminado correctamente.",
            id: projectId,
        });
    } catch (error) {
        res.status(500).json({
            message: "No se pudo eliminar el proyecto.",
        });
    }
});

export default router;