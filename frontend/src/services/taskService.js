import { apiRequest } from "./apiClient.js";

// Obtiene tareas desde el backend.
// Si recibe projectId, pide solo las tareas de ese proyecto.
// Si recibe "unassigned", pide tareas sin proyecto.
export async function getTasks(projectId) {
    const query = projectId ? `?projectId=${projectId}` : "";

    return apiRequest(`/tasks${query}`);
}

// Crea una nueva tarea en el backend.
export async function createTask(taskData) {
    return apiRequest("/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
    });
}

// Actualiza una tarea existente.
export async function updateTask(taskId, taskData) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
    });
}

// Elimina una tarea por su id.
export async function deleteTask(taskId) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "DELETE",
    });
}

// Actualiza solo el estado de una tarea.
export async function updateTaskStatus(taskId, newStatus) {
    return apiRequest(`/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: newStatus,
        }),
    });
}