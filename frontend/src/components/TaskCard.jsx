import { useState } from "react";
import { priorityLabels, priorityStyles } from "../constants/taskOptions.js";
import ConfirmModal from "./ConfirmModal.jsx";

function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  onDelete,
  onEdit,
  onDragStart,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const priorityBadgeStyle =
    priorityStyles[priority] || "bg-slate-100 text-slate-700";

  async function handleConfirmDeleteTask() {
    await onDelete(id);
    setShowDeleteModal(false);
  }

  return (
    <>
      <article
        draggable
        onDragStart={(event) => onDragStart(event, id)}
        className="min-w-0 max-w-full cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing"
      >
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 flex-1 overflow-hidden">
            <h3 className="break-words [overflow-wrap:anywhere] font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm text-slate-600">
              {description || "Sin descripción."}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${priorityBadgeStyle}`}
          >
            {priorityLabels[priority] || priority}
          </span>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
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
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          >
            Eliminar
          </button>
        </div>
      </article>

      {showDeleteModal && (
        <ConfirmModal
          title="Eliminar tarea"
          message={`¿Seguro que quieres eliminar "${title}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar tarea"
          onConfirm={handleConfirmDeleteTask}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

export default TaskCard;
