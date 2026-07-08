import jwt from "jsonwebtoken";

// Middleware para proteger rutas.
// Comprueba si llega un token JWT válido en el header Authorization.
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token no proporcionado.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos los datos del token en req.user
        // para que las siguientes rutas puedan saber quién es el usuario.
        req.user = decodedToken;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o caducado.",
        });
    }
}

export default authMiddleware;