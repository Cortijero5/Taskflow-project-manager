import TaskBoard from "./TaskBoard.jsx";
import TaskForm from "./TaskForm.jsx";

function TasksSection({
  formData,
  onInputChange,
  onSubmit,
  isEditingTask,
  onCancelEditTask,
  tasksLoading,
  tasksError,
  tasks,
  onDeleteTask,
  onUpdateTaskStatus,
  onEditTask,
}) {
  return (
    <div className="mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Tareas del proyecto
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Selecciona un proyecto o quita la selección para gestionar tareas sin
          proyecto.
        </p>
      </div>

      <TaskForm
        formData={formData}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        isEditing={isEditingTask}
        onCancelEdit={onCancelEditTask}
      />

      {tasksLoading && (
        <p className="mb-4 text-sm font-medium text-slate-600">
          Cargando tareas desde la API...
        </p>
      )}

      {tasksError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
          {tasksError}
        </p>
      )}

      <TaskBoard
        tasks={tasks}
        onDeleteTask={onDeleteTask}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onEditTask={onEditTask}
      />
    </div>
  );
}

export default TasksSection;
