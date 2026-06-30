function ProjectForm({ formData, onInputChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="projectName"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Nombre del proyecto
          </label>

          <input
            id="projectName"
            name="name"
            type="text"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Ej: TaskFlow Portfolio"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="projectDescription"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <input
            id="projectDescription"
            name="description"
            type="text"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Breve descripción del proyecto"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Crear proyecto
      </button>
    </form>
  );
}

export default ProjectForm;
