import { useState } from "react";
import FeatureCard from "./components/FeatureCard.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskFilters from "./components/TaskFilters.jsx";
import TaskList from "./components/TaskList.jsx";

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
  // Controla si mostramos u ocultamos el bloque de detalles del proyecto.
  const [showDetails, setShowDetails] = useState(false);

  // Guarda el filtro de estado seleccionado actualmente.
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Guarda la lista de tareas actual.
  // De momento empieza vacía; más adelante se cargará desde la API.
  const [tasks, setTasks] = useState([]);

  // Guarda los valores actuales del formulario.
  // Cada input/select estará conectado a una propiedad de este objeto.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
  });

  // Calcula qué tareas se deben mostrar según el filtro activo.
  // Si el filtro es "ALL", mostramos todas. Si no, filtramos por status.
  const filteredTasks =
    selectedStatus === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === selectedStatus);

  // Actualiza el estado del formulario cuando el usuario escribe o selecciona algo.
  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Controla el envío del formulario y añade una nueva tarea al estado.
  function handleSubmit(event) {
    event.preventDefault();

    // Evita crear tareas sin título o solo con espacios.
    if (!formData.title.trim()) {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
    };

    // Creamos un nuevo array con la tarea nueva al principio.
    // No usamos push porque en React no debemos mutar el estado directamente.
    setTasks([newTask, ...tasks]);

    // Limpiamos el formulario después de crear la tarea.
    setFormData({
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
    });

    // Volvemos al filtro "Todas" para que la tarea recién creada sea visible.
    setSelectedStatus("ALL");
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

            <TaskForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />

            <TaskFilters
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            <TaskList tasks={filteredTasks} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
