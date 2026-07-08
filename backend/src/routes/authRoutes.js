import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const router = express.Router();

// POST /api/auth/register
// Registra un nuevo usuario.
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({
            message: "El email es obligatorio.",
        });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({
            message: "La contraseña debe tener al menos 6 caracteres.",
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Ya existe un usuario con ese email.",
            });
        }

        // Ciframos la contraseña antes de guardarla.
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: name?.trim() || null,
                email: normalizedEmail,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({
            message: "No se pudo registrar el usuario.",
        });
    }
});

// POST /api/auth/login
// Inicia sesión y devuelve un token JWT.
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({
            message: "El email es obligatorio.",
        });
    }

    if (!password) {
        return res.status(400).json({
            message: "La contraseña es obligatoria.",
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "Credenciales incorrectas.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Credenciales incorrectas.",
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "No se pudo iniciar sesión.",
        });
    }
});

export default router;