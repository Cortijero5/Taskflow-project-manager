# TaskFlow - Project Manager

TaskFlow es una aplicación web full-stack inspirada en Trello para gestionar proyectos y tareas.

El objetivo del proyecto es demostrar el uso de React en frontend, Express en backend, una API REST protegida con JWT, base de datos MySQL mediante Prisma ORM y entorno de desarrollo con Docker.

---

## Capturas

### Login

![Pantalla de login](docs/images/login.png)

### Dashboard principal

![Dashboard principal de TaskFlow](docs/images/dashboard.png)

### Modal de tarea

![Modal de creación o edición de tarea](docs/images/task-modal.png)

## Tecnologías utilizadas

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript
- Custom Hooks
- Fetch API

### Backend

- Node.js
- Express
- Prisma ORM
- MySQL
- JWT
- bcryptjs
- Helmet
- CORS
- dotenv

### Infraestructura

- Docker
- Docker Compose
- phpMyAdmin

---

## Funcionalidades principales

- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante JWT.
- Contraseñas cifradas con bcrypt.
- Rutas protegidas en backend.
- Cada usuario solo puede ver sus propios proyectos y tareas.
- CRUD completo de proyectos.
- CRUD completo de tareas.
- Tareas asociadas a proyectos.
- Tareas sin proyecto.
- Tablero de tareas por columnas:
  - Pendiente
  - En progreso
  - Hecho
- Cambio de estado mediante drag and drop entre columnas.
- Formularios de creación y edición en modales.
- Colores visuales por estado y prioridad.
- Validaciones básicas en frontend y backend.
- Variables de entorno separadas con `.env`.
- Base de datos MySQL levantada con Docker.

---

## Estructura del proyecto

```txt
TaskFlow/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Requisitos previos

Antes de ejecutar el proyecto necesitas tener instalado:

- Node.js
- npm
- Docker Desktop
- Git

---

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/Cortijero5/Taskflow-project-manager.git
```

Entra en la carpeta del proyecto:

```bash
cd TaskFlow
```

---

## Configuración de variables de entorno

El proyecto usa variables de entorno para separar la configuración del código.

### Backend

Crea un archivo `.env` dentro de la carpeta `backend/`.

Puedes usar como referencia el archivo `backend/.env.example`.

```env
DATABASE_URL="mysql://root:root@localhost:3307/taskflow_db"
JWT_SECRET="change_this_secret_key"
PORT=3000
```

### Frontend

Crea un archivo `.env` dentro de la carpeta `frontend/`.

Puedes usar como referencia el archivo `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Levantar la base de datos con Docker

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto levantará:

- MySQL en el puerto `3307`
- phpMyAdmin en el puerto `8081`

Puedes acceder a phpMyAdmin desde:

```txt
http://localhost:8081
```

---

## Instalación y ejecución del backend

Entra en la carpeta del backend:

```bash
cd backend
```

Instala dependencias:

```bash
npm install
```

Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev
```

Arranca el servidor:

```bash
npm run dev
```

El backend estará disponible en:

```txt
http://localhost:3000
```

Ruta de prueba:

```txt
http://localhost:3000/api/health
```

---

## Instalación y ejecución del frontend

En otra terminal, entra en la carpeta del frontend:

```bash
cd frontend
```

Instala dependencias:

```bash
npm install
```

Arranca la aplicación:

```bash
npm run dev
```

El frontend estará disponible en:

```txt
http://localhost:5173
```

---

## Endpoints principales

### Autenticación

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Proyectos

```txt
GET    /api/projects
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### Tareas

```txt
GET    /api/tasks
GET    /api/tasks?projectId=:id
GET    /api/tasks?projectId=unassigned
POST   /api/tasks
PATCH  /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id
```

---

## Seguridad implementada

- Contraseñas cifradas con `bcryptjs`.
- Autenticación con JWT.
- Middleware propio para proteger rutas privadas.
- Separación de datos por usuario.
- Validaciones en backend.
- Validaciones básicas en frontend.
- Helmet para cabeceras de seguridad HTTP.
- CORS configurado para permitir el frontend.
- Variables sensibles separadas en `.env`.
- Archivos `.env.example` incluidos como referencia.
- Archivos `.env` reales excluidos del repositorio.

---

## Arquitectura frontend

El frontend está organizado separando vista, lógica y llamadas a la API.

```txt
components/
→ Componentes visuales reutilizables.

hooks/
→ Lógica de autenticación, proyectos y tareas.

services/
→ Peticiones HTTP al backend.

constants/
→ Estados, prioridades y etiquetas comunes.
```

Hooks principales:

```txt
useAuth
→ Registro, login, logout y recuperación de sesión.

useProjects
→ Carga, creación, edición y eliminación de proyectos.

useTasks
→ Carga, creación, edición, eliminación y cambio de estado de tareas.
```

Services principales:

```txt
apiClient.js
→ Configuración común de peticiones HTTP, token y errores.

authService.js
→ Peticiones relacionadas con autenticación.

projectService.js
→ Peticiones relacionadas con proyectos.

taskService.js
→ Peticiones relacionadas con tareas.
```

---

## Arquitectura backend

El backend está dividido en:

```txt
routes/
→ Rutas de autenticación, proyectos y tareas.

middleware/
→ Middleware de autenticación JWT.

constants/
→ Estados y prioridades permitidas.

lib/
→ Cliente Prisma.

prisma/
→ Esquema y migraciones de base de datos.
```

---

## Modelo de datos principal

El proyecto trabaja principalmente con tres entidades:

```txt
User
→ Representa al usuario registrado.

Project
→ Proyecto creado por un usuario.

Task
→ Tarea creada por un usuario, asociada opcionalmente a un proyecto.
```

Relaciones principales:

```txt
Un usuario puede tener muchos proyectos.
Un usuario puede tener muchas tareas.
Un proyecto puede tener muchas tareas.
Una tarea puede pertenecer a un proyecto o quedar sin proyecto.
```

---

## Estado actual del proyecto

El proyecto cuenta con una versión funcional que permite:

- Crear una cuenta.
- Iniciar sesión.
- Mantener sesión con JWT.
- Crear proyectos.
- Editar proyectos.
- Eliminar proyectos.
- Crear tareas dentro de proyectos.
- Crear tareas sin proyecto.
- Editar tareas.
- Eliminar tareas.
- Cambiar el estado de las tareas arrastrándolas entre columnas.
- Visualizar tareas en formato tablero.
- Crear y editar proyectos/tareas mediante modales.
- Mostrar colores por estado y prioridad.
- Separar los datos por usuario autenticado.

---

## Autor

Proyecto desarrollado por Fran Ortega.