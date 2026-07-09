import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Router para agrupar todas las rutas relacionadas con proyectos.
const router = express.Router();

const MIN_PROJECT_NAME_LENGTH = 2;
const MAX_PROJECT_NAME_LENGTH = 100;
const MAX_PROJECT_DESCRIPTION_LENGTH = 200;

// Todas las rutas de proyectos requieren usuario autenticado.
router.use(authMiddleware);

function validateProjectData({ name, description }, { partial = false } = {}) {
    const trimmedName = name?.trim();
    const trimmedDescription = description?.trim();

    if (!partial && !trimmedName) {
        return "El nombre del proyecto es obligatorio.";
    }

    if (name !== undefined && !trimmedName) {
        return "El nombre del proyecto no puede estar vacío.";
    }

    if (
        trimmedName &&
        trimmedName.length < MIN_PROJECT_NAME_LENGTH
    ) {
        return `El nombre del proyecto debe tener al menos ${MIN_PROJECT_NAME_LENGTH} caracteres.`;
    }

    if (
        trimmedName &&
        trimmedName.length > MAX_PROJECT_NAME_LENGTH
    ) {
        return `El nombre del proyecto no puede superar los ${MAX_PROJECT_NAME_LENGTH} caracteres.`;
    }

    if (
        trimmedDescription &&
        trimmedDescription.length > MAX_PROJECT_DESCRIPTION_LENGTH
    ) {
        return `La descripción no puede superar los ${MAX_PROJECT_DESCRIPTION_LENGTH} caracteres.`;
    }

    return null;
}

// GET /api/projects
// Devuelve todos los proyectos del usuario autenticado.
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
// Crea un nuevo proyecto asociado al usuario autenticado.
router.post("/", async (req, res) => {
    const { name, description } = req.body;

    const validationError = validateProjectData({
        name,
        description,
    });

    if (validationError) {
        return res.status(400).json({
            message: validationError,
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
// Actualiza el nombre y/o descripción de un proyecto del usuario autenticado.
router.patch("/:id", async (req, res) => {
    const projectId = Number(req.params.id);
    const { name, description } = req.body;

    if (Number.isNaN(projectId)) {
        return res.status(400).json({
            message: "ID de proyecto no válido.",
        });
    }

    const validationError = validateProjectData(
        {
            name,
            description,
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