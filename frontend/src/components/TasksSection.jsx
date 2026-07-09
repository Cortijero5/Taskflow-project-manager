import { useState } from "react";
import Modal from "./Modal.jsx";
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
  const [showTaskForm, setShowTaskForm] = useState(false);

  const shouldShowTaskForm = showTaskForm || isEditingTask;

  async function handleTaskFormSubmit(event) {
    const success = await onSubmit(event);

    if (success) {
      setShowTaskForm(false);
    }
  }

  function handleCloseTaskModal() {
    onCancelEditTask();
    setShowTaskForm(false);
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Tareas del proyecto
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Selecciona un proyecto o quita la selección para gestionar tareas
            sin proyecto.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTaskForm(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Crear tarea
        </button>
      </div>

      {shouldShowTaskForm && (
        <Modal
          title={isEditingTask ? "Editar tarea" : "Crear tarea"}
          description={
            isEditingTask
              ? "Modifica los datos de la tarea seleccionada."
              : "Crea una nueva tarea para el tablero actual."
          }
          onClose={handleCloseTaskModal}
        >
          {tasksError && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
              {tasksError}
            </p>
          )}

          <TaskForm
            formData={formData}
            onInputChange={onInputChange}
            onSubmit={handleTaskFormSubmit}
            isEditing={isEditingTask}
            onCancelEdit={handleCloseTaskModal}
          />
        </Modal>
      )}

      {tasksLoading && (
        <p className="mb-4 text-sm font-medium text-slate-600">
          Cargando tareas desde la API...
        </p>
      )}

      {!shouldShowTaskForm && tasksError && (
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
