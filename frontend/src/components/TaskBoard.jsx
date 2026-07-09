import { statusOptions } from "../constants/taskOptions.js";
import TaskCard from "./TaskCard.jsx";

function TaskBoard({ tasks, onDeleteTask, onUpdateTaskStatus, onEditTask }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-700">
          No hay tareas para mostrar.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Crea una tarea para empezar a organizar el tablero.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {statusOptions.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.value,
        );

        return (
          <section
            key={column.value}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{column.label}</h3>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {columnTasks.length}
              </span>
            </div>

            <div className="grid gap-3">
              {columnTasks.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                  No hay tareas en esta columna.
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    priority={task.priority}
                    onDelete={onDeleteTask}
                    onStatusChange={onUpdateTaskStatus}
                    onEdit={onEditTask}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default TaskBoard;
