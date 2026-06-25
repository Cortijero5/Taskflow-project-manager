import { useState } from "react";
import FeatureCard from "./components/FeatureCard.jsx";
import TaskCard from "./components/TaskCard.jsx";

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

const tasks = [
  {
    id: 1,
    title: "Diseñar pantalla de login",
    description:
      "Crear una primera versión responsive del formulario de acceso.",
    status: "TODO",
    priority: "HIGH",
  },
  {
    id: 2,
    title: "Crear API de proyectos",
    description: "Preparar las rutas iniciales para listar y crear proyectos.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
  },
  {
    id: 3,
    title: "Configurar Tailwind",
    description: "Instalar Tailwind y limpiar los estilos iniciales de Vite.",
    status: "DONE",
    priority: "LOW",
  },
];
const taskFilters = [
  {
    label: "Todas",
    value: "ALL",
  },
  {
    label: "Pendientes",
    value: "TODO",
  },
  {
    label: "En progreso",
    value: "IN_PROGRESS",
  },
  {
    label: "Hechas",
    value: "DONE",
  },
];

function App() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const filteredTasks =
    selectedStatus === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === selectedStatus);

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

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {showDetails ? "Ocultar detalles" : "Ver detalles del proyecto"}
          </button>

          {showDetails && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
              TaskFlow tendrá autenticación, proyectos, tareas, estados,
              prioridades, filtros y conexión con una API REST construida con
              Express.
            </div>
          )}

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
              <h2 className="text-xl font-bold text-slate-900">
                Tareas recientes
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Primeras tareas de ejemplo que más adelante vendrán desde la
                API.
              </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {taskFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setSelectedStatus(filter.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedStatus === filter.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  priority={task.priority}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
