import TaskCard from "./TaskCard.jsx";

function TaskList({ tasks, onDeleteTask, onUpdateTaskStatus, onEditTask }) {
  // Si no hay tareas para mostrar, enseñamos un mensaje al usuario.
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-700">
          No hay tareas para este filtro.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Prueba con otro estado o crea una nueva tarea.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {/* Convertimos cada tarea del array en una tarjeta visual */}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          status={task.status}
          priority={task.priority}
          onDelete={onDeleteTask}
          onStatusChange={onUpdateTaskStatus}
          onStatusChange={onUpdateTaskStatus}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
