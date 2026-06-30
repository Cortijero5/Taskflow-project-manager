import express from "express";
import prisma from "../lib/prisma.js";

// Router para agrupar todas las rutas relacionadas con proyectos.
const router = express.Router();

// GET /api/projects
// Devuelve todos los proyectos guardados en MySQL.
router.get("/", async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
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
            },
        });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({
            message: "No se pudo crear el proyecto.",
        });
    }
});

export default router;