import AuthForm from "./components/AuthForm.jsx";
import DashboardHeader from "./components/DashboardHeader.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import TasksSection from "./components/TasksSection.jsx";
import useAuth from "./hooks/useAuth.js";
import useProjects from "./hooks/useProjects.js";
import useTasks from "./hooks/useTasks.js";

function App() {
  const {
    currentUser,
    authLoading,
    authSubmitting,
    authError,
    authMode,
    authFormData,
    handleAuthInputChange,
    handleAuthSubmit,
    handleAuthModeChange,
    logout,
  } = useAuth();

  const {
    projects,
    setProjects,
    selectedProjectId,
    setSelectedProjectId,
    projectsLoading,
    projectsError,
    projectFormData,
    editingProjectId,
    handleProjectInputChange,
    handleProjectSubmit,
    handleStartEditProject,
    handleCancelEditProject,
    handleDeleteProject,
    resetProjects,
  } = useProjects(currentUser);

  const {
    tasks,
    tasksLoading,
    tasksError,
    formData,
    editingTaskId,
    handleInputChange,
    handleSubmit,
    handleStartEditTask,
    handleCancelEditTask,
    handleDeleteTask,
    handleUpdateTaskStatus,
    resetTasks,
  } = useTasks(currentUser, selectedProjectId, setProjects);

  function handleLogout() {
    logout();
    resetProjects();
    resetTasks();
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <section className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            Cargando sesión...
          </p>
        </section>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <AuthForm
        mode={authMode}
        formData={authFormData}
        onInputChange={handleAuthInputChange}
        onSubmit={handleAuthSubmit}
        onModeChange={handleAuthModeChange}
        error={authError}
        loading={authSubmitting}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <DashboardHeader currentUser={currentUser} onLogout={handleLogout} />

          <ProjectsSection
            projectFormData={projectFormData}
            onProjectInputChange={handleProjectInputChange}
            onProjectSubmit={handleProjectSubmit}
            isEditingProject={editingProjectId !== null}
            onCancelEditProject={handleCancelEditProject}
            projectsLoading={projectsLoading}
            projectsError={projectsError}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onEditProject={handleStartEditProject}
            onDeleteProject={handleDeleteProject}
          />

          <TasksSection
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isEditingTask={editingTaskId !== null}
            onCancelEditTask={handleCancelEditTask}
            tasksLoading={tasksLoading}
            tasksError={tasksError}
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onEditTask={handleStartEditTask}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
