function DashboardHeader({ currentUser, onLogout }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
          TaskFlow
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          Gestor de proyectos y tareas
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          Proyecto full-stack inspirado en Trello, desarrollado con React,
          Tailwind CSS, Express, MySQL y Prisma.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Sesión iniciada como{" "}
          <span className="font-semibold text-slate-700">
            {currentUser.email}
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default DashboardHeader;
