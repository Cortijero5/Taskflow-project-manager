import { useEffect, useState } from "react";
import FeatureCard from "./components/FeatureCard.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskFilters from "./components/TaskFilters.jsx";
import TaskList from "./components/TaskList.jsx";
import {
  createTask,
  deleteTask,
  getTasks,
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

// Datos estáticos para las tarjetas informativas de la parte superior.
// De momento están en frontend, pero más adelante parte de los datos vendrán de la API.
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
  // Guarda el filtro de estado seleccionado actualmente.
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Guarda la lista de tareas actual.
  // De momento empieza vacía; más adelante se cargará desde la API.
  const [tasks, setTasks] = useState([]);

  // Controla si estamos cargando tareas desde el backend.
  const [tasksLoading, setTasksLoading] = useState(false);

  // Guarda un posible error al cargar o crear tareas.
  const [tasksError, setTasksError] = useState("");

  // Guarda los valores actuales del formulario.
  // Cada input/select estará conectado a una propiedad de este objeto.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
  });

  // Guarda la lista de proyectos cargados desde el backend.
  const [projects, setProjects] = useState([]);

  // Guarda el proyecto seleccionado actualmente.
  const [selectedProjectId, setSelectedProjectId] = useState("unassigned");

  // Controla si estamos cargando proyectos desde el backend.
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Guarda errores relacionados con proyectos.
  const [projectsError, setProjectsError] = useState("");

  // Guarda los valores actuales del formulario de proyecto.
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  });
  // Guarda el id del proyecto que estamos editando.
  // Si es null, el formulario crea un proyecto nuevo.
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Calcula qué tareas se deben mostrar según el filtro activo.
  // Si el filtro es "ALL", mostramos todas. Si no, filtramos por status.
  const filteredTasks =
    selectedStatus === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === selectedStatus);

  // Carga las tareas según la vista seleccionada.
  // "unassigned" muestra tareas sin proyecto.
  // Un id numérico muestra tareas de ese proyecto.
  useEffect(() => {
    async function loadTasks() {
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
  }, [selectedProjectId]);

  // Carga los proyectos desde el backend cuando se monta App.
  useEffect(() => {
    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError("");

      try {
        const data = await getProjects();
        setProjects(data);

        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (error) {
        setProjectsError(error.message);
      } finally {
        setProjectsLoading(false);
      }
    }

    loadProjects();
  }, []);

  // Actualiza el estado del formulario cuando el usuario escribe o selecciona algo.
  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Actualiza el formulario de proyectos cuando el usuario escribe.
  function handleProjectInputChange(event) {
    const { name, value } = event.target;

    setProjectFormData({
      ...projectFormData,
      [name]: value,
    });
  }

  // Crea o actualiza un proyecto usando la API.
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

        setProjects([newProject, ...projects]);
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

  // Controla el envío del formulario y crea una nueva tarea en el backend.
  async function handleSubmit(event) {
    event.preventDefault();

    // Evita crear tareas sin título o solo con espacios.
    if (!formData.title.trim()) {
      return;
    }

    setTasksError("");

    try {
      const data = await createTask({
        ...formData,
        projectId:
          selectedProjectId === "unassigned" ? null : selectedProjectId,
      });

      // Añadimos la tarea a la lista visible del proyecto seleccionado.
      setTasks((currentTasks) => [data, ...currentTasks]);

      // Actualizamos también el contador de tareas dentro del proyecto.
      // ProjectList usa project.tasks.length, así que si no actualizamos projects,
      // la tarjeta del proyecto no cambia hasta refrescar.
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

      // Limpiamos el formulario después de crear la tarea.
      setFormData({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
      });

      // Volvemos al filtro "Todas" para que la tarea recién creada sea visible.
      setSelectedStatus("ALL");
    } catch (error) {
      setTasksError(error.message);
    }
  }

  // Carga los datos de un proyecto en el formulario para editarlo.
  function handleStartEditProject(project) {
    setEditingProjectId(project.id);

    setProjectFormData({
      name: project.name,
      description: project.description || "",
    });
  }

  // Cancela la edición y vuelve al modo crear proyecto.
  function handleCancelEditProject() {
    setEditingProjectId(null);

    setProjectFormData({
      name: "",
      description: "",
    });
  }

  // Elimina un proyecto usando la API y actualiza el estado local.
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
        setTasks([]);
      }
    } catch (error) {
      setProjectsError(error.message);
    }
  }

  // Elimina una tarea usando la API y actualiza el estado local.
  async function handleDeleteTask(taskId) {
    setTasksError("");

    try {
      await deleteTask(taskId);

      // Quitamos la tarea eliminada del estado local para actualizar la pantalla.
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
      // Quitamos también la tarea de los proyectos para actualizar el contador.
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

  // Actualiza el estado de una tarea usando la API.
  async function handleUpdateTaskStatus(taskId, newStatus) {
    setTasksError("");

    try {
      const data = await updateTaskStatus(taskId, newStatus);

      // Reemplazamos en el estado local la tarea antigua por la actualizada.
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? data : task)),
      );
    } catch (error) {
      setTasksError(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            TaskFlow
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Gestor de proyectos y tareas
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Proyecto full-stack inspirado en Trello, desarrollado con React,
            Tailwind CSS, Express, MySQL y Prisma.
          </p>

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

            <TaskList
              tasks={filteredTasks}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
