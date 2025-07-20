
---

## 📚 My Intelli Frontend App – Prueba Técnica (Next.js + TypeScript)

Este proyecto es una aplicación de gestión de libros y autores construida como parte de una **prueba técnica**, utilizando tecnologías modernas como **Next.js**, **TypeScript**, y **ShadCN UI**.

Permite visualizar, crear, editar y eliminar autores y libros, así como exportar los datos a archivos Excel. Cuenta con autenticación básica mediante cookies y una estructura clara y escalable en el frontend.

---

### 🚀 Tecnologías utilizadas

* **Next.js 14** con `app/` directory (App Router)
* **TypeScript**
* **ShadCN UI**: librería de componentes basada en Radix UI y TailwindCSS
* **Tailwind CSS**: estilos utilitarios
* **Server Actions & Fetching** (`server-only`, `use client`)
* **Next.js Authentication** con cookies (sin external provider)

---

### 📄 Funcionalidades principales

* ✅ Listado de autores y libros
* ➕ Agregar y editar autores/libros usando `Dialog` de ShadCN UI
* 🗑 Eliminar registros con confirmación
* ⬇ Exportar datos a Excel desde endpoints
* 🔐 Autenticación simple vía cookie de sesión (`/login`)
* 💡 Manejo de estado con hooks personalizados (ej: `useAuthors`, `useBooks`)

---

### 📦 Dependencias clave

```bash
"next": "14.x",
"react": "18.x",
"typescript": "^5.x",
"tailwindcss": "^3.x",
"@shadcn/ui": "^0.3.x",
"clsx": "^1.x",
"tailwind-merge": "^2.x"
```

### 📂 Endpoints esperados por la API externa

* `GET    /authors`

* `POST   /authors`

* `PATCH  /authors/:id`

* `DELETE /authors/:id`

* `GET    /books`

* `POST   /books`

* `PATCH  /books/:id`

* `DELETE /books/:id`

* `GET    /export/authors/excel`

* `GET    /export/books/excel`

* `GET    /export/combined/excel`

---

### ✅ Cómo correr el proyecto

```bash
# Instalar dependencias
npm install

# Iniciar servidor Next.js
npm run dev
```

> Asegúrate de que la API esté corriendo también para que las llamadas funcionen.

---

### 💡 To Do / Mejoras Futuras

* Validación de formularios con `zod` o `react-hook-form`
* Paginación de autores y libros
* Búsqueda y filtros
* Login más robusto con JWT y roles

---
