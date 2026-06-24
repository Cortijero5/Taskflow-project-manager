const statusLabels = {
  TODO: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  DONE: 'Hecho',
}

const priorityLabels = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
}

function TaskCard({ title, description, status, priority }) {
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
    </article>
  )
}

export default TaskCard