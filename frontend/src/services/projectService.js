import { apiRequest } from "./apiClient.js";

// Obtiene todos los proyectos desde el backend.
export async function getProjects() {
    return apiRequest("/projects");
}

// Crea un nuevo proyecto en el backend.
export async function createProject(projectData) {
    return apiRequest("/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
    });
}

// Actualiza un proyecto existente.
export async function updateProject(projectId, projectData) {
    return apiRequest(`/projects/${projectId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
    });
}

// Elimina un proyecto por su id.
export async function deleteProject(projectId) {
    return apiRequest(`/projects/${projectId}`, {
        method: "DELETE",
    });
}