import { useEffect, useState } from "react";
import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "../services/projectService.js";

function useProjects(currentUser) {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState("");

    const [projectFormData, setProjectFormData] = useState({
        name: "",
        description: "",
    });

    const [editingProjectId, setEditingProjectId] = useState(null);

    // Carga proyectos solo cuando ya hay usuario autenticado.
    useEffect(() => {
        async function loadProjects() {
            if (!currentUser) {
                return;
            }

            setProjectsLoading(true);
            setProjectsError("");

            try {
                const data = await getProjects();
                setProjects(data);

                if (data.length > 0) {
                    setSelectedProjectId(data[0].id);
                } else {
                    setSelectedProjectId(null);
                }
            } catch (error) {
                setProjectsError(error.message);
            } finally {
                setProjectsLoading(false);
            }
        }

        loadProjects();
    }, [currentUser]);

    function handleProjectInputChange(event) {
        const { name, value } = event.target;

        setProjectFormData({
            ...projectFormData,
            [name]: value,
        });
    }

    async function handleProjectSubmit(event) {
        event.preventDefault();

        if (!projectFormData.name.trim()) {
            return false;
        }

        setProjectsError("");

        try {
            if (editingProjectId) {
                const updatedProject = await updateProject(
                    editingProjectId,
                    projectFormData,
                );

                setProjects((currentProjects) =>
                    currentProjects.map((project) =>
                        project.id === editingProjectId ? updatedProject : project,
                    ),
                );

                setEditingProjectId(null);
            } else {
                const newProject = await createProject(projectFormData);

                setProjects((currentProjects) => [newProject, ...currentProjects]);
                setSelectedProjectId(newProject.id);
            }

            setProjectFormData({
                name: "",
                description: "",
            });

            return true;
        } catch (error) {
            setProjectsError(error.message);
            return false;
        }
    }

    function handleStartEditProject(project) {
        setEditingProjectId(project.id);

        setProjectFormData({
            name: project.name,
            description: project.description || "",
        });
    }

    function handleCancelEditProject() {
        setEditingProjectId(null);

        setProjectFormData({
            name: "",
            description: "",
        });
    }

    async function handleDeleteProject(projectId) {
        const confirmDelete = window.confirm(
            "¿Seguro que quieres eliminar este proyecto? Sus tareas quedarán sin proyecto.",
        );

        if (!confirmDelete) {
            return;
        }

        setProjectsError("");

        try {
            await deleteProject(projectId);

            setProjects((currentProjects) =>
                currentProjects.filter((project) => project.id !== projectId),
            );

            if (selectedProjectId === projectId) {
                setSelectedProjectId(null);
            }
        } catch (error) {
            setProjectsError(error.message);
        }
    }

    function resetProjects() {
        setProjects([]);
        setSelectedProjectId(null);
        setProjectsError("");
        setProjectsLoading(false);

        setProjectFormData({
            name: "",
            description: "",
        });

        setEditingProjectId(null);
    }

    return {
        projects,
        setProjects,
        selectedProjectId,
        setSelectedProjectId,
        projectsLoading,
        projectsError,
        projectFormData,
        editingProjectId,
        handleProjectInputChange,
        handleProjectSubmit,
        handleStartEditProject,
        handleCancelEditProject,
        handleDeleteProject,
        resetProjects,
    };
}

export default useProjects;