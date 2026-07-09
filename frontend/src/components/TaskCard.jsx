import {
  priorityLabels,
  priorityStyles,
  statusLabels,
  statusOptions,
  statusStyles,
} from "../constants/taskOptions.js";

function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  onDelete,
  onStatusChange,
  onEdit,
}) {
  const priorityBadgeStyle =
    priorityStyles[priority] || "bg-slate-100 text-slate-700";

  const statusBadgeStyle =
    statusStyles[status]?.badge || "bg-blue-50 text-blue-700";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-semibold text-slate-900">{title}</h3>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-600">
            {description || "Sin descripción."}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${priorityBadgeStyle}`}
        >
          {priorityLabels[priority] || priority}
        </span>
      </div>

      <div className="mt-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeStyle}`}
        >
          {statusLabels[status] || status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onStatusChange(id, option.value)}
            disabled={status === option.value}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              status === option.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          onEdit({
            id,
            title,
            description,
            status,
            priority,
          })
        }
        className="mt-4 mr-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        Editar
      </button>

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
