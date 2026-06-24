function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
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

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">Proyectos</h2>
              <p className="mt-2 text-sm text-slate-600">
                Crea y organiza tus espacios de trabajo.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">Tareas</h2>
              <p className="mt-2 text-sm text-slate-600">
                Gestiona tareas por estado, prioridad y fecha.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">API REST</h2>
              <p className="mt-2 text-sm text-slate-600">
                Frontend conectado a un backend con Express.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App