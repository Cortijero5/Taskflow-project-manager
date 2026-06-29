const statusLabels = {
  TODO: "Pendiente",
  IN_PROGRESS: "En progreso",
  DONE: "Hecho",
};

const priorityLabels = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
};

function TaskCard({ id, title, description, status, priority, onDelete }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {priorityLabels[priority]}
        </span>
      </div>

      <div className="mt-4">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {statusLabels[status]}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onDelete(id)}
        className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
      >
        Eliminar
      </button>
    </article>
  );
}

export default TaskCard;
