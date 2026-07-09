function AuthForm({
  mode,
  formData,
  onInputChange,
  onSubmit,
  onModeChange,
  error,
  loading,
}) {
  const isLogin = mode === "login";

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            TaskFlow
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            {isLogin
              ? "Accede para gestionar tus proyectos y tareas."
              : "Regístrate para empezar a organizar tu trabajo."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Nombre
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={onInputChange}
                  placeholder="Tu nombre"
                  required
                  minLength={2}
                  autoComplete="name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Contraseña
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onInputChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Procesando..." : isLogin ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          <button
            type="button"
            onClick={onModeChange}
            className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {isLogin
              ? "¿No tienes cuenta? Crear cuenta"
              : "¿Ya tienes cuenta? Iniciar sesión"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default AuthForm;
