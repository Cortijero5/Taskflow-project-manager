const API_BASE_URL = "http://localhost:3000/api";

// Procesa respuestas de la API.
// Si hay error, lanza un Error con el mensaje del backend.
async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error en la petición.");
    }

    return data;
}

// Obtiene todos los proyectos desde el backend.
export async function getProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`);
    return handleResponse(response);
}

// Crea un nuevo proyecto en el backend.
export async function createProject(projectData) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
    });

    return handleResponse(response);
}