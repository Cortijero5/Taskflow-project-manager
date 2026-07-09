import { useState } from "react";
import Modal from "./Modal.jsx";
import ProjectForm from "./ProjectForm.jsx";
import ProjectList from "./ProjectList.jsx";

function ProjectsSection({
  projectFormData,
  onProjectInputChange,
  onProjectSubmit,
  isEditingProject,
  onCancelEditProject,
  projectsLoading,
  projectsError,
  projects,
  selectedProjectId,
  onSelectProject,
  onEditProject,
  onDeleteProject,
}) {
  const [showProjectForm, setShowProjectForm] = useState(false);

  const shouldShowProjectForm = showProjectForm || isEditingProject;

  async function handleProjectFormSubmit(event) {
    const success = await onProjectSubmit(event);

    if (success) {
      setShowProjectForm(false);
    }
  }

  function handleCloseProjectModal() {
    onCancelEditProject();
    setShowProjectForm(false);
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Proyectos</h2>
          <p className="mt-1 text-sm text-slate-600">
            Crea y selecciona proyectos para organizar mejor tus tareas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowProjectForm(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Crear proyecto
        </button>
      </div>

      {shouldShowProjectForm && (
        <Modal
          title={isEditingProject ? "Editar proyecto" : "Crear proyecto"}
          description={
            isEditingProject
              ? "Modifica los datos del proyecto seleccionado."
              : "Crea un nuevo proyecto para agrupar tus tareas."
          }
          onClose={handleCloseProjectModal}
        >
          {projectsError && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
              {projectsError}
            </p>
          )}

          <ProjectForm
            formData={projectFormData}
            onInputChange={onProjectInputChange}
            onSubmit={handleProjectFormSubmit}
            isEditing={isEditingProject}
            onCancelEdit={handleCloseProjectModal}
          />
        </Modal>
      )}

      {projectsLoading && (
        <p className="mb-4 text-sm font-medium text-slate-600">
          Cargando proyectos desde la API...
        </p>
      )}

      {!shouldShowProjectForm && projectsError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
          {projectsError}
        </p>
      )}

      <ProjectList
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={onSelectProject}
        onEditProject={onEditProject}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
}

export default ProjectsSection;
