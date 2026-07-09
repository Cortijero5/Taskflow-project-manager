const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
    const token = localStorage.getItem("taskflow_token");

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}

async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error en la petición.");
    }

    return data;
}

// Función común para hacer peticiones a la API.
// Añade automáticamente la URL base, el token si existe y procesa errores.
export async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            ...getAuthHeaders(),
        },
    });

    return handleResponse(response);
}