import { useState } from "react";
import ConfirmModal from "./ConfirmModal.jsx";

function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onEditProject,
  onDeleteProject,
}) {
  const [projectToDelete, setProjectToDelete] = useState(null);

  async function handleConfirmDeleteProject() {
    if (!projectToDelete) {
      return;
    }

    await onDeleteProject(projectToDelete.id);
    setProjectToDelete(null);
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-700">
          Todavía no hay proyectos.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Puedes crear tareas sin proyecto o crear tu primer proyecto para
          organizarlas mejor.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => {
          const isSelected = selectedProjectId === project.id;
          const taskCount = project.tasks?.length || 0;

          return (
            <article
              key={project.id}
              className={`rounded-xl border p-4 shadow-sm transition ${
                isSelected
                  ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words font-semibold text-slate-900">
                      {project.name}
                    </h3>

                    {isSelected && (
                      <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
                        Activo
                      </span>
                    )}
                  </div>

                  <p className="mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm text-slate-600">
                    {project.description || "Sin descripción."}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {taskCount} {taskCount === 1 ? "tarea" : "tareas"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    isSelected
                      ? onSelectProject(null)
                      : onSelectProject(project.id)
                  }
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {isSelected ? "Quitar selección" : "Seleccionar"}
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
                  onClick={() => setProjectToDelete(project)}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {projectToDelete && (
        <ConfirmModal
          title="Eliminar proyecto"
          message={`¿Seguro que quieres eliminar "${projectToDelete.name}"? Sus tareas no se borrarán, quedarán como tareas sin proyecto.`}
          confirmLabel="Eliminar proyecto"
          onConfirm={handleConfirmDeleteProject}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </>
  );
}

export default ProjectList;
