import { apiRequest } from "./apiClient.js";

// Registra un nuevo usuario.
export async function registerUser(userData) {
    return apiRequest("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
}

// Inicia sesión.
export async function loginUser(credentials) {
    return apiRequest("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
}

// Obtiene el usuario autenticado usando el token guardado en localStorage.
export async function getCurrentUser() {
    return apiRequest("/auth/me");
}