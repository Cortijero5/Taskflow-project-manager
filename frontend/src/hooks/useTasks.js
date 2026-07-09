import { useEffect, useState } from "react";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
    updateTaskStatus,
} from "../services/taskService.js";

function useTasks(currentUser, selectedProjectId, setProjects) {
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [tasksError, setTasksError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
    });

    const [editingTaskId, setEditingTaskId] = useState(null);

    const filteredTasks =
        selectedStatus === "ALL"
            ? tasks
            : tasks.filter((task) => task.status === selectedStatus);

    // Carga tareas cuando hay usuario y cambia el proyecto seleccionado.
    // Si selectedProjectId es null, cargamos tareas sin proyecto.
    useEffect(() => {
        async function loadTasks() {
            if (!currentUser) {
                return;
            }

            setTasksLoading(true);
            setTasksError("");

            try {
                const projectFilter =
                    selectedProjectId === null ? "unassigned" : selectedProjectId;

                const data = await getTasks(projectFilter);
                setTasks(data);
            } catch (error) {
                setTasksError(error.message);
            } finally {
                setTasksLoading(false);
            }
        }

        loadTasks();
    }, [currentUser, selectedProjectId]);

    function handleInputChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!formData.title.trim()) {
            return;
        }

        setTasksError("");

        try {
            if (editingTaskId) {
                const data = await updateTask(editingTaskId, formData);

                setTasks((currentTasks) =>
                    currentTasks.map((task) => (task.id === editingTaskId ? data : task)),
                );

                setProjects((currentProjects) =>
                    currentProjects.map((project) => ({
                        ...project,
                        tasks: (project.tasks || []).map((task) =>
                            task.id === editingTaskId ? data : task,
                        ),
                    })),
                );

                setEditingTaskId(null);
            } else {
                const data = await createTask({
                    ...formData,
                    projectId: selectedProjectId,
                });

                setTasks((currentTasks) => [data, ...currentTasks]);

                if (data.projectId) {
                    setProjects((currentProjects) =>
                        currentProjects.map((project) =>
                            project.id === data.projectId
                                ? {
                                    ...project,
                                    tasks: [data, ...(project.tasks || [])],
                                }
                                : project,
                        ),
                    );
                }
            }

            setFormData({
                title: "",
                description: "",
                status: "TODO",
                priority: "MEDIUM",
            });

            setSelectedStatus("ALL");
        } catch (error) {
            setTasksError(error.message);
        }
    }

    function handleStartEditTask(task) {
        setEditingTaskId(task.id);

        setFormData({
            title: task.title,
            description: task.description || "",
            status: task.status,
            priority: task.priority,
        });
    }

    function handleCancelEditTask() {
        setEditingTaskId(null);

        setFormData({
            title: "",
            description: "",
            status: "TODO",
            priority: "MEDIUM",
        });
    }

    async function handleDeleteTask(taskId) {
        setTasksError("");

        try {
            await deleteTask(taskId);

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== taskId),
            );

            setProjects((currentProjects) =>
                currentProjects.map((project) => ({
                    ...project,
                    tasks: (project.tasks || []).filter((task) => task.id !== taskId),
                })),
            );
        } catch (error) {
            setTasksError(error.message);
        }
    }

    async function handleUpdateTaskStatus(taskId, newStatus) {
        setTasksError("");

        try {
            const data = await updateTaskStatus(taskId, newStatus);

            setTasks((currentTasks) =>
                currentTasks.map((task) => (task.id === taskId ? data : task)),
            );

            setProjects((currentProjects) =>
                currentProjects.map((project) => ({
                    ...project,
                    tasks: (project.tasks || []).map((task) =>
                        task.id === taskId ? data : task,
                    ),
                })),
            );
        } catch (error) {
            setTasksError(error.message);
        }
    }

    function resetTasks() {
        setSelectedStatus("ALL");
        setTasks([]);
        setTasksError("");
        setTasksLoading(false);

        setFormData({
            title: "",
            description: "",
            status: "TODO",
            priority: "MEDIUM",
        });

        setEditingTaskId(null);
    }

    return {
        selectedStatus,
        setSelectedStatus,
        tasks,
        filteredTasks,
        tasksLoading,
        tasksError,
        formData,
        editingTaskId,
        handleInputChange,
        handleSubmit,
        handleStartEditTask,
        handleCancelEditTask,
        handleDeleteTask,
        handleUpdateTaskStatus,
        resetTasks,
    };
}

export default useTasks;