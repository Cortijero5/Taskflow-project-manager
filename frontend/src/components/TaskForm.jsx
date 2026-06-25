function TaskForm({ formData, onInputChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Título
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Ej: Crear pantalla de registro"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Breve descripción de la tarea"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Estado
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={onInputChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="TODO">Pendiente</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="DONE">Hecho</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Prioridad
          </label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={onInputChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Crear tarea
      </button>
    </form>
  );
}

export default TaskForm;
