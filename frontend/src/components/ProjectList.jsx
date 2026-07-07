function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onEditProject,
  onDeleteProject,
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-700">
          Todavía no hay proyectos.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Crea tu primer proyecto para empezar a organizar tareas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => {
        const isSelected = selectedProjectId === project.id;

        return (
          <article
            key={project.id}
            className={`rounded-xl border p-4 shadow-sm transition ${
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div>
              <h3 className="font-semibold text-slate-900">{project.name}</h3>

              <p className="mt-2 text-sm text-slate-600">
                {project.description || "Sin descripción."}
              </p>

              <p className="mt-3 text-xs font-medium text-slate-500">
                {project.tasks?.length || 0} tareas
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSelectProject(project.id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {isSelected ? "Seleccionado" : "Seleccionar"}
              </button>

              <button
                type="button"
                onClick={() => onEditProject(project)}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDeleteProject(project.id)}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                Eliminar
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProjectList;
