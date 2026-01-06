# 🐶 Todara (Todo Perfect)

[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100-success?style=flat-square&logo=lighthouse)](https://pagespeed.web.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

> **[English]** A boutique task management app built with excellence in fundamentals: Accessibility, Performance, and Security.
>
> **[Español]** Una aplicación de gestión de tareas "boutique" construida con excelencia en los fundamentos: Accesibilidad, Rendimiento y Seguridad.

---

## 🚀 Live Demo / Demo en Vivo
👉 **[https://todara.app](https://todara.app)** *(Link pendiente de deploy)*

![App Screenshot](/public/icons/logo.svg)

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
* **Styling:** CSS Modules (Performance over utility-first), Tailwind CSS (Utilities).
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
    git clone [https://github.com/tu-usuario/todara.git](https://github.com/tu-usuario/todara.git)
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

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

*Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.*

---

Made with ❤️ by **LeonardoYC**.