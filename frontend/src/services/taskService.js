const API_BASE_URL = "http://localhost:3000/api";

// Función reutilizable para procesar respuestas de la API.
// Si la respuesta es correcta, devuelve los datos.
// Si hay error, lanza un Error con el mensaje del backend.
async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error en la petición.");
    }

    return data;
}

// Obtiene tareas desde el backend.
// Si recibe projectId, pide solo las tareas de ese proyecto.
// Si recibe "unassigned", pide tareas sin proyecto.
export async function getTasks(projectId) {
    const url = projectId
        ? `${API_BASE_URL}/tasks?projectId=${projectId}`
        : `${API_BASE_URL}/tasks`;

    const response = await fetch(url);
    return handleResponse(response);
}

// Crea una nueva tarea en el backend.
export async function createTask(taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
    });

    return handleResponse(response);
}

// Actualiza una tarea existente.
export async function updateTask(taskId, taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
    });

    return handleResponse(response);
}

// Elimina una tarea por su id.
export async function deleteTask(taskId) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
    });

    return handleResponse(response);
}

// Actualiza solo el estado de una tarea.
export async function updateTaskStatus(taskId, newStatus) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: newStatus,
        }),
    });

    return handleResponse(response);
}