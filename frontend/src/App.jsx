import { useEffect, useState } from "react";
import FeatureCard from "./components/FeatureCard.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskFilters from "./components/TaskFilters.jsx";
import TaskBoard from "./components/TaskBoard.jsx";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "./services/taskService.js";
import ProjectForm from "./components/ProjectForm.jsx";
import ProjectList from "./components/ProjectList.jsx";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "./services/projectService.js";
import AuthForm from "./components/AuthForm.jsx";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "./services/authService.js";
import DashboardHeader from "./components/DashboardHeader.jsx";

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
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("login");

  const [authFormData, setAuthFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("unassigned");
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");

  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  });

  const [editingProjectId, setEditingProjectId] = useState(null);

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

  // Comprueba si hay sesión guardada al cargar la app.
  useEffect(() => {
    async function loadCurrentUser() {
      const token = localStorage.getItem("taskflow_token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser(token);
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem("taskflow_token");
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

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
          setSelectedProjectId("unassigned");
        }
      } catch (error) {
        setProjectsError(error.message);
      } finally {
        setProjectsLoading(false);
      }
    }

    loadProjects();
  }, [currentUser]);

  // Carga tareas cuando hay usuario y cambia la vista/proyecto seleccionado.
  useEffect(() => {
    async function loadTasks() {
      if (!currentUser) {
        return;
      }

      setTasksLoading(true);
      setTasksError("");

      try {
        const data = await getTasks(selectedProjectId);
        setTasks(data);
      } catch (error) {
        setTasksError(error.message);
      } finally {
        setTasksLoading(false);
      }
    }

    loadTasks();
  }, [currentUser, selectedProjectId]);

  function handleAuthInputChange(event) {
    const { name, value } = event.target;

    setAuthFormData({
      ...authFormData,
      [name]: value,
    });
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();

    setAuthError("");
    setAuthSubmitting(true);

    try {
      if (authMode === "register") {
        await registerUser(authFormData);
      }

      const data = await loginUser({
        email: authFormData.email,
        password: authFormData.password,
      });

      localStorage.setItem("taskflow_token", data.token);
      setCurrentUser(data.user);

      setAuthFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthSubmitting(false);
    }
  }

  function handleAuthModeChange() {
    setAuthError("");
    setAuthMode((currentMode) =>
      currentMode === "login" ? "register" : "login",
    );
  }

  function handleLogout() {
    localStorage.removeItem("taskflow_token");

    setCurrentUser(null);
    setProjects([]);
    setTasks([]);
    setSelectedProjectId("unassigned");
    setSelectedStatus("ALL");

    setProjectFormData({
      name: "",
      description: "",
    });

    setFormData({
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
    });

    setEditingProjectId(null);
    setEditingTaskId(null);
    setProjectsError("");
    setTasksError("");
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

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
      return;
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
    } catch (error) {
      setProjectsError(error.message);
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
        setSelectedProjectId("unassigned");
      }
    } catch (error) {
      setProjectsError(error.message);
    }
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
          projectId:
            selectedProjectId === "unassigned" ? null : selectedProjectId,
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

          <div className="mt-10">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">Proyectos</h2>
              <p className="mt-1 text-sm text-slate-600">
                Crea y selecciona proyectos para organizar mejor tus tareas.
              </p>
            </div>

            <ProjectForm
              formData={projectFormData}
              onInputChange={handleProjectInputChange}
              onSubmit={handleProjectSubmit}
              isEditing={editingProjectId !== null}
              onCancelEdit={handleCancelEditProject}
            />

            {projectsLoading && (
              <p className="mb-4 text-sm font-medium text-slate-600">
                Cargando proyectos desde la API...
              </p>
            )}

            {projectsError && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                {projectsError}
              </p>
            )}

            <ProjectList
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onEditProject={handleStartEditProject}
              onDeleteProject={handleDeleteProject}
            />
          </div>

          <div className="mt-10">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Tareas del proyecto
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Selecciona un proyecto y gestiona sus tareas asociadas.
              </p>
            </div>

            <TaskForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isEditing={editingTaskId !== null}
              onCancelEdit={handleCancelEditTask}
            />

            <TaskFilters
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            {tasksLoading && (
              <p className="mb-4 text-sm font-medium text-slate-600">
                Cargando tareas desde la API...
              </p>
            )}

            {tasksError && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                {tasksError}
              </p>
            )}

            <TaskBoard
              tasks={filteredTasks}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onEditTask={handleStartEditTask}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
