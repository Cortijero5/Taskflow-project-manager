import { statusOptions, statusStyles } from "../constants/taskOptions.js";
import TaskCard from "./TaskCard.jsx";

function TaskBoard({ tasks, onDeleteTask, onUpdateTaskStatus, onEditTask }) {
  function handleDragStart(event, taskId) {
    event.dataTransfer.setData("taskId", String(taskId));
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event, newStatus) {
    event.preventDefault();

    const taskId = Number(event.dataTransfer.getData("taskId"));

    if (Number.isNaN(taskId)) {
      return;
    }

    const draggedTask = tasks.find((task) => task.id === taskId);

    if (!draggedTask || draggedTask.status === newStatus) {
      return;
    }

    onUpdateTaskStatus(taskId, newStatus);
  }

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

        const columnStyle =
          statusStyles[column.value]?.column || "border-slate-200 bg-slate-50";

        const headerStyle =
          statusStyles[column.value]?.header || "text-slate-900";

        return (
          <section
            key={column.value}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, column.value)}
            className={`min-h-64 rounded-xl border p-4 transition ${columnStyle}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`font-semibold ${headerStyle}`}>{column.label}</h3>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {columnTasks.length}
              </span>
            </div>

            <div className="grid gap-3">
              {columnTasks.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                  Arrastra una tarea aquí.
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
                    onEdit={onEditTask}
                    onDragStart={handleDragStart}
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
