function FeatureCard({ title, description }) {
  return (
    <article className="rounded-xl border border-slate-200 p-4">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </article>
  )
}

export default FeatureCard