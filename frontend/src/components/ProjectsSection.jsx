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
  return (
    <div className="mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Proyectos</h2>
        <p className="mt-1 text-sm text-slate-600">
          Crea y selecciona proyectos para organizar mejor tus tareas.
        </p>
      </div>

      <ProjectForm
        formData={projectFormData}
        onInputChange={onProjectInputChange}
        onSubmit={onProjectSubmit}
        isEditing={isEditingProject}
        onCancelEdit={onCancelEditProject}
      />

      {projectsLoading && (
        <p className="mb-4 text-sm font-medium text-slate-600">
          Cargando proyectos desde la API...
        </p>
      )}

      {projectsError && (
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
