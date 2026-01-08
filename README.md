<div align="center">
  <a href="https://todara.vercel.app/">
    <img src="/public/icons/logo.svg" alt="Logo Todara" width="180" height="180">
  </a>

  <h1 align="center">🐶 Todara (Todo Perfect)</h1>

  <p align="center">
    <strong>[English]</strong> A boutique task management app built with excellence in fundamentals: Accessibility, Performance, and Security.
    <br />
    <strong>[Español]</strong> Una aplicación de gestión de tareas "boutique" construida con excelencia en los fundamentos: Accesibilidad, Rendimiento y Seguridad.
  </p>

  <p align="center">
    <a href="https://pagespeed.web.dev/">
      <img src="https://img.shields.io/badge/Lighthouse-100%2F100-success?style=flat-square&logo=lighthouse" alt="Lighthouse Score" />
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square" alt="License GPLv3" />
    </a>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    </a>
  </p>
</div>

---

## 🚀 Live Demo / Demo en Vivo
👉 **[https://todara.vercel.app/](https://todara.vercel.app/)**

---

## ✨ Key Features / Características Clave

| Feature (EN) | Característica (ES) |
|--------------|---------------------|
| **100/100 Performance** | **Rendimiento 100/100**: Optimizado con Next.js y carga diferida. |
| **I18n Support** | **Internacionalización**: Soporte nativo Inglés/Español. |
| **Security First** | **Seguridad**: Middleware de cabeceras HTTP, sanitización de inputs y prevención XSS. |
| **Authentication** | **Autenticación**: Sistema robusto con NextAuth (Magic Links). |
| **PWA Ready** | **PWA**: Instalable y funcional offline. |
| **A11y (Accessibility)** | **Accesibilidad**: Navegación por teclado y soporte para lectores de pantalla. |

---

## 🛠️ Tech Stack / Tecnologías

* **Core:** Next.js 14 (App Router), React 18, TypeScript.
* **Styling:** CSS Modules (Performance & Scoped Styles).
* **Database:** PostgreSQL (Prisma ORM).
* **Auth:** Auth.js (NextAuth).
* **Tools:** ESLint, Prettier, Husky (Git Hooks).
* **Security:** DOMPurify, Security Headers Middleware.

---

## ⚡ Performance & Security / Rendimiento y Seguridad

This project prioritizes "Web Vitals" and Security:
* **Optimized Images:** Using `.webp` and `.avif` formats.
* **Sanitization:** Inputs are cleaned using `isomorphic-dompurify`.
* **Error Handling:** Custom Global Error Boundaries.

*Este proyecto prioriza las "Web Vitals" y la Seguridad:*
* *Imágenes optimizadas con formatos modernos.*
* *Sanitización de entradas para prevenir inyecciones.*
* *Manejo de errores global personalizado.*

---

## 🚀 Getting Started / Instalación Local

1.  **Clone the repo / Clonar repositorio:**
    ```bash
    git clone [https://github.com/LeonardoYC/todara.git](https://github.com/LeonardoYC/todara.git)
    cd todara
    ```

2.  **Install dependencies / Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configure Environment / Configurar Entorno:**
    Create a `.env` file based on `.env.example`.
    *Crea un archivo `.env` basado en `.env.example`.*

4.  **Run Development Server / Correr Servidor:**
    ```bash
    npm run dev
    ```

---

## 📄 License / Licencia

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for details.

*Este proyecto está bajo la **Licencia Pública General GNU v3.0**. Ver el archivo [LICENSE](LICENSE) para más detalles.*

---

Made with ❤️ by **LeonardoYC**.