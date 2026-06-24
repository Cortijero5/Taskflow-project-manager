import FeatureCard from './components/FeatureCard.jsx'

const features = [
  {
    id: 1,
    title: 'Proyectos',
    description: 'Crea y organiza tus espacios de trabajo.',
  },
  {
    id: 2,
    title: 'Tareas',
    description: 'Gestiona tareas por estado, prioridad y fecha.',
  },
  {
    id: 3,
    title: 'API REST',
    description: 'Frontend conectado a un backend con Express.',
  },
]

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
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App