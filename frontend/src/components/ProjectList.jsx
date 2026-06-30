function ProjectList({ projects, selectedProjectId, onSelectProject }) {
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
      {/* Creamos una tarjeta por cada proyecto */}
      {projects.map((project) => {
        const isSelected = selectedProjectId === project.id;

        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelectProject(project.id)}
            className={`rounded-xl border p-4 text-left shadow-sm transition ${
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <h3 className="font-semibold text-slate-900">{project.name}</h3>

            <p className="mt-2 text-sm text-slate-600">
              {project.description || "Sin descripción."}
            </p>

            <p className="mt-3 text-xs font-medium text-slate-500">
              {project.tasks?.length || 0} tareas
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default ProjectList;
