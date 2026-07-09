import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const MIN_PASSWORD_LENGTH = 6;
const MAX_NAME_LENGTH = 50;

// Validación básica de formato email.
// No es perfecta, pero evita valores claramente incorrectos.
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/register
// Registra un nuevo usuario.
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const trimmedName = name?.trim() || null;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
        return res.status(400).json({
            message: "El email es obligatorio.",
        });
    }

    if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
            message: "El formato del email no es válido.",
        });
    }

    if (!password) {
        return res.status(400).json({
            message: "La contraseña es obligatoria.",
        });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({
            message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
        });
    }

    if (trimmedName && trimmedName.length > MAX_NAME_LENGTH) {
        return res.status(400).json({
            message: `El nombre no puede superar los ${MAX_NAME_LENGTH} caracteres.`,
        });
    }

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
        // Nunca guardamos la contraseña original en MySQL.
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: trimmedName,
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

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
        return res.status(400).json({
            message: "El email es obligatorio.",
        });
    }

    if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
            message: "El formato del email no es válido.",
        });
    }

    if (!password) {
        return res.status(400).json({
            message: "La contraseña es obligatoria.",
        });
    }

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

// GET /api/auth/me
// Devuelve los datos del usuario autenticado usando el token JWT.
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "No se pudo cargar el usuario.",
        });
    }
});

export default router;