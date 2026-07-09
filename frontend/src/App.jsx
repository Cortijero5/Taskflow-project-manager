import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm.jsx";
import DashboardHeader from "./components/DashboardHeader.jsx";
import FeatureCard from "./components/FeatureCard.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import TasksSection from "./components/TasksSection.jsx";
import useAuth from "./hooks/useAuth.js";
import useProjects from "./hooks/useProjects.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "./services/taskService.js";

const features = [
  {
    id: 1,
    title: "Proyectos",
    description: "Crea y organiza tus espacios de trabajo.",
  },
  {
    id: 2,
    title: "Tareas",
    description: "Gestiona tareas por estado, prioridad y fecha.",
  },
  {
    id: 3,
    title: "API REST",
    description: "Frontend conectado a un backend con Express.",
  },
];

function App() {
  const {
    currentUser,
    authLoading,
    authSubmitting,
    authError,
    authMode,
    authFormData,
    handleAuthInputChange,
    handleAuthSubmit,
    handleAuthModeChange,
    logout,
  } = useAuth();

  const {
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
  } = useProjects(currentUser);

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

  function handleLogout() {
    logout();
    resetProjects();

    setTasks([]);
    setSelectedStatus("ALL");

    setFormData({
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
    });

    setEditingTaskId(null);
    setTasksError("");
  }

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

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <section className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            Cargando sesión...
          </p>
        </section>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <AuthForm
        mode={authMode}
        formData={authFormData}
        onInputChange={handleAuthInputChange}
        onSubmit={handleAuthSubmit}
        onModeChange={handleAuthModeChange}
        error={authError}
        loading={authSubmitting}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <DashboardHeader currentUser={currentUser} onLogout={handleLogout} />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

          <ProjectsSection
            projectFormData={projectFormData}
            onProjectInputChange={handleProjectInputChange}
            onProjectSubmit={handleProjectSubmit}
            isEditingProject={editingProjectId !== null}
            onCancelEditProject={handleCancelEditProject}
            projectsLoading={projectsLoading}
            projectsError={projectsError}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onEditProject={handleStartEditProject}
            onDeleteProject={handleDeleteProject}
          />

          <TasksSection
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isEditingTask={editingTaskId !== null}
            onCancelEditTask={handleCancelEditTask}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            tasksLoading={tasksLoading}
            tasksError={tasksError}
            tasks={filteredTasks}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onEditTask={handleStartEditTask}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
