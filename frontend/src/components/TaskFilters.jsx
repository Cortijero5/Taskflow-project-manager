// Filtros disponibles para mostrar tareas según su estado.
const taskFilters = [
  { label: "Todas", value: "ALL" },
  { label: "Pendientes", value: "TODO" },
  { label: "En progreso", value: "IN_PROGRESS" },
  { label: "Hechas", value: "DONE" },
];

function TaskFilters({ selectedStatus, onStatusChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {taskFilters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onStatusChange(filter.value)}
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
  );
}

export default TaskFilters;
