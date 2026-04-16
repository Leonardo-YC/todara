<div align="center">

<img src="public/logos/todara-email.png" alt="Todara Logo" width="120" />

# Todara | Boutique Productivity

**Gestor de tareas emocional y elegante, diseñado para que la productividad no sea aburrida.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple?logo=nextdotjs)](https://authjs.dev/)
[![Neon DB](https://img.shields.io/badge/Neon-Serverless-00e599?logo=postgresql)](https://neon.tech)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

[Demo en vivo](https://todara.vercel.app) · [Reportar bug](https://github.com/Leonardo-YC/todara/issues)

*For the English version, check the source code / Para la versión en inglés, revisa el código fuente.*

</div>

---

## 📖 Descripción

**Todara** es un MVP (Producto Mínimo Viable) de gestión de tareas "Boutique" construido para resolver problemas reales de productividad mediante una interfaz emocional, elegante y altamente responsiva.

Vigilado por **Sofi** (nuestra mascota Schnauzer interactiva que reacciona a tus acciones), Todara demuestra que organizar tu día a día puede ser una experiencia premium. El proyecto destaca por su arquitectura moderna, utilizando Server Actions, PWA instalable y un sistema de autenticación "Passwordless" de vanguardia.

---

## ✨ Características Principales

* **Autenticación "Passwordless" (Auth.js v5)** — Acceso ultra seguro mediante Google, GitHub o Magic Links (enviados vía Nodemailer/Gmail SMTP). ¡Cero contraseñas!
* **Progressive Web App (PWA)** — Instalable de forma nativa en iOS, Android o Desktop sin pasar por tiendas de aplicaciones.
* **Modo Offline & Sincronización** — Crea y revisa tareas incluso sin conexión a internet. Sofi las sincronizará automáticamente cuando vuelvas a estar en línea.
* **Optimistic UI (Framer Motion)** — Interacciones a la velocidad de la luz. Las tareas se actualizan visualmente al instante, antes de que la base de datos (Neon) confirme la acción.
* **Diseño Boutique & Temas** — Interfaz meticulosamente diseñada con Tailwind CSS y Shadcn/UI, soportando Modo Oscuro/Claro de forma nativa.
* **Soporte Bilingüe (Next-Intl)** — Aplicación 100% traducida y enrutada en Inglés y Español.
* **Mascota Interactiva** — Sofi proporciona feedback emocional basado en el estado de la aplicación (carga, éxito, error, espera).

---

## 🛠️ Stack Tecnológico

| Capa                     | Tecnología                               |
| ------------------------ | ---------------------------------------- |
| **Framework**            | Next.js 15 (React 19, App Router)        |
| **Lenguaje**             | TypeScript (Modo Estricto)               |
| **Estilos**              | Tailwind CSS + Shadcn/UI + Framer Motion |
| **Autenticación**        | Auth.js v5 (NextAuth)                    |
| **Base de Datos**        | Neon DB (PostgreSQL Serverless)          |
| **ORM**                  | Drizzle ORM                              |
| **Internacionalización** | Next-Intl                                |
| **Emails (Magic Links)** | Nodemailer + Gmail SMTP                  |
| **Hosting**              | Vercel                                   |

---

## 🚀 Instalación y Desarrollo Local

### Requisitos previos

* Node.js 20+
* Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless)
* Credenciales OAuth de Google Cloud Console y GitHub Developer Settings
* App Password de Gmail (para Nodemailer)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/Leonardo-YC/todara.git
cd todara
npm install
```

---

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
# ── Base de Datos (Neon) ─────────────────────────
DATABASE_URL=postgresql://...

# ── Auth.js v5 ───────────────────────────────────
AUTH_SECRET=tu-secreto-super-seguro
AUTH_URL=http://localhost:3000

# ── Proveedores OAuth ────────────────────────────
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...

# ── Magic Links (Nodemailer) ─────────────────────
EMAIL_SERVER_USER=tu-correo@gmail.com
EMAIL_SERVER_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=Todara <tu-correo@gmail.com>
```

---

### 3. Migraciones de Base de Datos

```bash
npx drizzle-kit push
```

---

### 4. Iniciar el servidor

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador para ver a Sofi en acción.

---

## 🗺️ Estructura del Proyecto (Clean Architecture)

```plaintext
todara/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)
│   │   │   ├── (dashboard)
│   │   │   ├── (public)
│   │   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── shared/
│   │   └── ui/
│   ├── i18n/
│   └── lib/
│       ├── auth/
│       └── db/
├── messages/
├── public/
└── middleware.ts
```

---

## 🔮 El Futuro de Todara

Actualmente, Todara se encuentra en su fase MVP. Fiel a la filosofía **"Viviendo el proceso"**, las futuras actualizaciones (como colaboración en tiempo real o integración de IA) estarán impulsadas estrictamente por el uso real y el feedback de la comunidad.

---

## 📄 Licencia

Este proyecto es de uso personal y demostrativo. Consulta el archivo `LICENSE` para más detalles.

---

## 🧑‍💻 Autor

**Leonardo Yupán Cruz**

[![GitHub](https://img.shields.io/badge/GitHub-Leonardo--YC-181717?logo=github)](https://github.com/Leonardo-YC)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Leonardo-0a66c2?logo=linkedin)](https://www.linkedin.com/in/leonardo-yupán-crúz-4b7158336/)
[![Instagram](https://img.shields.io/badge/Instagram-_leoyc-e4405f?logo=instagram)](https://www.instagram.com/_leoyc/)

---

<div align="center">
<sub>✨ Diseñado con ❤️ para la comunidad tech · © 2026 Leonardo-YC</sub>
</div>
